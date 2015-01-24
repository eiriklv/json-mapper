JSON API endpoint mapper
========================

#### TODO
* description of the templating system
* better description of how to use the module
* full test suite

#### Introduction:
Fetch JSON endpoint data and map them to your needs with templates.

#### Example use:
```js
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
```

#### Example template
```json
{
    "name": "Mashable",
    "url": "http://mashable.com/stories.json?hot_per_page=0&new_per_page=30&rising_per_page=0",
    "listref": "new",
    "template": {
        "elements": [
            {
                "name": "guid",
                "type": "url",
                "required": true,
                "items": [
                    {
                        "selector": "link"
                    }
                ]
            },
            {
                "name": "title",
                "required": true,
                "items": [
                    {
                        "selector": "title"
                    }
                ]
            },
            {
                "name": "url",
                "type": "url",
                "required": true,
                "items": [
                    {
                        "selector": "link"
                    }
                ]
            },
            {
                "name": "image",
                "type": "url",
                "items": [
                    {
                        "selector": "responsive_images[1].image"
                    },
                    {
                        "selector": "responsive_images[0].image"
                    }
                ],
                "fallback": "http://rack.1.mshcdn.com/assets/header_share_logo.v2-11a2e0632ddb46b143c85e63f590734d.png"
            }
        ]
    }
}
```

#### Example output:
```js
[
    {
        _source: 'mashable',
        _origin: 'http://mashable.com/stories.json?hot_per_page=0&new_per_page=30&rising_per_page=0',
        _host: 'mashable.com',
        _ranking: 29,
        guid: 'http://mashable.com/2014/08/13/ap-journalist-killed-in-gaza/',
        title: 'AP Journalist Killed in Gaza',
        url: 'http://mashable.com/2014/08/13/ap-journalist-killed-in-gaza/',
        image: 'http://rack.2.mshcdn.com/media/ZgkyMDE0LzA4LzEzL2Y4L1NpbW9uZUNhbWlsLjVkY2M5LmpwZwpwCXRodW1iCTM1MHgzNTAjCmUJanBn/6dc9e302/5cf/Simone-Camilli-AP.jpg'
    },
    ....
]
```
