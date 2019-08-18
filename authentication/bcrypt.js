const bcrypt = require('bcryptjs')
const saltRounds = 8

function hashPassword (password) {
  return new Promise((res, rej) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        throw err
      }
      return res(hash)
    })
  })
}

function validatePassword (password, hash) {
  return new Promise((res, rej) => {
    bcrypt.compare(password, hash, (err, valid) => {
      if (err) {
        throw err
      }
      return res(valid)
    })
  })
}

module.exports = { hashPassword, validatePassword }