'use strict';

var P2PSpider = require('./lib');
var models = require('./models');

var p2p = P2PSpider({
    nodesMaxSize: 200,   // be careful
    maxConnections: 400, // be careful
    timeout: 5000
});

p2p.ignore(function (infohash, rinfo, callback) {
    // false => always to download the metadata even though the metadata is exists.
    models.Magnet.findOne({
        attributes: ['infohash'],
        where: {
            infohash: infohash
        }
    })
    .then(function(magnet) {
        if (magnet) {
            callback(true);
            return magnet.increment('peer_counter', {by: 1});
        } else {
            callback(false);
            return null;
        }
    })
    .then(function(magnet) {
        if (magnet)
            console.log('magnet exists:%s', magnet.infohash);
    })
    .catch(function(error) {
        console.log(error);
    });
});

p2p.on('metadata', function (metadata) {
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
    models.Magnet.create({
        infohash: metadata.infohash,
        name: metadata.info.name.toString(),
        files: JSON.stringify(files),
        length: totalLength,
        peer_counter: 1
    })
    .then(function(magnet) {
        //console.log('fetched a magnet:%s', metadata.info.name.toString());
    })
    .catch(function(err) {
        console.log(err);
    });
});

models.sequelize.sync().then(function () {
    p2p.listen(6881, '0.0.0.0');
});