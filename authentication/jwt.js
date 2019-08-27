const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

function createToken (payload) {
  return new Promise((res, rej) => {
    jwt.sign(payload, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: `${1000 * 60 * 60 * 24 * 365}`
    }, (err, token) => {
      if (err) {
        throw err
      }
      return res(token)
    })
  })
}

function verifyToken (token) {
  return new Promise((res, rej) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        throw err
      }
      return res(decoded)
    })
  })
}

async function validateTokenMiddleware (req, res, next) {
  try {
    const token = req.headers.authorization
    const decoded = await verifyToken(token)
    req.jwtPayload = decoded
    next()
  } 
  catch (err) {
    return next(err)
  }

}

module.exports = { createToken, validateTokenMiddleware }