var path = require('path');
var express = require('express');
var ejs = require('ejs');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use('static', express.static(__dirname + '/public'));

var elasticsearch = require('elasticsearch');
var es = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});

var index = 'bt';
var type = 'seed';

app.get('/', function (req, res) {

    var q = {
        index: index,
        type: type,
        size: 1000
    };

    if (req.query.q) {
        q.body = {
            query: {
                match: {
                    name: req.query.q
                }
            },
            highlight: {
                pre_tags: ['<span>', '<span>'],
                post_tags: ['</span>', '</span>'],
                fields: {
                    name: {}
                }
            }
        }
    }

    es.search(q)
    .then(function(querySet) {
        res.render('index', {querySet: querySet});
    })
    .catch(function(err) {
        console.log(err);
        res.render('error', {});
    });
    
});

app.listen(3000, function(err) {
    if (err) {
        console.err(err);
    } else {
        console.log('server is listening:%s', 3000);
    }
});