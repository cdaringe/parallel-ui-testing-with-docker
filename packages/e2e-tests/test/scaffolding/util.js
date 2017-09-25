'use strict'

const _freeport = require('freeport')
const pify = require('pify')
const Docker = require('dockerode')
const docker = new Docker({ socketPath: '/var/run/docker.sock' })
const bb = require('bluebird')
const containers = new Set()

async function containerSetup (ctx) {
  const port = await freeport()
  console.log(`booting container on port ${port}`)
  const container = await docker.createContainer({
    Image: 'dummy_db',
    ExposedPorts: {
      '5984/tcp': {}
    },
    PortBindings: { '5984/tcp': [{ HostPort: port.toString() }] }
  })
  await container.start()
  await bb.delay(5000)
  containers.add(container)
  ctx.dbContainer = container
  ctx.dbPort = port
}

async function containerTeardown (ctx) {
  console.log(`removing container on port ${ctx.dbPort}`)
  const container = ctx.dbContainer
  containers.delete(container)
  try {
    container.stop() // cant figure out why. this messes w/ execution. probably a runtime bug. no `await`
  } finally {
    await container.remove({ force: true })
  }
}

function freeport () {
  return pify(_freeport)()
}

module.exports = {
  containerSetup,
  containerTeardown
}
