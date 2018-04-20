const conn = require('./conn');

const User = require('./User');

const usernames = [
  'moe', 'larry', 'curly'
];
const syncAndSeed = ()=> {
  return conn.sync({ force: true })
    .then(()=> {
      return Promise.all(
        usernames.map( username => User.create({ username, password: username.toUpperCase()}))
      );
    });
};

module.exports = {
  syncAndSeed,
  models: {
    User
  }
};


