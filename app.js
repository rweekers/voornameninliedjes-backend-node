var express = require('express');
var app = express();

// var redis = require('redis');
// var client = redis.createClient();

var pg = require('pg');
var connString = 'postgres://vil:kzciaMUwTvd4y9Q0KYI6@localhost/namesandsongs';

app.get('/api/n/songs/', function(request, response) {
	var offset = request.query.offset;
	var limit = request.query.limit;
  var filter = request.query.filter;
	var stringAppend = " ";
  var stringFilter = " ";

  // this will add a filter to the query
  if ( filter !== undefined && filter) {
    var filterLC = filter.toLowerCase().trim();
    // add where clause
    stringFilter += "AND (LOWER(artist) LIKE '%" + filterLC + "%' OR LOWER(title) LIKE '%" + filterLC + "%') ";
    offset = 0;
  }

	if ( limit !== undefined && limit) {
		stringAppend += "LIMIT " + limit + " ";
	}
	if ( offset !== undefined && limit) {
		stringAppend += "OFFSET " + offset;
	}
	//this starts initializes a connection pool
	//it will keep idle connections open for a (configurable) 30 seconds
	//and set a limit of 20 (also configurable)
	pg.connect(connString, function(err, client, done) {
	  var results = [];
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  query = 'SELECT id, artist, title FROM song WHERE 1=1' + stringFilter + 'ORDER BY artist ASC ' + stringAppend;
    console.log("Query: " + query);
    client.query(query, function(err, result) {
	    //call `done()` to release the client back to the pool
	    done();

	    if(err) {
	      return console.error('error running query', err);
	    }
      return response.json({songs: result.rows, meta: {total: 788}});

	  });
	});
});

app.get('/api/n/songs/:id', function(request, response) {
  //this starts initializes a connection pool
	//it will keep idle connections open for a (configurable) 30 seconds
	//and set a limit of 20 (also configurable)
	pg.connect(connString, function(err, client, done) {
	  var id = request.params.id;
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  // client.query('SELECT $1::int AS number', ['1'], function(err, result) {
	  client.query('SELECT id, artist, title, image, background FROM song WHERE id = $1', [id], function(err, result) {
	    //call `done()` to release the client back to the pool
	    done();

	    if(err) {
	      return console.error('error running query', err);
	    }
      return response.json({song: result.rows[0]});

	  });
	});
});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});
