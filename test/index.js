'use strict';

var P2PSpider = require('../lib');

var p2p = P2PSpider({
    nodesMaxSize: 200,   // be careful
    maxConnections: 400, // be careful
    timeout: 5000
});

p2p.ignore(function (infohash, rinfo, callback) {
    // false => always to download the metadata even though the metadata is exists.
    var theInfohashIsExistsInDatabase = false;
    callback(theInfohashIsExistsInDatabase);
});

p2p.on('metadata', function (metadata) {
    console.log('===========================================');
    console.log(metadata.magnet);
    console.log(metadata.info.name.toString());
    if (metadata.info.files) {
        metadata.info.files.forEach(function(file) {
            file.path.forEach(function(path) {
                console.log(path.toString());
            });
        });
    }
});

p2p.listen(6881, '0.0.0.0');