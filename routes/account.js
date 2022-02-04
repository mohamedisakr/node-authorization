'use strict'

var bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../db')
const config = require('../config')
const jwt = require('jsonwebtoken')
const utils = require('../helpers/utils')

function checkUsernameEmail(req, res, done) {
  db.users.findByUsername(req.body.Username, function (err, usr) {
    if (err) {
      return done('There was any error on server', null)
    }
    if (usr) {
      return done('Username was used by other user', null)
    }
    db.users.findByEmail(req.body.Email, function (e, user) {
      if (err) {
        return done('There was any error on server', null)
      }
      if (user) {
        return done('Email was used by other user', null)
      }
      done(null, true)
    })
  })
}
function processRegistration(req, res) {
  var reg = {
    isError: true,
    useCaptcha: config.EnableCaptcha,
    ReCaptchaKey: config.ReCaptchaSettings.Key,
    model: {
      Username: req.body.Username,
      Email: req.body.Email,
      FullName: req.body.FullName,
    },
  }
  // validate username and email
  checkUsernameEmail(req, res, function (e, ret) {
    if (e) {
      reg.ErrorMessage = e
      return res.render('account/register', reg)
    }
    console.log(e)
    // register
    db.users.register(
      req.body.Username,
      req.body.FullName,
      req.body.Password,
      req.body.Email,
      function (err, result) {
        if (err) {
          res.render('account/register', reg)
        } else {
          if (config.EnableEmailConfirmed) {
            var subject = 'Email Confirmation'
            var to = req.body.Email

            // generate jwt token
            var payload = {
              id: result.user.Id,
              username: result.user.Username, // add additional attributes
            }
            let authToken = jwt.sign(payload, config.Secret, {
              expiresIn: '2d', // expires in 2 days
            })
            var link = config.ServerURL + 'emailconfirmed?token=' + authToken
            var body =
              '<p>Please click this link to confirm your email.</p>' +
              "<p><a href='" +
              link +
              "'>" +
              link +
              '</a></p>'

            utils.sendEmail(to, subject, body, function (err, info) {
              if (err) {
                return res.render('account/register', reg)
              }
              res.render('account/registerneedconfirmed', {
                email: req.body.Email,
              })
            })
          } else {
            res.render('account/registersuccess')
          }
        }
      },
    )
  })
}

module.exports.register = [
  (req, res) => {
    var reg = {
      isError: false,
      useCaptcha: config.EnableCaptcha,
      ReCaptchaKey: config.ReCaptchaSettings.Key,
      model: {
        Username: '',
        Email: '',
        FullName: '',
      },
    }
    res.render('account/register', reg)
  },
]

module.exports.submitedRegister = [
  (req, res) => {
    //console.log(req.body);

    if (config.EnableCaptcha) {
      utils.validateCaptcha(
        req.body['g-recaptcha-response'],
        function (err, ret) {
          if (err) {
            var reg = {
              isError: true,
              useCaptcha: config.EnableCaptcha,
              ReCaptchaKey: config.ReCaptchaSettings.Key,
              model: {
                Username: req.body.Username,
                Email: req.body.Email,
                FullName: req.body.FullName,
              },
            }
            return res.render('account/register', reg)
          }

          console.log(ret)
          if (ret.success) processRegistration(req, res)
          else {
            var reg = {
              isError: true,
              useCaptcha: config.EnableCaptcha,
              ReCaptchaKey: config.ReCaptchaSettings.Key,
              model: {
                Username: req.body.Username,
                Email: req.body.Email,
                FullName: req.body.FullName,
              },
            }
            res.render('account/register', reg)
          }
        },
      )
    } else {
      processRegistration(req, res)
    }
  },
]

module.exports.emailConfirmation = [
  (req, res) => {
    var token = req.query.token
    if (token !== null && token !== undefined) {
      try {
        var payload = jwt.verify(token, config.Secret)
        db.users.updateUser(
          {Id: payload.id, EmailConfirmed: 1},
          function (e, done) {
            if (e) return res.render('account/confirmedemailinvalid')
            res.render('account/confirmedemail')
          },
        )
      } catch (err) {
        res.render('account/confirmedemailinvalid')
      }
    } else {
      res.render('account/confirmedemailinvalid')
    }
  },
]

module.exports.login = [
  (req, res) => {
    res.render('account/login', {
      isError: false,
      Username: '',
      enableRememberMe: config.EnableRememberMe,
    })
  },
]

