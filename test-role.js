
const db = require('./db');
// db.roles.createRole("USER",function(err,role){
//     console.log(role);
// });
// db.roles.createRole("MANAGER",function(err,role){
//     console.log(role);
// });
// db.roles.createRole("ADMIN",function(err,role){
//     console.log(role);
// });

// user1
// db.roles.insertUserRole(1,1,function(err,userrole){
//     console.log(userrole);
// })
// // user2
// db.roles.insertUserRole(3,2,function(err,userrole){
//     console.log(userrole);
// })
// // user3
// db.roles.insertUserRole(4,3,function(err,userrole){
//     console.log(userrole);
// })

// // agusk
// db.roles.insertUserRole(2,2,function(err,userrole){
//     console.log(userrole);
// })
// db.roles.insertUserRole(2,3,function(err,userrole){
//     console.log(userrole);
// })

db.roles.findRolesByUserId(1,function(err,roles){
    console.log(roles);
})
db.roles.findRolesByUserId(2,function(err,roles){
    console.log(roles);
})