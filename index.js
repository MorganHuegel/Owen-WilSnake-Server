const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use((req, res, next) => {
  console.log('---------------------------After Cors Middleware---------------------------')
  console.log(req.headers)
  next()
})
app.use(express.json())

const { PORT } = require('./config')
const { userRouter } = require('./routers/userRouter')
const { gameRouter } = require('./routers/gameRouter')


app.use('/users', userRouter)
app.use('/games', gameRouter)


//All errors will be handled here at the end of the pipeline
app.use((err, req, res, next) => {
  if (err) {
    if (err.code === 'ECONNREFUSED') err.message = 'Database connection refused. Try again.'
    // Means its a custom error from up the pipeline
    console.error('ERROR: ', err)
    return res.status(err.status || 500).json({error: err.message})
  } else {
    // Means its an unhandled error
    return res.status(500).json({error: 'Something went wrong :('})
  }
})

app.listen(PORT, () => {
  console.info('App listening on port ' + PORT)
})