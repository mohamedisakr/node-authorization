const https = require('https')
const nodemailer = require('nodemailer')
const config = require('../appconfig')

module.exports.validateCaptcha = (token, done) => {
  try {
    var par = 'secret=' + config.ReCaptchaSettings.Secret + '&response=' + token
    var url = 'https://www.google.com/recaptcha/api/siteverify?' + par

    https
      .get(url, (res) => {
        let body = ''

        res.on('data', (chunk) => {
          body += chunk
        })

        res.on('end', () => {
          try {
            let json = JSON.parse(body)
            done(null, {success: json.success})
          } catch (e) {
            console.error(e.message)
            done(e)
          }
        })
      })
      .on('error', (e) => {
        console.error(e.message)
        done(e)
      })
  } catch (e) {
    console.log(e)
    done(e)
  }
}

module.exports.sendEmail = (to, subject, body, done) => {
  const {Host, Port, Mail, Password} = config.MailSettings

  var transporter = nodemailer.createTransport({
    host: Host,
    port: Port,
    secure: true,
    auth: {user: Mail, pass: Password},
  })

  var mailOptions = {from: Mail, to, subject, html: body}

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      done(error)
    } else {
      console.log('Email sent: ' + info.response)
      done(null, info)
    }
  })
}

module.exports.generateDigits = (num) => {
  var digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  function randomDigits(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var dummy = list[i]
      list[i] = list[j]
      list[j] = dummy
    }
    return list
  }

  return randomDigits(digits).slice(0, num).join('')
}
