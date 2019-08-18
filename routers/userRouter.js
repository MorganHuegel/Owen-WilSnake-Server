const express = require('express')
const userRouter = express.Router()
const { knex } = require('../database/connectToDb')
const { hashPassword, validatePassword } = require('../authentication/bcrypt')
const { createToken, validateTokenMiddleware } = require('../authentication/jwt')

/* DELETE THIS BEFORE PRODUCTION !!!!!!!!!!!!!!!! */
userRouter.get('/', async (req, res, next) => {
  const allUsers = await knex.select().from('users')
  return res.status(418).json({ allUsers })
})
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */




// Register new user
userRouter.post('/register', async (req, res, next) => {
  try {
    const { username, password, phoneId, email } = req.body
    const hashedPassword = await hashPassword(password)
    const userId = await knex
      .insert({
        username, 
        password_hash: hashedPassword, 
        phone_id: phoneId, 
        email
      })
      .into('users')
      .returning('id')

    return res.status(201).json({userId})
  } 
  catch (err) {
    if (err.code === '23505') {
      let duplicateField;
      if (err.detail.includes('phone_id')) duplicateField = 'phoneId'
      else if (err.detail.includes('username')) duplicateField = 'username'
      else if (err.detail.includes('email')) duplicateField = 'email'

      const error = new Error(`${duplicateField} is already taken and must be unique.`)
      error.status = 400
      return next(error)
    } else {
      return next(err)
    }
  }
})



// Login an existing user by username or phoneId
userRouter.post('/login', async (req, res, next) => {
  try {
    const { username, password, phoneId } = req.body
    let userData;
    if (username) {
      userData = await knex
        .select('id', 'username', 'password_hash', 'phone_id')
        .from('users')
        .where({ username })
    } else if (phoneId) {
      userData = await knex
      .select('id', 'username', 'password_hash', 'phone_id')
      .from('users')
      .where({ phone_id: phoneId })
    }

    if (userData.length > 1) {
      const error = new Error('Username or phoneId is not unique! Multiple users were returned. Yikes!')
      error.status = 500
      return next(error)
    } else {
      userData = userData[0]
    }

    const validPassword = await validatePassword(password, userData.password_hash)
    if (!validPassword) {
      const error = new Error('Password is not valid.')
      error.status = 400
      return next(error)
    }
    delete userData.password_hash
    const webToken = await createToken(userData)
    return res.json({webToken})
  } catch (err) {
    return next(err)
  }
})


userRouter.put('/', validateTokenMiddleware, (req, res, next) => {
  const { userId, username, phone_id } = req.jwtPayload
  //search by userId and then make updates from there
  return res.json({payload: req.jwtPayload})
})

module.exports = {
  userRouter
}