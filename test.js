var request = require('supertest');
var app = require('./app');

var fs = require('fs');
var nconf = require('nconf'); 

var pg = require('pg');
var connString2 = 'postgres://' + nconf.get('database:username') + ':' + nconf.get('database:password') + '@' + nconf.get('database:host') + '/' + nconf.get('database:testname');
var connString = 'postgres://postgres@localhost:5432/travis_ci_test';

beforeEach(function() {
  console.log("DB connString: " + connString);
  pg.connect(connString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("delete from song");
    client.query("INSERT INTO song(id, artist, title, firstname, name_index, name_length, date_inserted, user_inserted) " + 
      "VALUES(2, 'Paul Simon', 'You can call me Al', 'Al', 5, 5, now(), 'Tester')");
  });
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
