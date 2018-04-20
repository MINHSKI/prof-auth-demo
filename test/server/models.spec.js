const expect = require('chai').expect;
const db = require('../../db');
const User = {
};

describe('models', ()=> {
  beforeEach(()=> {
    return db.syncAndSeed();
  });
  describe('User', ()=> {
    it('exists', ()=> {
      expect(User).to.be.ok;
    });
  });
});
