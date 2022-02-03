const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('profile', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fullname: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    lastaccess: {
      type: DataTypes.DATE,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'profile',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "profile_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
