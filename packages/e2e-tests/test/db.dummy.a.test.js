const ava = require('ava').default
const { container } = require('./scaffolding/db')
const Pouchy = require('pouchy')

ava.beforeEach('prep docker', t => container.setup(t.context))
ava.afterEach.always('clean docker', t => container.teardown(t.context))

ava('test db image', async t => {
  const dbPort = t.context.dbPort
  const client = new Pouchy({ url: `http://localhost:${dbPort}/lang` })
  const docs = await client.all()
  t.truthy(docs.some(({ name, is }) => name === 'javascript' && is === 'easy'), 'docs r found')
  t.truthy(docs.some(({ name, is }) => name === 'rust' && is === 'safe'), 'docs r found some mo')
})
