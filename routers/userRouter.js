const express = require('express')
const userRouter = express.Router()
const { knex } = require('../database/connectToDb')
const { hashPassword, validatePassword } = require('../authentication/bcrypt')

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
      if (err.detail.search('phone_id')) duplicateField = 'phoneId'
      else if (err.detail.search('username')) duplicateField = 'username'
      else if (err.detail.search('email')) duplicateField = 'email'

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
        .select('username', 'password_hash', 'phone_id')
        .from('users')
        .where({ username })
    } else if (phoneId) {
      userData = await knex
      .select('username', 'password_hash', 'phone_id')
      .from('users')
      .where({ phone_id: phoneId })
    }

    if (userData.length > 1) {
      const error = new Error('Username or phoneId is not unique! Multiple users were returned. Yikes!')
      error.status = 500
      return next(error)
    }

    const validPassword = await validatePassword(password, userData[0].password_hash)
    if (!validPassword) {
      const error = new Error('Password is not valid.')
      error.status = 400
      return next(error)
    }
    //CREATE JSON WEB TOKEN
    return res.json(userData)
  } catch (err) {

  }
  return res.json({message: 'In the user router /get handler'})
})

module.exports = {
  userRouter
}