var debug = require('debug')('jsonfetcher:fetch');
var colors = require('colors');
var util = require('util');
var async = require('async');
var helpers = require('./helpers');
var request = require('request');

exports = module.exports = function (mapping, callback) {
    var requestOptions = {
        url: mapping.url,
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml'
        },
        timeout: 10000,
        pool: this.agent
    };

    async.waterfall([
        // fetch raw mapping entries
        function (callback) {
            request(requestOptions, function (error, response, body){
                if(!error && response.statusCode == 200){
                    callback(null, body);
                } else if (error) {
                    callback(error);
                } else {
                    callback('could not fetch json endpoint');
                }
            });
        },
        // handle and parse mapping entries
        function (body, callback) {
            var entries;
            var error;

            try { entries = mapping.listref ? JSON.parse(body)[mapping.listref] : JSON.parse(body) }
            catch (e) { error = e }
            finally { entries = entries || []; }

            console.log(error);

            callback(error, entries);
        }
    ], function (err, result) {
        callback(err, result);
    });
};
