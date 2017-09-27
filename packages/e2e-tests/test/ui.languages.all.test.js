const ava = require('ava').default
const db = require('./scaffolding/db')
const browser = require('./scaffolding/browser')
const bb = require('bluebird')

ava.beforeEach('prep docker', async t => {
  await db.container.setup(t.context)
  await browser.setup(t.context)
})
ava.afterEach.always('clean docker', async t => {
  await db.container.teardown(t.context)
  await browser.teardown(t.context)
})

ava('test addinp all languages _but_ python to the db', async t => {
  const { page } = t.context
  await page.waitFor('#submit-python')
  const prevLis = await page.$$('li')
  let buttons = await page.$$('button')
  await bb.mapSeries(buttons, async button => {
    await button.click()
    await bb.delay(3000)
  })
  await page.waitForFunction(`document.getElementsByTagName('li').length === ${prevLis.length + buttons.length}`)
  t.pass()
})
