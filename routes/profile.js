'use strict'

var bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../db')
const config = require('../config')
const jwt = require('jsonwebtoken')

module.exports.myprofile = [
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/account/login',
  }),
  (req, res) => {
    console.log('call detail -->myprofile')
    console.log(req.user)
    db.users.getProfile(req.user.Username, function (err, profile) {
      res.render('profile/myprofile', {
        Username: req.user.Username,
        FullName: profile.FullName,
        isLogin: true,
      })
    })
  },
]

module.exports.changePassword = [
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/account/login',
  }),
  (req, res) => {
    res.render('profile/changepassword', {
      ErrorMessage: '',
      isError: false,
      isLogin: true,
    })
  },
]
module.exports.submitedChangePassword = [
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/account/login',
  }),
  (req, res) => {
    if (req.body.NewPassword !== req.body.NewPassword2)
      return res.render('profile/changepassword', {
        ErrorMessage: 'A new password should be similar to retyped password',
        isError: true,
        isLogin: true,
      })

    db.users.findByUsername(req.user.Username, function (err, user) {
      if (err)
        return res.render('profile/changepassword', {
          ErrorMessage: 'There is any error to change password',
          isError: true,
          isLogin: true,
        })

      if (user) {
        var hash = bcrypt.hashSync(req.body.Password, user.Salt)
        if (hash !== user.PasswordHash)
          return res.render('profile/changepassword', {
            ErrorMessage: 'Invalid current password',
            isError: true,
            isLogin: true,
          })

        var salt = bcrypt.genSaltSync(10)
        var newhash = bcrypt.hashSync(req.body.NewPassword, salt)
        db.users.updateUser(
          {
            Id: req.user.Id,
            Salt: salt,
            PasswordHash: newhash,
          },
          function (err, done) {
            if (err)
              return res.render('profile/changepassword', {
                ErrorMessage: 'There is any error to change password',
                isError: true,
                isLogin: true,
              })

            // clear session
            req.session.destroy(function () {
              console.log('user logged out.')
            })
            // clear cookie
            res.clearCookie('AuthToken')

            res.render('account/changeconfirmed', {
              SubTitle: 'Changed Password Confirmation',
              Item: 'password',
            })
          },
        )
      } else {
        res.render('profile/changepassword', {
          ErrorMessage: 'There is any error to change password',
          isError: true,
        })
      }
    })
  },
]

module.exports.multifactorAuth = [
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/account/login',
  }),
  (req, res) => {
    db.users.findById(req.user.Id, function (err, user) {
      if (err) {
        return res.render('profile/multifactor', {isError: true, isLogin: true})
      }
      console.log(user)
      res.render('profile/multifactor', {
        isError: false,
        multifactor: user.TwoFactorEnabled == 1 ? 'checked' : '',
        isLogin: true,
      })
    })
  },
]
module.exports.submitedMultifactorAuth = [
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/account/login',
  }),
  (req, res) => {
    var multifactor = false
    if (req.body.multifactor != null && req.body.multifactor != undefined)
      multifactor = req.body.multifactor

    var user = {
      Id: req.user.Id,
      TwoFactorEnabled: multifactor ? 1 : 0,
    }
    db.users.updateUser(user, function (e, done) {
      if (e)
        return res.render('profile/multifactor', {isError: true, isLogin: true})

      res.redirect('/users/myprofile')
    })
  },
]
