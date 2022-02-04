'use strict'

const passport = require('passport')
var JwtStrategy = require('passport-jwt').Strategy

const db = require('../db')
const config = require('../config')

var opts = {}

if (config.EnableRememberMe) {
  opts.jwtFromRequest = (req) =>
    req.cookies.AuthToken ? req.cookies.AuthToken : req.session.user
} else {
  opts.jwtFromRequest = (req) => req.session.user
}

opts.secretOrKey = config.Secret

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    db.users.findById(jwt_payload.id, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        return done(null, {Id: user.Id, Username: user.Username})
      } else {
        return done(null, false)
      }
    })
  }),
)
