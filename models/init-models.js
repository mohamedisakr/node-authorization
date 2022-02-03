var DataTypes = require("sequelize").DataTypes;
var _profile = require("./profile");
var _role = require("./role");
var _userroles = require("./userroles");
var _users = require("./users");

function initModels(sequelize) {
  var profile = _profile(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var userroles = _userroles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  role.belongsToMany(users, { as: 'user_id_users', through: userroles, foreignKey: "role_id", otherKey: "user_id" });
  users.belongsToMany(role, { as: 'role_id_roles', through: userroles, foreignKey: "user_id", otherKey: "role_id" });
  userroles.belongsTo(role, { as: "role", foreignKey: "role_id"});
  role.hasMany(userroles, { as: "userroles", foreignKey: "role_id"});
  profile.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(profile, { as: "profiles", foreignKey: "user_id"});
  userroles.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(userroles, { as: "userroles", foreignKey: "user_id"});

  return {
    profile,
    role,
    userroles,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
