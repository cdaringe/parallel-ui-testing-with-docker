'use strict'

const pify = require('pify')
const freeport = pify(require('freeport'))
const Docker = require('dockerode')
const docker = new Docker({ socketPath: '/var/run/docker.sock' })
const bb = require('bluebird')
const containers = new Set()

const container = {
  /**
   * Launches a new database container for a test.  Identifies a free port
   * on the host system to bind the database's port to and boots it.
   * @param {AvaContext} ctx
   * @returns {Promise}
   */
  async setup (ctx) {
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
  },
  /**
   * Stops and removes the container used for the test
   * @param {AvaContext} ctx
   * @returns {Promise}
   */
  async teardown (ctx) {
    console.log(`removing container on port ${ctx.dbPort}`)
    const container = ctx.dbContainer
    containers.delete(container)
    try {
      container.stop() // cant figure out why. this messes w/ execution. probably a runtime bug. no `await`
    } finally {
      await container.remove({ force: true })
    }
  }
}

module.exports = {
  container
}
