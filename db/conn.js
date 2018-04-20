const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost/my_db';
const Sequelize = require('sequelize');
const conn = new Sequelize(DATABASE_URL);

module.exports = conn;


