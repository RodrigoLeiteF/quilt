import * as apollo from '../apollo';
import * as koaMiddleware from '../koa-middleware';

import * as all from '..';

describe('index', () => {
  it('exports apollo', () => {
    expect(all.apollo).toStrictEqual(apollo);
  });

  it('exports koaMiddleware', () => {
    expect(all.koaMiddleware).toStrictEqual(koaMiddleware);
  });
});
