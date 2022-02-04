const {Router} = require('express')
const db = require('../db')
const config = require('../config')
const router = Router()

router.post('/register', (req, res) => {
  const {Username, FullName, Password, Email} = req.body

  db.users.register(
    Username,
    FullName,
    Password,
    Email,
    function (err, result) {
      if (err) {
        // res.render('account/register', reg)
        return res.status(400).json({message: "Can't register user"})
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
            res.render('account/registerneedconfirmed', {email: req.body.Email})
          })
        } else {
          //   res.render('account/registersuccess')
          // generate jwt token
          const payload = {
            id: result.user.Id,
            username: result.user.Username, // add additional attributes
          }
          const authToken = jwt.sign(payload, config.Secret, {
            expiresIn: '2d', // expires in 2 days
          })
          res.status(201).json({message: 'Registeration success.'})
        }
      }
    },
  )
})

module.exports = {router}
