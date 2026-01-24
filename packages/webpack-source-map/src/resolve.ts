import type { SourceMapPayload } from 'module'

import { SourceMap }             from 'module'
import { execSync }              from 'child_process'

export const load = (file: string, target: string = __filename): string | null => {
  try {
    const sourceUrl = file.replace(/\$/g, '\\$')

    return execSync(`grep -r "sourceURL=${sourceUrl}" ${target}`).toString()
  } catch (error: any) {
    process.emitWarning(`Loading webpack source error: ${error.message as string}`)

    return null
  }
}

export const parse = (source: string): SourceMapPayload | null => {
  try {
    // eslint-disable-next-line prefer-regex-literals
    const dataUriRegExp = new RegExp('(?<=base64,)(.*?)(?=\\\\n)')

    const [datauri] = source.match(dataUriRegExp) || []

    if (datauri) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(Buffer.from(datauri, 'base64').toString())
    }
  } catch (error: any) {
    process.emitWarning(`Parse webpack source error: ${error.message as string}`)
  }

  return null
}

export const extract = (file: string, target?: string): SourceMap | null => {
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
