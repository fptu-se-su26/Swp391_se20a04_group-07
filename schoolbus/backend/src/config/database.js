const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        requestTimeout: 30000,
      }
    },
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    logging: process.env.NODE_ENV === 'development' ? (sql) => require('./logger').debug(sql) : false
  }
);

module.exports = sequelize;
