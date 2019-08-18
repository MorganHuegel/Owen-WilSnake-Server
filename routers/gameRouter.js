const express = require('express')
const gameRouter = express.Router()
const { knex } = require('../database/connectToDb')



// GET ALL GAMES FOR SINGLE USER
gameRouter.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params
    const allGames = await knex
      .select()
      .from('games')
      .where({user_id: userId})

    return res.json({games: allGames}).status(200)
  } 
  catch (err) {
    return next(err)
  }
})



// GETS TOP 10 HIGH SCORES BY USER, GIVEN TIME RANGE IN QUERY
gameRouter.get('/highScores/:userId', async (req, res, next) => {
  try {
    /* dates must be formatted "YYYY-MM-DD HH:MM:SS" 
      (start date use 00:00:00, end date use 23:59:59) */
    const fromDate = req.query.fromDate || '2000-01-01 00:00:00'
    const toDate = req.query.toDate || '2099-01-01 23:59:59'
    const { userId } = req.params

    const topGames = await knex
      .select()
      .from('games')
      .where({'user_id': userId})
      .whereBetween('played_on_ts', [fromDate, toDate])
      .orderBy('score', 'desc')
      .limit(10)

    return res.json({games: topGames}).status(200)
  } 
  catch (err) {
    return next(err)
  }
})



// GETS TOP 10 HIGH SCORES GIVEN TIME RANGE IN QUERY
gameRouter.get('/highScores/', async (req, res, next) => {
  try {
    /* dates must be formatted "YYYY-MM-DD HH:MM:SS" 
      (start date use 00:00:00, end date use 23:59:59) */
    const fromDate = req.query.fromDate || '2000-01-01 00:00:00'
    const toDate = req.query.toDate || '2099-01-01 23:59:59'

    const topGames = await knex
      .select()
      .from('games')
      .whereBetween('played_on_ts', [fromDate, toDate])
      .orderBy('score', 'desc')
      .limit(10)

    return res.json({games: topGames}).status(200)
  } 
  catch (err) {
    return next(err)
  }
})



// SAVE GAME DATA AFTER OWEN DIES
gameRouter.post('/', async (req, res, next) => {
  try {
    const { score, numOfTouches, userId } = req.body
    const newGameId = await knex
      .returning('id')
      .insert({score, num_of_touches: numOfTouches, user_id: userId})
      .into('games')

    return res.json({newGameId}).send(201)
  } 
  catch (err) {
    return next(err)
  }
})

module.exports = {
  gameRouter
}