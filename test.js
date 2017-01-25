var request = require('supertest');
var app = require('./app');

beforeEach(function(done) {
    // Setup
    console.log('test before function');
    console.log('NODE_ENV: ' + nconf.get('NODE_ENV'));
    console.log('NODE_ENV2: ' + process.env.NODE_ENV);
});

describe('Request the list of songs', function() {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/api/n/songs')
      .expect(200, done);
  });
});

describe('Request a limited and filtered list of songs', function() {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/api/n/songs?filter=Johnny&limit=10&offset=10')
      .expect(200, done);
  });
})
