/**
 * Reaper get os information
 * @return {[type]} [description]
 *
 * 
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
const Disks = require('nodejs-disks');

var reaper = function(id) {
    this.id = id;
};

reaper.prototype.reap = function(opt) {

    var cpus = os.cpus();
    var _cpus = [];
    for (var i = 0; i < cpus.length; i++) {
        _cpus.push(cpus[i].times);
    }

    var freemem = os.freemem();
    var totalmem = os.totalmem();
    let result = {
        t: (new Date()).toLocaleString(),
        id: this.id || os.hostname(),
        data: {
            mf: freemem,
            mp: parseInt(freemem / totalmem * 10000) / 100,
            loadavg: os.loadavg(),
            uptime: os.uptime(),
            cpu: _cpus
        }
    };

    if (opt === 'all') {
        result.os = {
            hostname: os.hostname(),
            type: os.type(),
            totalmem: os.totalmem(),
            release: os.release(),
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus(),
            networkInterface: os.networkInterfaces()
        };
    }

    const Defer = Promise.defer();

    Disks.drives((err, drives)=>{
      if(err){
        Defer.reject(err);
      }
      Disks.drivesDetail(drives,(err, data)=>{
        if(err){
          Defer.reject(err);
        }
        result.data.disks = data; 
        Defer.resolve(result);
      })
    })
    // return result;
    return Defer.promise;
};

module.exports = reaper;