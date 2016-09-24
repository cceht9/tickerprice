var express = require('express');
var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var request = require('request');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('index');
});

app.post('/', function(req,res) {
	var form = new formidable.IncomingForm();
    var yahooService = function (err, fields) {
		res.writeHead(200, {
    		'content-type': 'text/plain'
		});
    	var price;
    	var displayPrice = function (error, response, body) {
			if (!error && response.statusCode == 200) {
			  	body = body.split("\n");
			  	body = body[1].split(",");
			  	price = body[6];
			  	res.write('The Stock price of ' + fields.symbol.toUpperCase() + ' is: ' + price);
		  	} else {
		  		res.write("Please enter a valid ticker symbol");
		  	}
		  	res.end();
		}
    	request('http://ichart.finance.yahoo.com/table.csv?s=' + fields.symbol, displayPrice);
	}
    form.parse(req, yahooService);
});

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});