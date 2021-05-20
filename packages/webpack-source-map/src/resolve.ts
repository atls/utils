import { SourceMap } from 'module'
import { execSync }  from 'child_process'

export const load = (file, target: string = __filename) => {
  try {
    const sourceUrl = file.replace(/\$/g, '\\$')

    return execSync(`grep -r "sourceURL=${sourceUrl}" ${target}`).toString()
  } catch (error) {
    process.emitWarning(`Loading webpack source error: ${error.message}`)

    return null
  }
}

export const parse = (source) => {
  try {
    const dataUriRegExp = new RegExp('(?<=base64,)(.*?)(?=\\\\n)')

    const [datauri] = source.match(dataUriRegExp) || []

    if (datauri) {
      return JSON.parse(Buffer.from(datauri, 'base64').toString())
    }
  } catch (error) {
    process.emitWarning(`Parse webpack source error: ${error.message}`)
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
