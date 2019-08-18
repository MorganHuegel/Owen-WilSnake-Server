const express = require('express')
const gameRouter = express.Router()

gameRouter.get('/', (req, res) => {
  return res.json({message: 'In the game router /get handler'})
})

module.exports = {
  gameRouter
}