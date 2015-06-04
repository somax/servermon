var log = require('./log'),
	db = require('./storage');

var reporter = function() {
	// if(reaper){
	// 	this.watch(reaper);
	// }
	var _index = 0;
	var _data;
	var stack = this.stack = [];

	// stack.push(function(data, next) {
		
	// })

	function next(err) {

		if(err){
			log('[Error]',err)
		}
		// next callback
	    var _next = stack[_index++];

	    // all done
	    if (!_next) {
	    	_index = 0;
	      return;
	    }

	    try{
		    _next(_data,next)
	    }catch(err){
	    	next(err);	
	    }

	}


	this.use = function(fn) {
		this.stack.push(fn)
	}

	this.report = function(data){
		// this.stack[0](data);
		_data = data;
		log('report >>>', data);
		next();
	}

}



// reporter.prototype.use = function(fn) {
// 	this.stack.push(fn)
// }

// reporter.prototype.report = function(data) {
// 	// mailer.send(data);
// 	log('report >>>', data)
// 	this.stack[0](data);
// }

module.exports = reporter;

