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
  authorization.authorize('ADMIN'),
  (req, res) => {
    console.log('call detail -->myprofile')
    console.log(req.user)
    db.users.getProfile(req.user.Username, function (err, profile) {
      res.render('admin/index', {
        Username: req.user.Username,
        FullName: profile.FullName,
        isLogin: true,
      })
    })
  },
]
