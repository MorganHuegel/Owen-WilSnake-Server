const bcrypt = require('bcryptjs')
const saltRounds = 8

function hashPassword(password){
  return new Promise((res, rej) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        throw err
      }
      return res(hash)
    })
  })
}

module.exports = { hashPassword }