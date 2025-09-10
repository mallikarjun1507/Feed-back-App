const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'feedback_app',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Root',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    define: { underscored: true }
  }
);

module.exports = sequelize;
