const session = require('express-session')
const MongoStore = require('connect-mongo') 
const mongoose = require('mongoose')
require('dotenv').config()

// Set up a MongoDB connection
mongoose.connect(
  process.env.REMOTE_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('MongoDB connected!')
})

const oneDay = 1000 * 60 * 60 * 24

const store = new MongoStore({
    mongooseConnection: db,
    mongoUrl: process.env.REMOTE_DB,
    collection: 'sessions',
})

const sessionMiddleware = session({
  name: 'chatterbot',
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { 
    name: 'chatterbot',
    secure: true, 
    httpOnly: true,
    maxAge: oneDay
  },
  store: store
})

module.exports = {
  sessionMiddleware,
  store,
}
