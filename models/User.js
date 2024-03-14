const { Sequelize, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        dob: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: Sequelize.DATE
          }
    },
    {
        timestamps: false
    }
    );

    return User;
};