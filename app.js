var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')

const passport = require('passport')
const routes = require('./routes')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// session
app.use(
  session({
    secret: '123@A53',
    resave: false,
    saveUninitialized: false,
  }),
)

// passport
app.use(passport.initialize())
require('./auth')

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// home
app.get('/', function (req, res, next) {
  if (req.session.user) {
    res.render('index', {isLogin: true})
  } else res.render('index')
})

app.get('/about', function (req, res, next) {
  if (req.session.user) {
    res.render('about', {isLogin: true})
  } else res.render('about')
})

// account
app.get('/account/register', routes.accountRoute.register)
app.post('/account/register', routes.accountRoute.submitedRegister)
app.get('/account/login', routes.accountRoute.login)
app.post('/account/login', routes.accountRoute.submitedLogin)
app.get('/account/logout', routes.accountRoute.logout)
app.get('/emailconfirmed', routes.accountRoute.emailConfirmation)
app.get('/account/resendemail', routes.accountRoute.resendemail)
app.post('/account/resendemail', routes.accountRoute.submitedResendemail)
app.get('/account/forgotusername', routes.accountRoute.forgotUsername)
app.post('/account/forgotusername', routes.accountRoute.submittedForgotUsername)
app.get('/account/forgotpassword', routes.accountRoute.forgotPassword)
app.post('/account/forgotpassword', routes.accountRoute.submittedForgotPassword)
app.get('/resetpassword', routes.accountRoute.resetPassword)
app.post('/resetpassword', routes.accountRoute.submitedResetPassword)
app.post(
  '/account/loginmultifactor',
  routes.accountRoute.submittedMultiFactorAuth,
)

// my profile
app.get('/users/myprofile', routes.userRoute.myprofile)
app.get('/users/changepassword', routes.userRoute.changePassword)
app.post('/users/changepassword', routes.userRoute.submitedChangePassword)
app.get('/users/multifactor', routes.userRoute.multifactorAuth)
app.post('/users/multifactor', routes.userRoute.submitedMultifactorAuth)

// admin
app.get('/admin/myprofile', routes.adminRoute.myprofile)

// manager
app.get('/manager/myprofile', routes.managerRoute.myprofile)
app.get('/manager/dashboard', routes.managerRoute.dashboard)

module.exports = app

/*
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
*/
