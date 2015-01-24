var debug = require('debug')('json-mapper:testapp');
var util = require('util');
var endpoint = require('./template');
var JsonMapper = require('../lib');

var jsonMapper = JsonMapper({
    timeOut: 5000
});

debug('running JSON API endpoint mapper');

jsonMapper.parse(endpoint, function(err, entries) {
    if (err) return debug(err);
    debug(util.inspect(entries, { colors: true }));
});
