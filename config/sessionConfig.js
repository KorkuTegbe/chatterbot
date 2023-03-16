const session = require('express-session')
const MongoStore = require('connect-mongo')  //(session)
const mongoose = require('mongoose')

// Set up a MongoDB connection
mongoose.connect('mongodb://localhost:27017/chatSessions', {
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
    mongoUrl: 'mongodb://localhost:27017/chatSessions',
    collection: 'sessions',

})

const sessionMiddleware = session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: oneDay },
  store: store
})

// sessionStore

module.exports = {
  sessionMiddleware,
  store,
}
