var elasticsearch = require('elasticsearch');

var es = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var index = 'bt';
var type = 'seed';

es.indices.create({
    index: index
})
.then(function(res) {
    return es.indices.putMapping({
        index: index,
        type: type,
        body: {
            "_all": {
                "analyzer": "ik_max_word",
                "search_analyzer": "ik_max_word",
                "term_vector": "no",
                "store": "false"
            },
            "properties": {
                "name": {
                    "type": "string",
                    "store": "no",
                    "term_vector": "with_positions_offsets",
                    "analyzer": "ik_max_word",
                    "search_analyzer": "ik_max_word",
                    "include_in_all": "true",
                    "boost": 8
                },
                "files": {
                    "type": "string",
                    "store": "no",
                    "term_vector": "with_positions_offsets",
                    "analyzer": "ik_max_word",
                    "search_analyzer": "ik_max_word",
                    "include_in_all": "true",
                    "boost": 8
                },
                "length": {
                    "type": "long"
                },
                "peer_counter": {
                    "type": "long"
                },
                "created_at": {
                    "format": "strict_date_optional_time||epoch_millis",
                    "type": "date"
                }
            }
        }
    })
})
.then(function(res) {
    if (res.acknowledged) {
        console.log('create index of %s sucess', index);
    }
})
.catch(function(err) {
    console.log(err);
});
