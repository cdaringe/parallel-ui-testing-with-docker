const ava = require('ava').default
const db = require('./scaffolding/db')
const browser = require('./scaffolding/browser')

ava.beforeEach('prep docker & browser', async t => {
  await db.container.setup(t.context)
  await browser.setup(t.context)
})
ava.afterEach.always('clean docker & browser', async t => {
  await db.container.teardown(t.context)
  await browser.teardown(t.context)
})

ava('test adding python facts to list', async t => {
  const { page } = t.context
  await page.waitFor('#submit-python')
  await page.click('#submit-python')
  await page.waitFor('[data-hook="lang-python"]')
  t.pass()
})
