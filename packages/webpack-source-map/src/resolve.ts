import type { SourceMapPayload } from 'node:module'

import { readFileSync }          from 'node:fs'
import { SourceMap }             from 'node:module'
import { fileURLToPath }         from 'node:url'

const modulePath = fileURLToPath(import.meta.url)
const sourceUrlPattern = /sourceURL=([^\\\s"]+)/gu

export const load = (file: string, target: string = modulePath): string | null => {
  try {
    // eslint-disable-next-line n/no-sync
    const source = readFileSync(target, 'utf8')
    const sourceUrl = new URL(file).href
    const line = source.split(/\r?\n/u).find((candidate) => {
      for (const [, match] of candidate.matchAll(sourceUrlPattern)) {
        if (!match.startsWith('webpack-internal://')) continue

        if (new URL(match).href === sourceUrl) return true
      }

      return false
    })

    if (!line) throw new Error('Source URL not found')

    return line
  } catch (error: unknown) {
    process.emitWarning(
      `Loading webpack source error: ${error instanceof Error ? error.message : String(error)}`
    )

    return null
  }
}

export const parse = (source: string): SourceMapPayload | null => {
  try {
    // eslint-disable-next-line prefer-regex-literals
    const dataUriRegExp = new RegExp('(?<=base64,)(.*?)(?=\\\\n)')

    const [datauri] = source.match(dataUriRegExp) || []

    if (datauri) {
      return JSON.parse(Buffer.from(datauri, 'base64').toString()) as SourceMapPayload
    }
  } catch (error: unknown) {
    process.emitWarning(
      `Parse webpack source error: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  return null
}

export const extract = (file: string, target?: string) => {
  const source = load(file, target)

  if (source) {
    const content = parse(source)

    if (content) {
      return new SourceMap(content)
    }
  }

  return null
}

export const resolve = (file: string, target?: string): SourceMap | null => {
  if (!file.includes('webpack-internal://')) {
    return null
  }

  return extract(file, target)
}
