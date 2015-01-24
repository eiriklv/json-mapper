var http = require('http');

exports = module.exports = JsonMapper;

function JsonMapper(options) {
    if (!(this instanceof JsonMapper))
        return new JsonMapper(options);

    this.timeOut = options.timeOut || 10000;
    this.agent = options.agent || (new http.Agent()); // http agent
    this.agent.maxSockets = options.sockets || 5;
}

JsonMapper.prototype._handler = require('./handler');
JsonMapper.prototype._fetch = require('./fetch');
JsonMapper.prototype.parse = require('./parse');
