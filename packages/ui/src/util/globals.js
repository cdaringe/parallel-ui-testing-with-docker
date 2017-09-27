import * as bb from 'bluebird'

const DEFAULT_GLOBALS = {
  DB_PORT: 5984
}

/**
 * create-react-app injects its own opinion of NODE_ENV, which is good, unless
 * our test suite _isn't run via CRA's desired `npm test`_.  Because we run our tests
 * externally, we may need to specify NODE_ENV=test, and want it honored.  CRA
 * won't honor that, so we have precidence in determining the final NODE_ENV:
 * - REACT_APP_NODE_ENV
 * - NODE_ENV
 * - 'production'
 */
export function getEnv () {
  const { NODE_ENV, REACT_APP_NODE_ENV } = process.env
  return REACT_APP_NODE_ENV || NODE_ENV || 'production'
}

export async function getGlobals () {
  console.log(`NODE_ENV: ${getEnv()}`)
  if (getEnv().match(/test/i)) {
    console.log('test mode // await test env')
    while (!window.__test_globals) {
      console.log('waiting for env...')
      await bb.delay(1000)
    }
    const globals = window.__test_globals
    if (!globals.DB_PORT) throw new Error('missing DB_PORT from test globals')
    return {
      DB_PORT: globals.DB_PORT
    }
  }
  console.log('globals::using defaults')
  return DEFAULT_GLOBALS
}
