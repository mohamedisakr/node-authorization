'use strict'
const fs = require('fs')
const privateKey = fs.readFileSync('./localhost-private.pem')

module.exports = {
  Database: {
    DBServer: 'localhost',
    Database: 'node-authz',
    DBuserID: 'postgres',
    DBUserPassword: '123456',
    DBDialect: 'postgres',
  },
  MailSettings: {
    Mail: 'udemy@ilmudata.id',
    DisplayName: 'Udemy Tester',
    Password: '<password>',
    Host: '<mail-server>',
    Port: 465,
  },
  ReCaptchaSettings: {
    Key: '<recaptcha-key>',
    Secret: '<recaptcha-secret>',
  },
  ServerURL: 'http://localhost:5000/',
  EnableRememberMe: false,
  EnableCaptcha: false,
  EnableEmailConfirmed: false,
  EnableTwoFactor: false,

  EnableUserLockout: false,
  AccessFailedCount: 3,
  UserLocakedMinutes: 1,

  Secret: privateKey,
}
