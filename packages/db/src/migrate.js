'use strict'

require('perish')
const Pouchy = require('pouchy')
const execa = require('execa')
const bb = require('bluebird')

async function migrate () {
  console.log('booting server')
  const server = execa('node', ['/db/node_modules/.bin/pouchdb-server'], {
    env: Object.assign({}, process.env, { DEBUG: '*' })
  })
  server.stdout.pipe(process.stdout)
  await bb.delay(10000)
  const db = new Pouchy({ url: 'http://127.0.0.1:5984/lang' })
  await db.save({ 'name': 'javascript', 'is': 'easy' })
  await db.save({ 'name': 'rust', 'is': 'safe' })
  await db.save({ 'name': 'erlang', 'is': 'interesting' })
  await db.save({ 'name': 'java', 'is': 'nt cool anymore' })
  console.log(`added: ${await db.all()}`)
  server.kill()
}

migrate()
