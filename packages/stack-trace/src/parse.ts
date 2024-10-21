import type { StackFrame } from './stack-trace.js'

import StackUtils          from 'stack-utils'

import { resolve }         from '@atls/webpack-source-map'

import { StackTrace }      from './stack-trace'
import { isWebpackEnv }    from './constants'
import { isProdEnv }       from './constants'

export const parse = (stack: string): StackTrace => {
  const lines = stack.split('\n')

  const cwd = process.cwd()
  const stackUtils = new StackUtils({ cwd })

  const frames = lines.reduce((result: Array<StackFrame>, line) => {
    const frame: StackFrame | null = stackUtils.parseLine(line.trim())

    if (frame) {
      if (frame.file && isWebpackEnv && !isProdEnv) {
        const sourceMap = resolve(frame.file, __filename)

        if (sourceMap) {
          frame.sourceMap = sourceMap

          frame.file = sourceMap.payload.file
            .replace('.ts.js', '.ts')
            .replace('.tsx.js', '.tsx')
            .replace('.js.js', '.js')

          if (frame.line && frame.column) {
            const entry = sourceMap.findEntry(frame.line, frame.column)

            if (entry) {
              frame.line = entry.originalLine
              frame.column = entry.originalColumn
            }
          }
        }
      }

      result.push(frame)
    }

    return result
  }, [])

  return new StackTrace(frames)
}
