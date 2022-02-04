const db = require('./database')
var bcrypt = require('bcryptjs')

module.exports.register = async (username, fullname, password, email, done) => {
  const transaction = await db.sequelize.transaction()

  try {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const user = await db.models.users.create(
      {
        Username: username,
        PasswordHash: hash,
        Salt: salt,
        Email: email,
      },
      {transaction: transaction},
    )

    const userProfile = await db.models.profile.create(
      {
        FullName: fullname,
        User_Id: user.Id,
        LastAccess: new Date(),
      },
      {transaction: transaction},
    )

    await transaction.commit()
    done(null, {user: user, profile: userProfile})
  } catch (e) {
    console.log(e)
    await transaction.rollback()
    done(e)
  }
}

module.exports.findById = async (id, done) => {
  try {
    const user = await db.models.users.findByPk(id, {raw: true})

    done(null, user)
  } catch (e) {
    console.log(e)
    done(e, null)
  }
}

module.exports.findByUsername = async (username, done) => {
  try {
    const condition = {Username: username}
    const user = await db.models.users.findOne({where: condition, raw: true})

    done(null, user)
  } catch (e) {
    console.log(e)
    done(e, null)
  }
}

module.exports.findByEmail = async (email, done) => {
  try {
    const condition = {Email: email}
    const user = await db.models.users.findOne({where: condition, raw: true})

    done(null, user)
  } catch (e) {
    console.log(e)
    done(e, null)
  }
}

module.exports.getProfile = async (username, done) => {
  try {
    const condition = {Username: username}
    const user = await db.models.users.findOne({where: condition, raw: true})
    const profile = await db.models.profile.findOne({
      where: {User_Id: user.Id},
      raw: true,
    })

    const ret = {
      Id: user.Id,
      FullName: profile.FullName,
      Email: user.Email,
    }
    done(null, ret)
  } catch (e) {
    console.log(e)
    done(e, null)
  }
}

module.exports.updateUser = async (usr, done) => {
  try {
    const condition = {Id: usr.Id}
    db.models.users.update(usr, {where: condition}).then((num) => {
      done(null, true)
    })
  } catch (e) {
    console.log(e)
    done(e, null)
  }
}

module.exports.updateUserAccess = async (user, done) => {
  try {
    const condition = {User_Id: user.User_Id}
    db.models.profile.update(user, {where: condition}).then((num) => {
      done(null, true)
    })
  } catch (e) {
    console.log(e)
    done(e, null)
  }
}
