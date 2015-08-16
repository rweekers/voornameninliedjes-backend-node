var request = require('supertest');
var app = require('./app');

describe('Request the list of songs', function() {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/api/n/songs')
      .expect(200, done);
  });
});
