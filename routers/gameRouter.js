const express = require('express')
const gameRouter = express.Router()
const { knex } = require('../database/connectToDb')

const { validateTokenMiddleware } = require('../authentication/jwt')

/* DELETE THIS BEFORE PRODUCTION !!!!!!!!!!!!!!!! */
gameRouter.get('/', async (req, res, next) => {
  const allGames = await knex.select().from('games')
  return res.status(418).json({ allGames })
})
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */



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
gameRouter.post('/', validateTokenMiddleware, async (req, res, next) => {
  try {
    const userId = req.jwtPayload.id
    const { score, numOfTouches } = req.body
    const newGameSaved = await knex
      .returning('id')
      .insert({score, num_of_touches: numOfTouches, user_id: userId})
      .into('games')

    if (!newGameSaved[0]) {
      const err = new Error('Did not save game')
      err.status = 400
      return next(err)
    }
    const newGameId = newGameSaved[0]

    const currentDate = new Date()
    const todayTimestamp = `${currentDate.getUTCFullYear()}-${currentDate.getUTCMonth()}-${currentDate.getUTCDate()}`

    const topScoresToday = await knex
      .select('users.username', 'games.user_id', 'games.id', 'games.score', 'games.num_of_touches', 'games.played_on_ts')
      .from('games')
      .innerJoin('users', 'games.user_id', 'users.id')
      .orderBy([{column: 'score', order: 'desc'}, {column: 'num_of_touches', order: 'desc'}])
      .where('played_on_ts', '>=', todayTimestamp)
      .andWhere('score', '>=', score)
    
    const topThreeScoresToday = topScoresToday.slice(0, 3)
    const userRank = topScoresToday.findIndex(game => game.id === newGameId)
    const inTopThree = (userRank <= 2) && (userRank >= 0)

    return res.json({
      topThreeScoresToday,
      userRank,
      userScore: topScoresToday[userRank],
      inTopThree
    })
  } 
  catch (err) {
    return next(err)
  }
})

module.exports = {
  gameRouter
}