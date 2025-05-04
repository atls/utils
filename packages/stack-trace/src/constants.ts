// @ts-expect-error
export const isWebpackEnv = typeof __webpack_require__ === 'function'
export const isProdEnv = process.env.NODE_ENV === 'production'
