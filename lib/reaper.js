var os = require('os');

var reaper = function () {
    
};

reaper.prototype.reap = function() {
    var cpus = os.cpus();
    var _cpus = [];
    for (var i = 0; i < cpus.length; i++) {
        _cpus.push(cpus[i].times);
    };

    return {
        free_mem: os.freemem(),
        total_mem: os.totalmem(),
        free_mem_percent: parseInt(os.freemem() / os.totalmem() * 10000) / 100,
        cpus: _cpus
    }
}

module.exports = reaper;