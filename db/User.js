const conn = require('./conn');
const { Sequelize } = conn;
const jwt = require('jwt-simple');

const KEY = process.env.JWT_KEY;

const User = conn.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

User.exchangeTokenForUser = function(token){
  try {
    const userId = jwt.decode(token, KEY).id;
    return User.findById(userId)
      .then( user => {
        if(user)
          return user;
        throw {
          status: 401
        };
      });
  }
  catch(ex){
    return Promise.reject({
      status: 401
    });
  }

}

User.authenticate = function(credentials){
  const { username, password } = credentials;
  return this.findOne({
    where: {
      username,
      password
    }
  })
  .then( user => {
    if(user){
      return jwt.encode({ id: user.id }, KEY);
    }
    throw { status: 401 };
  });

}

module.exports = User;
