const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('commerce', 'postgres', '089786', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;
