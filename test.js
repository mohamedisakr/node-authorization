//const db = require('./db/database');
// const config = require('./appconfig');
// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize(
//     config.Database, 
//     config.DBuserID, 
//     config.DBUserPassword, {
//         host: 'localhost',
//         dialect: 'mysql'
// });

// const utils = require('./helpers/utils');

// utils.sendEmail("udemy@ilmudata.id","test 123","test body", function(err,info){
//     if(err)
//         console.log(err);
//     else
//         console.log(info);
// })

// const db = require('./db');

// db.users.updateUser({Id:7,EmailConfirmed:1}, function(err,done){
//     if(err)
//       return console.log(err);
    
//     console.log(done);
// });


// const config = require('./appconfig');
// const jwt = require('jsonwebtoken');

//  // generate jwt token
//  var payload = {
//     id: 10,
//     username: "agusk"
// };
// let authToken = jwt.sign(payload,
//     config.Secret, { 
//         expiresIn: '2d' // expires in 2 days 
//     }
// );
// console.log(authToken);
// console.log("----------------");
// var payload = jwt.verify(authToken, config.Secret);
// console.log(payload);

// var tk="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInVzZXJuYW1lIjoiYWd1c2t1ciIsImlhdCI6MTYxMjgyOTE4MSwiZXhwIjoxNjEzMDAxOTgxfQ.PgE4nmteDfQy8XiG5qTYK1fmgpRBp8I4ysR2H7yXa0E";
// var payload1 = jwt.verify(tk, config.Secret);
// console.log(payload1);

// async function test() {
//     try {
//         await db.sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//       } catch (error) {
//         console.error('Unable to connect to the database:', error);
//       }
// }
// test()


