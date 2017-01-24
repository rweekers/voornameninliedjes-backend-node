var request = require('supertest');
var app = require('./app');

var fs = require('fs');
var nconf = require('nconf'); 

var pg = require('pg');
var config = {
  user: 'postgres',
  database: 'travis_ci_test',
  password: '',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};
 
var pool = new pg.Pool(config);
 
// to run a query we can acquire a client from the pool, 
// run a query on the client, and then return the client to the pool 
pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    //call `done()` to release the client back to the pool 
    done();
 
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].number);
    //output: 1 
  });
});
 
pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool 
  // the pool itself will emit an error event with both the error and 
  // the client which emitted the original error 
  // this is a rare occurrence but can happen if there is a network partition 
  // between your application and the database, the database restarts, etc. 
  // and so you might want to handle it and at least log it out 
  console.error('idle client error', err.message, err.stack)
})

beforeEach(function() {
      console.log('beforeEach...');/*
      client.connect();
      console.log('connected to database');
      client.query("DROP TABLE IF EXISTS SONG;");
      client.query("CREATE TABLE SONG(artist char(40) NOT NULL, title varchar(40) NOT NULL, firstname varchar(40), name_index integer, name_length integer, date_inserted date, user_inserted varchar(40));");
      console.log('created table');*/
});

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
/*
describe('Request a limited and filtered list of songs', function() {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/api/n/songs?filter=Johnny&limit=10&offset=10')
      .expect(200, done);
  });
})
*/
