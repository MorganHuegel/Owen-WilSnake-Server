const knex = require('knex')
const { DB_URL } = require('../config')

knex({
  client: 'pg',
  connection: DB_URL
})