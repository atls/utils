# Utils

`@atls/stack-trace` and `@atls/webpack-source-map` publish ESM entrypoints starting with version 1.0.0. Import their APIs from an ESM project:

```js
import { parse } from '@atls/stack-trace'
import { resolve } from '@atls/webpack-source-map'
```

The synchronous `parse` and `resolve` APIs remain available. CommonJS consumers can stay on the 0.0.2 releases until they migrate to ESM.
