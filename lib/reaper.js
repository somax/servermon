var os = require('os');

var reaper = function (id) {
    this.id = id;
};

reaper.prototype.reap = function() {
    var cpus = os.cpus();
    var _cpus = [];
    for (var i = 0; i < cpus.length; i++) {
        _cpus.push(cpus[i].times);
    };

    return {
        t:new Date(),
        id:this.id,
        data:{        
            mf: os.freemem(),
            mt: os.totalmem(),
            cpu: _cpus
        }
    }
}

module.exports = reaper;