const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userroles', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'role',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'userroles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "userroles_pkey",
        unique: true,
        fields: [
          { name: "id" },
          { name: "user_id" },
          { name: "role_id" },
        ]
      },
    ]
  });
};
