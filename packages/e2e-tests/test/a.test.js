const ava = require('ava').default
const { containerSetup, containerTeardown } = require('./scaffolding/util')
const Pouchy = require('pouchy')

ava.beforeEach('prep docker', async t => {
  await containerSetup(t.context)
})

ava.afterEach.always('clean docker', async t => {
  containerTeardown(t.context)
})

ava('test db image', async t => {
  const dbPort = t.context.dbPort
  const client = new Pouchy({ url: `http://localhost:${dbPort}/lang` })
  const docs = await client.all()
  t.truthy(docs.some(({ name, is }) => name === 'javascript' && is === 'easy'), 'docs r found')
  t.truthy(docs.some(({ name, is }) => name === 'rust' && is === 'safe'), 'docs r found some mo')
})
