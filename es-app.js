'use strict';

var elasticsearch = require('elasticsearch');
var moment = require('moment');
var P2PSpider = require('./lib');

var es = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var p2p = P2PSpider({
    nodesMaxSize: 200,   // be careful
    maxConnections: 400, // be careful
    timeout: 5000
});

var index = 'bt';
var type = 'seed';

p2p.ignore(function (infohash, rinfo, callback) {
    
    es.get({
        index: index,
        type: type,
        id: infohash
    })
    .then(function(res) {
        return es.update({
            index: index,
            type: type,
            id: infohash,
            body: {
                script: 'ctx._source.peer_counter += peer',
                params: {
                    peer: 1
                }
            }
        });
    })
    .then(function(res) {
        console.log('infohash exist:%s', infohash);
        callback(true);
    })
    .catch(function(err, res) {
        if (err.status && err.status == 404) {
            callback(false);
        } else {
            console.error(err);
        }
    });

});

p2p.on('metadata', function (metadata) {
    //console.log('=======================================');
    //console.log('hash:%s', metadata.infohash);
    //console.log('name:%s', metadata.info.name.toString());
    var files = [];
    var totalLength = 0;
    if (metadata.info.files) {
        metadata.info.files.forEach(function(file) {
            file.path = file.path.toString();
            files.push({length: file.length, path: file.path});
            totalLength += file.length;
        });
    } else {
        totalLength = metadata.info.length;
        files.push({length: metadata.info.length, path: metadata.info.name.toString()});
    }

    es.create({
        index: index,
        type: type,
        id: metadata.infohash,
        body: {
            name: metadata.info.name.toString(),
            files: JSON.stringify(files),
            length: totalLength,
            peer_counter: 1,
            created_at: (new Date())
        }
    })
    .then(function(res) {
        console.log('add infohash:%s', metadata.infohash);
    })
    .catch(function(err) {
        console.log(err);
    });
    
});

p2p.listen(6881, '0.0.0.0');
