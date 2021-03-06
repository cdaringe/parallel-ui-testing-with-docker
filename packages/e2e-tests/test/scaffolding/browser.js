'use strict'

const puppeteer = require('puppeteer')
const DISABLE_HEADLESS = !!process.env.DISABLE_HEADLESS

module.exports = {
  /**
   * Launches a browser and navigates to our browser app.  Injects test run
   * context into the app, such as the database port, so the app can run against
   * the correct backend db.
   * @param {*} ctx
   * @returns {Promise}
   */
  async setup (ctx) {
    // prep browser global context
    if (!ctx.dbPort) throw new Error('missing db port')
    const browserGlobals = { DB_PORT: ctx.dbPort }

    // launch browser and inject globals into page
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
      headless: DISABLE_HEADLESS
    })
    const page = await browser.newPage()
    await page.goto('http://localhost:3000')
    await page.waitFor('.App')
    await page.evaluate(function setTestGlobals (globals) {
      console.log('INJECTING TEST ENV')
      window.__test_globals = globals
    }, browserGlobals)
    Object.assign(ctx, { browser, page })
  },
  /**
   * Ends the test browser section
   * @param {AvaContext} ctx
   * @returns {Promise}
   */
  teardown (ctx) {
    return ctx.browser.close()
  }
}
