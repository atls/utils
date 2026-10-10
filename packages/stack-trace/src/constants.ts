// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
declare const __webpack_require__: unknown

export const isWebpackEnv = typeof __webpack_require__ === 'function'
export const isProdEnv = process.env.NODE_ENV === 'production'
