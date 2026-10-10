import type { SourceMap }     from 'node:module'
import type { StackLineData } from 'stack-utils'

export interface StackFrame extends StackLineData {
  line?: number
  column?: number
  file?: string
  constructor?: boolean
  evalOrigin?: string
  native?: boolean
  function?: string
  method?: string
  evalLine?: number
  evalColumn?: number
  evalFile?: string
  sourceMap?: SourceMap
}

export class StackTrace {
  constructor(public readonly frames: Array<StackFrame>) {}

  get topFrame() {
    return this.frames.find((entry) => entry.file)
  }
}
