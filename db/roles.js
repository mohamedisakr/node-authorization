
const db = require('./database');
var bcrypt = require('bcryptjs');

module.exports.createRole = async (roleName,done) => {
  try {
    var role = await db.models.role.create({
      RoleName: roleName
    });

    done(null, role);

  } catch(e) {            
    console.log(e);
    done(e);
  }
}

module.exports.insertUserRole = async (userId,roleId, done) => {  
  try {
    var userRole = await db.models.userroles.create({
        User_Id: userId,
        Role_Id: roleId
      });

    done(null, userRole);    
  } catch(e) {            
    console.log(e);
    done(e, null); 
  }
};


module.exports.findRolesByUserId = async (userId, done) => {  
  try {
    var condition = {User_Id: userId};
    var userRoles = await db.models.userroles.findAll({ 
        where: condition, 
        include: 'Role',
        raw : true } );

    done(null, userRoles);    
  } catch(e) {            
    console.log(e);
    done(e, null); 
  }
};
