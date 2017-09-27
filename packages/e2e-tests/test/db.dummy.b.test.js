const ava = require('ava').default
const { container } = require('./scaffolding/db')
const Pouchy = require('pouchy')

ava.beforeEach('prep docker', t => container.setup(t.context))
ava.afterEach.always('clean docker', t => container.teardown(t.context))

ava('test another thing', async t => {
  const dbPort = t.context.dbPort
  const client = new Pouchy({ url: `http://localhost:${dbPort}/lang` })
  let all = await client.all()
  const deleted = await client.delete(all[0])
  t.truthy(deleted.ok)
  all = await client.all()
  t.is(all.length, 3, 'len updates fine!')
})
