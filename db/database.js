const {Sequelize} = require('sequelize')
const config = require('../config')
const initModels = require('../models/init-models')

const {DBServer, Database, DBuserID, DBUserPassword, DBDialect} =
  config.Database

const options = {
  host: DBServer,
  dialect: DBDialect,
}

const sequelize = new Sequelize(Database, DBuserID, DBUserPassword, options)

const models = initModels(sequelize)

module.exports = {sequelize, models, Sequelize}
