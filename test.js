var request = require('supertest');
var app = require('./app');

var fs = require('fs');
var nconf = require('nconf'); 

var pg = require('pg');
// var connString = 'postgres://' + nconf.get('database:username') + ':' + nconf.get('database:password') + '@' + nconf.get('database:host') + '/' + nconf.get('database:testname');
var connString = 'postgres://postgres@localhost:5432/travis_ci_test';

var client = new pg.Client({
      user: 'postgres',
      database: 'travis_ci_test',
      host: '127.0.0.1',
      port: 5432
    });
client.connect();

var query = client.query("SELECT * FROM (VALUES (1, 'one'), (2, 'two'), (3, 'three')) AS t (num,letter);", function(err, result) {
      console.log(result.rows[0].letter);
    });
console.log('made query');
client.query("DROP TABLE IF EXISTS SONG;");
console.log('dropped table');

/*
beforeEach(function() {
  console.log("DB connString: " + connString + " on " + process.env.ENV);
  console.log("Node env " + process.env.NODE_ENV);
      client.connect();
      
  pg.connect(connString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("DROP TABLE IF EXISTS SONG;");
    client.query("CREATE TABLE SONG(artist char(40) NOT NULL, title varchar(40) NOT NULL, firstname varchar(40), name_index integer, name_length integer, date_inserted date, user_inserted varchar(40));");
    client.query("DELETE FROM SONG");
    client.query("INSERT INTO SONG(artist, title, firstname, name_index, name_length, date_inserted, user_inserted) " + 
      "VALUES('The Police', 'Roxanne', 'Roxanne', 0, 7, now(), 'Tester')");
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
*/
