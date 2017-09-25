const ava = require('ava').default
const { containerSetup, containerTeardown } = require('./scaffolding/util')
const Pouchy = require('pouchy')
const bb = require('bluebird')

ava.beforeEach('prep docker', async t => {
  await containerSetup(t.context)
})

ava.afterEach.always('clean docker', async t => {
  containerTeardown(t.context)
})

ava('test another thing', async t => {
  const dbPort = t.context.dbPort
  const client = new Pouchy({ url: `http://localhost:${dbPort}/lang` })
  let all = await client.all()
  // const deleted = await client.delete(all[0])
  // t.truthy(deleted.ok)
  all = await client.all()
  t.is(all.length, 4, 'len updates fine!')
})
