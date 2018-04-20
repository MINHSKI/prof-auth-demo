const expect = require('chai').expect;
const db = require('../../db');
const { User } = db.models;
const jwt = require('jwt-simple');

const KEY = process.env.JWT_KEY;

let userMap;
describe('models', ()=> {
  beforeEach(()=> {
    return db.syncAndSeed()
      .then( users => {
        userMap = users.reduce((memo, user)=> {
          memo[user.username] = user;
          return memo;
        }, {});
      });
  });
  describe('User', ()=> {
    it('exists', ()=> {
      expect(User).to.be.ok;
    });
    it('moe exists', ()=> {
      const moe = userMap.moe;
      expect(moe.password).to.equal('MOE');
    });
  });
  describe('User.authenticate', ()=> {

    it('returns a token with correct credentials', ()=> {
      const moe = userMap.moe;
      const _token = jwt.encode({ id: moe.id }, KEY); 
      const credentials = {
        username: moe.username,
        password: moe.password
      };
      return User.authenticate(credentials)
        .then( token=> expect(token).to.equal(_token));
    });

    it('throws an error with a 401 status with bad credentials', ()=> {
      const moe = userMap.moe;
      const _token = jwt.encode({ id: moe.id }, KEY); 
      const credentials = {
        username: moe.username,
        password: 'abc' 
      };
      return User.authenticate(credentials)
        .catch( ex => expect(ex.status).to.equal(401));
    });
  });
  describe('User.exchangeTokenForUser', ()=> {

    it('returns a user with correct token', ()=> {
      const moe = userMap.moe;
      const _token = jwt.encode({ id: moe.id }, KEY); 
      const credentials = {
        username: moe.username,
        password: moe.password
      };
      return User.authenticate(credentials)
        .then( token=> User.exchangeTokenForUser(token))
        .then( user => expect(user.username).to.equal(moe.username));
    });

    it('throws an error with a bad token', ()=> {
      const larry = userMap.larry;
      const token = jwt.encode({ id: larry.id }, 'what?'); 
        return User.exchangeTokenForUser(token)
        .catch( ex => expect(ex.status).to.equal(401));
    });

    it('throws an error with a good token with no user', ()=> {
      const larry = userMap.larry;
      const token = jwt.encode({ id: 99 }, KEY); 
        return User.exchangeTokenForUser(token)
         .then(()=> {
           throw 'no';
         })
        .catch( ex => expect(ex.status).to.equal(401));
    });
  });
});
