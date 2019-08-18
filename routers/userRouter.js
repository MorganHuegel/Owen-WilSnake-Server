const express = require('express')
const userRouter = express.Router()
const { knex } = require('../database/connectToDb')
const { hashPassword } = require('../authentication/bcrypt')

/* DELETE THIS BEFORE PRODUCTION !!!!!!!!!!!!!!!! */
userRouter.get('/', async (req, res, next) => {
  const allUsers = await knex.select().from('users')
  return res.status(418).json({ allUsers })
})
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */


// REGISTER NEW USER
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


userRouter.get('/login', async (req, res, next) => {
  try {

  } catch (err) {

  }
  return res.json({message: 'In the user router /get handler'})
})

module.exports = {
  userRouter
}