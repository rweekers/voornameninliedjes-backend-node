var express = require('express');
var app = express();

// var redis = require('redis');
// var client = redis.createClient();

var pg = require('pg');
var connString = 'postgres://vil:kzciaMUwTvd4y9Q0KYI6@localhost/namesandsongs';

app.get('/namesandsongs/api/song', function(request, response) {
    //this starts initializes a connection pool 
	//it will keep idle connections open for a (configurable) 30 seconds 
	//and set a limit of 20 (also configurable) 
	pg.connect(connString, function(err, client, done) {
	  var results = [];
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  // client.query('SELECT $1::int AS number', ['1'], function(err, result) {
	  client.query('SELECT * FROM song', function(err, result) {
	    //call `done()` to release the client back to the pool 
	    done();
	    
	    if(err) {
	      return console.error('error running query', err);
	    }
      return response.json(result.rows);

	  });
	});
});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});
