// MDN claims we should be able to export directly, but it doesn't seem to work
//   export * as name1 from …;
// https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export

import * as apollo from './apollo';
import * as koaMiddleware from './koa-middleware';

export {apollo, koaMiddleware};