module.exports.submitedLogin = [
  (req, res) => {
    console.log(req.body)

    db.users.findByUsername(req.body.Username, function (err, user) {
      var acc = {
        isError: true,
        Username: req.body.Username,
        enableRememberMe: config.EnableRememberMe,
      }
      if (err) {
        console.log(err)
        res.render('account/login', acc)
      } else {
        var isLocked = false
        console.log(user)
        var hash = bcrypt.hashSync(req.body.Password, user.Salt)

        if (hash !== user.PasswordHash) {
          // User locaked feature
          if (config.EnableUserLockout) {
            var currentAccessFailedCount = user.AccessFailedCount
            currentAccessFailedCount++

            var userLocked = {}
            userLocked.Id = user.Id
            userLocked.AccessFailedCount = currentAccessFailedCount

            if (currentAccessFailedCount >= config.AccessFailedCount) {
              isLocked = true
              userLocked.LockoutEnabled = 1

              var lockoutEnd = new Date() // noew
              lockoutEnd.setTime(
                lockoutEnd.getTime() + config.UserLocakedMinutes * 60 * 1000,
              )

              userLocked.LockoutEnd = lockoutEnd
            }
            ;(async () => {
              await Promise.all([
                db.users.updateUser(userLocked, function (e, done) {}),
              ])
            })()
            if (isLocked) return res.render('account/userlocked')
            else return res.render('account/login', acc)

            // db.users.updateUser(userLocked,function(e){
            //     if(isLocked)
            //         return res.render('account/userlocked');
            //     else
            //         return res.render('account/login',acc);
            // });
          } else {
            return res.render('account/login', acc)
          }
        }
        // check user locked
        if (config.EnableUserLockout) {
          var now = Date()
          if (user.LockoutEnabled) {
            if (user.LockoutEnd > now) {
              return res.render('account/userlocked')
            } else {
              var userLocked = {}
              userLocked.Id = user.Id
              userLocked.AccessFailedCount = 0
              userLocked.LockoutEnabled = 0
              ;(async () => {
                await Promise.all([
                  db.users.updateUser(userLocked, function (e, done) {}),
                ])
              })()
            }
          }
        }

        if (config.EnableEmailConfirmed) {
          if (!user.EmailConfirmed) {
            return res.render('account/needemailconfirmed')
          }
        }

        // generate jwt token
        var payload = {
          id: user.Id,
          username: user.Username, // add additional attributes
        }
        let authToken = jwt.sign(payload, config.Secret, {
          expiresIn: '3d', // expires in 3 days
        })

        if (config.EnableTwoFactor && user.TwoFactorEnabled) {
          var multifactor = {
            token: authToken,
            isError: false,
            rememberme: req.body.rememberMe,
          }
          var code = utils.generateDigits(4)
          req.session.code = code
          console.log(code)

          var subject = 'Multi-Factor Authentication'
          var to = user.Email
          var body = '<p>Your code: ' + code.toString() + '.</p>'

          utils.sendEmail(to, subject, body, function (err, info) {
            if (err) {
              return res.render('account/login', acc)
            }
            return res.render('account/multifactor', multifactor)
          })
        } else {
          // normal authentication

          if (req.body.rememberMe != null && req.body.rememberMe != undefined) {
            // Setting the auth token in cookies - expiration 3*24*360000 ms
            if (req.body.rememberMe)
              res.cookie('AuthToken', authToken, {maxAge: 3 * 24 * 360000})
            // 3 days
            else req.session.user = authToken
          } else {
            req.session.user = authToken
          }

          var userprofile = {User_Id: user.Id, LastAccess: new Date()}
          db.users.updateUserAccess(userprofile, function (e) {
            res.redirect('/users/myprofile')
          })
        }
      }
    })
  },
]

module.exports.logout = [
  (req, res) => {
    // clear session
    req.session.destroy(function () {
      console.log('user logged out.')
    })
    // clear cookie
    res.clearCookie('AuthToken')

    res.render('account/logout')
  },
]

module.exports.resendemail = [
  (req, res) => {
    res.render('account/resendtokenemail', {
      isError: false,
    })
  },
]
module.exports.submitedResendemail = [
  (req, res) => {
    db.users.findByEmail(req.body.Email, function (err, user) {
      if (err)
        return res.render('account/resendtokenemail', {
          isError: true,
        })
      if (user) {
        var subject = 'Resend Email Confirmation'
        var to = req.body.Email

        // generate jwt token
        var payload = {
          id: user.Id,
          username: user.Username, // add additional attributes
        }
        let authToken = jwt.sign(payload, config.Secret, {
          expiresIn: '2d', // expires in 2 days
        })
        var link = config.ServerURL + 'emailconfirmed?token=' + authToken
        var body =
          '<p>Please click this link to confirm your email.</p>' +
          "<p><a href='" +
          link +
          "'>" +
          link +
          '</a></p>'

        utils.sendEmail(to, subject, body, function (err, info) {
          if (err) {
            return res.render('account/resendtokenemail', {
              isError: true,
            })
          }
          res.render('account/resendtokenemailconfirmed', {
            email: user.Email,
          })
        })
      } else {
        res.render('account/resendtokenemail', {
          isError: true,
        })
      }
    })
  },
]
module.exports.forgotUsername = [
  (req, res) => {
    res.render('account/forgot', {
      SubTitle: 'Forgot Username',
      SubmitRoute: '/account/forgotusername',
      isError: false,
    })
  },
]
module.exports.submittedForgotUsername = [
  (req, res) => {
    db.users.findByEmail(req.body.Email, function (err, user) {
      if (err) {
        return res.render('account/forgot', {
          SubTitle: 'Forgot Username',
          SubmitRoute: '/account/forgotusername',
          isError: true,
        })
      }
      if (user) {
        var subject = 'Forgot Username'
        var to = req.body.Email
        var body = '<p>Your username is <b>' + user.Username + '</b>.</p>'

        utils.sendEmail(to, subject, body, function (err, info) {
          if (err) {
            return res.render('account/forgot', {
              SubTitle: 'Forgot Username',
              SubmitRoute: '/account/forgotusername',
              isError: true,
            })
          }
          return res.render('account/forgotconfirmed', {
            SubTitle: 'Forgot Username',
            Email: to,
            ForgotItem: 'Username',
          })
        })
      } else
        res.render('account/forgot', {
          SubTitle: 'Forgot Username',
          SubmitRoute: '/account/forgotusername',
          isError: true,
        })
    })
  },
]

