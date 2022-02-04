'use strict'
const db = require('../db')

module.exports.authorize = (...roles) => {
  return (req, res, next) => {
    var userId = req.user.Id
    db.roles.findRolesByUserId(userId, function (err, userRoles) {
      if (err) return res.render('account/forbidden')
      var found = false
      console.log(userRoles)
      if (userRoles) {
        for (var i = 0; i < userRoles.length; i++) {
          if (roles.includes(userRoles[i]['Role.RoleName'])) {
            found = true
            break
          }
        }
        if (found) next()
        else return res.render('account/forbidden')
      } else {
        return res.render('account/forbidden')
      }
    })
  }
}
