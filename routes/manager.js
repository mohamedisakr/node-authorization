'use strict'

var bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../db')
const config = require('../config')
const jwt = require('jsonwebtoken')
const authorization = require('../auth/authorization')

module.exports.myprofile = [
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/account/login',
  }),
  authorization.authorize('MANAGER'),
  (req, res) => {
    console.log('call detail -->myprofile')
    console.log(req.user)
    db.users.getProfile(req.user.Username, function (err, profile) {
      res.render('manager/index', {
        Username: req.user.Username,
        FullName: profile.FullName,
        isLogin: true,
      })
    })
  },
]

module.exports.dashboard = [
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/account/login',
  }),
  authorization.authorize('MANAGER', 'ADMIN'),
  (req, res) => {
    console.log('call detail -->myprofile')
    console.log(req.user)
    db.users.getProfile(req.user.Username, function (err, profile) {
      res.render('manager/dashboard', {
        Username: req.user.Username,
        FullName: profile.FullName,
        isLogin: true,
      })
    })
  },
]