module.exports.forgotPassword = [
  (req, res) => {
    res.render('account/forgot', {
      SubTitle: 'Forgot Password',
      SubmitRoute: '/account/forgotPassword',
      isError: false,
    })
  },
]
module.exports.submittedForgotPassword = [
  (req, res) => {
    db.users.findByEmail(req.body.Email, function (err, user) {
      if (err) {
        return res.render('account/forgot', {
          SubTitle: 'Forgot Password',
          SubmitRoute: '/account/forgotPassword',
          isError: true,
        })
      }
      if (user) {
        var subject = 'Forgot and Reset Password'
        var to = req.body.Email

        // generate jwt token
        var payload = {
          id: user.Id,
          username: user.Username, // add additional attributes
        }
        let authToken = jwt.sign(payload, config.Secret, {
          expiresIn: '2d', // expires in 2 days
        })
        var link = config.ServerURL + 'resetpassword?token=' + authToken
        var body =
          '<p>Please click this link to reset password.</p>' +
          "<p><a href='" +
          link +
          "'>" +
          link +
          '</a></p>'

        utils.sendEmail(to, subject, body, function (err, info) {
          if (err) {
            return res.render('account/forgot', {
              SubTitle: 'Forgot Password',
              SubmitRoute: '/account/forgotPassword',
              isError: true,
            })
          }
          return res.render('account/forgotconfirmed', {
            SubTitle: 'Forgot Password',
            Email: req.body.Email,
            ForgotItem: 'Password',
          })
        })
      } else
        res.render('account/forgot', {
          SubTitle: 'Forgot Password',
          SubmitRoute: '/account/forgotPassword',
          isError: true,
        })
    })
  },
]

module.exports.resetPassword = [
  (req, res) => {
    var token = req.query.token
    if (token !== null && token !== undefined) {
      try {
        var payload = jwt.verify(token, config.Secret)
        res.render('account/resetpassword', {
          token: token,
          isError: false,
          ErrorMessage: '',
        })
      } catch (err) {
        res.render('account/confirmedemailinvalid')
      }
    } else {
      res.render('account/confirmedemailinvalid')
    }
  },
]

module.exports.submitedResetPassword = [
  (req, res) => {
    var token = req.body.token
    if (token !== null && token !== undefined) {
      try {
        var payload = jwt.verify(token, config.Secret)
        var salt = bcrypt.genSaltSync(10)
        var newhash = bcrypt.hashSync(req.body.NewPassword, salt)
        var user = {
          Id: payload.id,
          Salt: salt,
          PasswordHash: newhash,
        }
        db.users.updateUser(user, function (e, done) {
          if (e) return res.render('account/confirmedemailinvalid')

          res.render('account/changeconfirmed', {
            SubTitle: 'Reset Password',
            Item: 'password',
          })
        })
      } catch (err) {
        res.render('account/resetpassword', {
          token: token,
          isError: true,
          ErrorMessage: 'Failed to reset your password',
        })
      }
    } else {
      res.render('account/confirmedemailinvalid')
    }
  },
]

module.exports.submittedMultiFactorAuth = [
  (req, res) => {
    var authToken = req.body.token
    var multifactor = {
      token: authToken,
      isError: true,
      rememberme: req.body.rememberMe,
    }
    var currentCode = req.session.code
    console.log(currentCode)
    try {
      var payload = jwt.verify(authToken, config.Secret)
      if (currentCode === req.body.code) {
        // normal authentication
        if (req.body.rememberMe != null && req.body.rememberMe != undefined) {
          // Setting the auth token in cookies - expiration 3*24*360000 ms
          if (req.body.rememberMe)
            res.cookie('AuthToken', authToken, {maxAge: 3 * 24 * 360000})
          // 3 days
          else req.session.user = authToken
        } else {
          req.session.user = authToken
        }

        var userprofile = {User_Id: payload.id, LastAccess: new Date()}
        db.users.updateUserAccess(userprofile, function (e) {
          res.redirect('/users/myprofile')
        })
      } else {
        return res.render('account/multifactor', multifactor)
      }
    } catch (err) {
      console.log(err)
      return res.render('account/multifactor', multifactor)
    }
  },
]
