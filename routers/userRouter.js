const express = require('express')
const userRouter = express.Router()

userRouter.get('/', (req, res) => {
  return res.json({message: 'In the user router /get handler'})
})

module.exports = {
  userRouter
}