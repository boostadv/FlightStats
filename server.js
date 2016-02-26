var express = require('express');
var path = require('path'); 
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var request = require('request');

var router = express.Router();

var app = express();

/*app.use(favicon());*/
app.use(morgan('dev'));
app.use(bodyParser.json()); 

app.use(router);
app.use(serveStatic(path.join(__dirname, "client"))); 

app.get('/api', function (req, res) {
    res.send('API OK');
});

var cities = ['LED', 'SVX', 'NYC'];

var resultData = {};

app.get('/api/request/:date', function(req, res) {

resultData[req.params.date] = {};
       
cities.forEach(function(item, i) {
    
request('http://api.travelpayouts.com/v1/prices/cheap?origin=MOW&destination='+item+'&depart_date='+req.params.date+'&token=6c073764712e417c2c6f2226d8861216', function (error, response, body) {
    if (!error && response.statusCode == 200) {
       var cityResult = JSON.parse(body);
        resultData[req.params.date][item] = cityResult.data[item][0].price;
        console.log(cityResult);
     };
     
});


});

res.send('Request Scheduled');
    
});

app.get('/api/flights/:date', function(req, res) {
res.json(resultData[req.params.date]);
});

app.listen(1337, function(){
    console.log('Express server listening on port 1337');
});

