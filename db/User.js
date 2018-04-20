const conn = require('./conn');
const { Sequelize } = conn;

const User = conn.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

module.exports = User;
