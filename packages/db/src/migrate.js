'use strict'

require('perish')
const Pouchy = require('pouchy')
const execa = require('execa')
const bb = require('bluebird')

async function migrate () {
  let migrated = false
  console.log('booting server')
  const server = execa(
    'node',
    [
      '/db/node_modules/.bin/pouchdb-server',
      '--level-backend',
      'sqldown'
    ],
    {
      env: Object.assign({}, process.env, { DEBUG: '' })
    }
  )
  server.stdout.pipe(process.stdout)
  server.stderr.pipe(process.stderr)
  server.catch(err => {
    if (migrated) return
    console.error(err)
    process.exit(1)
  })
  await bb.delay(6000)
  const db = new Pouchy({ url: 'http://127.0.0.1:5984/lang' })
  await db.save({ 'name': 'javascript', 'is': 'easy' })
  await db.save({ 'name': 'rust', 'is': 'safe' })
  await db.save({ 'name': 'erlang', 'is': 'interesting' })
  await db.save({ 'name': 'java', 'is': 'not cool anymore' })
  console.log(`added: ${(await db.all()).length} docs`)
  migrated = true
  server.kill()
}

migrate()
