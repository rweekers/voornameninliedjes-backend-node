var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

// var redis = require('redis');
// var client = redis.createClient();
var fs = require('fs');
var nconf = require('nconf');

nconf.argv()
     .env()
     .file({ file: 'config.json' });

var pg = require('pg');

var db = nconf.get('database:name');
if (nconf.get('NODE_ENV') === 'test') {
	console.log('NODE_ENV: ' + nconf.get('NODE_ENV'));
	db = nconf.get('database:testname');
}
var connString = 'postgres://' + nconf.get('database:username') + ':' + nconf.get('database:password') + '@' + nconf.get('database:host') + '/' + db;

var totalPages = function(total, perPage) {
  return Math.ceil(total/perPage);
};

var range= function(page, perPage) {
  var s = (page - 1) * perPage;
  return s;
};

var makeResponse = function(req) {
  if (req.query.page && req.query.page != 'all') {
    return makePagedResponse(req.query.page,req.query.per_page,req.query.sortByField);
  }
  else {
    return {
      "songs": makeAllFixtures()
    };
  }
};

app.get('/api/n/songs/', function(request, response) {
  var filter = request.query.filter;
	var stringAppend = " ";
  var stringFilter = " ";

  var page = request.query.page;
  var perPage = request.query.per_page;
  var sortByField = request.query.sortByField;

  // this will add a filter to the query
  if ( filter !== undefined && filter) {
    var filterLC = filter.toLowerCase().trim();
    // add where clause
    stringFilter += "AND (LOWER(artist) LIKE '%" + filterLC + "%' OR LOWER(title) LIKE '%" + filterLC + "%') ";
    offset = 0;
  }

  if (request.query.page && request.query.page != 'all') {
  	var start = range(page, perPage);
	  stringAppend += "LIMIT " + perPage + " ";
		stringAppend += "OFFSET " + start;
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
	  queryTotal = 'SELECT COUNT(1) AS TOTAL FROM song WHERE 1=1' + stringFilter;
    client.query(queryTotal, function(err, resultTotal) {
    	client.query(query, function(err, result) {
	    	//call `done()` to release the client back to the pool
	    	done();

	    	if(err) {
	     		return console.error('error running query', err);
	    	}
      	// return response.json({data: result.rows, meta: {total_pages: totalPages(resultTotal.rows[0].total,perPage)}});
        return response.json({data: result.rows});

	  	});
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

app.get('/api/n/items/', function(request, response) {

  //this starts initializes a connection pool
  //it will keep idle connections open for a (configurable) 30 seconds
  //and set a limit of 20 (also configurable)
  pg.connect(connString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    // client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    client.query('SELECT id, title, story, type, status, date FROM item', function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      return response.json({items: result.rows});

    });
  });
});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});

module.exports = app;
