var path = require('path');
var express = require('express');
var ejs = require('ejs');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use('static', express.static(__dirname + '/public'));

var models = require('./models');
var Magnet = models.Magnet;

app.get('/', function (req, res) {
    var pageSize = req.query.pageSize || 50;
    var page = req.query.page || 1;

    Magnet.findAndCountAll({
        limit: pageSize,
        offset: (page - 1) * pageSize
    })
    .then(function(querySet) {
        res.render('index', {querySet: querySet, page: page, pageSize: pageSize});
    })
    .catch(function(err) {
        res.render('error', {error: err});
    });
});

app.get('/query', function (req, res) {
    var pageSize = req.query.pageSize || 50;
    var page = req.query.page || 1;
    var q = req.query.q;

    Magnet.findAndCountAll({
        where: {
            name: {
                $like: '%' + q + '%'
            }
        },
        limit: pageSize,
        offset: (page - 1) * pageSize
    })
    .then(function(querySet) {
        res.render('index', {querySet: querySet, page: page, pageSize: pageSize});
    })
    .catch(function(err) {
        res.render('error', {error: err});
    });
});

app.listen(3000, function(err) {
    if (err) {
        console.err(err);
    } else {
        console.log('server is listening:%s', 3000);
    }
});
