const express = require('express')
const cors = require('cors')
const app = express()
const {router: userRouter} = require('./routes/user')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res, next) => {
  res.status(200).json({message: 'node.js authN AuthZ'})
})

app.use(userRouter)

module.exports = app
