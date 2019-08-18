const express = require('express')
const userRouter = express.Router()

userRouter.get('/login', async (req, res, next) => {
  try {

  } catch (err) {
    
  }
  return res.json({message: 'In the user router /get handler'})
})

module.exports = {
  userRouter
}