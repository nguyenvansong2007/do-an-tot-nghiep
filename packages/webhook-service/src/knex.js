'use strict'
const Environment = require('@speckle/shared/dist/commonjs/environment/index.js')
const {
  loadMultiRegionsConfig,
  configureKnexClient
} = require('@speckle/shared/dist/commonjs/environment/multiRegionConfig.js')
const { logger } = require('./observability/logging')

const { FF_WORKSPACES_MULTI_REGION_ENABLED } = Environment.getFeatureFlags()

const isDevEnv = process.env.NODE_ENV !== 'production'

let dbClients
const getDbClients = async () => {
  if (dbClients) return dbClients
  const maxConnections =
    parseInt(process.env.POSTGRES_MAX_CONNECTIONS_WEBHOOK_SERVICE) || 1

  const configArgs = {
    migrationDirs: [],
    isTestEnv: isDevEnv,
    isDevOrTestEnv: isDevEnv,
    logger,
    maxConnections,
    applicationName: 'speckle_webhook_service'
  }
  if (!FF_WORKSPACES_MULTI_REGION_ENABLED) {
    const mainClient = configureKnexClient(
      {
        postgres: {
          connectionUri:
            process.env.PG_CONNECTION_STRING ||
            'postgres://speckle:speckle@103.221.221.170/speckle'
        }
      },
      configArgs
    )
    dbClients = { main: mainClient }
  } else {
    const configPath = process.env.MULTI_REGION_CONFIG_PATH || 'multiregion.json'
    const config = await loadMultiRegionsConfig({ path: configPath })
    const clients = [['main', configureKnexClient(config.main, configArgs)]]
    Object.entries(config.regions).map(([key, config]) => {
      clients.push([key, configureKnexClient(config, configArgs)])
    })
    dbClients = Object.fromEntries(clients)
  }
  return dbClients
}

module.exports = getDbClients
