var cheerio = require('cheerio');
var url = require('url');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var helpers = require('./helpers');
var async = require('async');

// helper to access nested objects with string literals as object key. Example -> Object.byString(someObj, 'part3[0].name');
Object.byString = helpers.byString;

exports = module.exports = function(mapping, posts, callback) {
    var valid = true;
    var ranking = 0;
    var entries = [];

    async.eachSeries(posts, function (post, callback) {
        var entry = {
            _source: mapping.name,
            _origin: mapping.url,
            _host: url.parse(mapping.url).host,
            _ranking: ranking++
        };            

        mapping.template.elements.forEach(function (element) {
            var holder;

            if (element.required) {
                valid = false;
            }

            element.items.forEach(function (item) {
                var active = false;
                // get the entry element
                if (item.scrape) {
                    var $ = cheerio.load(Object.byString(post, item.selector));
                    holder = $(item.scrape.selector).attr(item.scrape.attribute);
                }
                else if (item.decode) {
                    holder = entities.decode(Object.byString(post, item.selector));
                }
                else {
                    holder = Object.byString(post, item.selector);
                }

                // set item if it has been found
                if (holder && !entry[element.name]) {
                    entry[element.name] = holder;
                    active = true;
                }
            });

            // add fallback if supplied
            if (element.fallback && !entry[element.name]) {
                entry[element.name] = element.fallback;
            }

            if (entry[element.name] && (element.type == 'url')) {
                entry[element.name] = helpers.fixRelativePath(entry[element.name], entry._source);
            }

            // check if item is required for entry to be valid, and then check if item is set
            if (element.required && entry[element.name]) {
                valid = true;
            }
        });

        entry = valid ? entry : null;
        entries.push(entry);
        callback();
    }, function (err) {
        callback(err, entries);
    });
};
