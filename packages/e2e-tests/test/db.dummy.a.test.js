const test = require('ava').default
const { container } = require('./scaffolding/db')
const Pouchy = require('pouchy')

test.beforeEach('prep docker', t => container.setup(t.context))
test.afterEach.always('clean docker', t => container.teardown(t.context))

test('that db image has baseline documents', async t => {
  const dbPort = t.context.dbPort
  const client = new Pouchy({ url: `http://localhost:${dbPort}/lang` })
  const docs = await client.all()
  t.truthy(docs.some(({ name, is }) => name === 'javascript' && is === 'easy'), 'docs r found')
  t.truthy(docs.some(({ name, is }) => name === 'rust' && is === 'safe'), 'docs r found some mo')
})
