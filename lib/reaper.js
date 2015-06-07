/**
 * Reaper get os information
 * @return {[type]} [description]
 *
 * hostname:
  loadavg:
  uptime:
  freemem:
  totalmem: 
  cpus:
  type:
  release:
  networkInterface:
  arch: 
  platform: 
  tmpdir:
 */
var os = require('os');

var reaper = function(id) {
    this.id = id;
};

reaper.prototype.reap = function(opt) {

    var cpus = os.cpus();
    var _cpus = [];
    for (var i = 0; i < cpus.length; i++) {
        _cpus.push(cpus[i].times);
    };

    var result = {
        t: (new Date()).toLocaleString(),
        id: this.id || os.hostname(),
        data: {
            mf: os.freemem(),
            mt: os.totalmem(),
            cpu: _cpus
        }
    }

    if (opt === 'all') {
        result.os = {
            type: os.type(),
            release: os.release(),
            platform: os.platform(),
            arch: os.arch(),
            networkInterface: os.networkInterfaces()
        }
    }



    return result
}

module.exports = reaper;