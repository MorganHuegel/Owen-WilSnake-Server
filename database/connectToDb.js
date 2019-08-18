const { DB_URL } = require('../config')
const knex = require('knex')({
  client: 'pg',
  connection: DB_URL,
  acquireConnectionTimeout: 10000
})

module.exports = { knex }

// FOR PRODUCTION...
// var knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host : '127.0.0.1',
//     user : 'your_database_user',
//     password : 'your_database_password',
//     database : 'myapp_test'
//   }
// });