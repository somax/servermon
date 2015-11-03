/**
 * loadJS 动态加载 JS
 * @example
 * loadJS(['./js/ctrl.js','./js/service.js'])
		.then(function(){
			console.log('do step 1');
		})
		.then(function () {
			console.log('do step 2');
		})
 */
(function(global) {

	function getBasePath() {
		var s = global.document.getElementsByTagName('script');
		var loadjsName = 'load.js';
		var reg = new RegExp(loadjsName + '$');
		for (var i = 0; i < s.length; i++) {
			var src = s[i].attributes.src.value;
			if (reg.test(src)) {
				return src.replace('load.js', '');
			}
		}
	}

	global.__loadjsBasePath = getBasePath();
	global.__loadedjs = {};


	function loadJS(srcs) {
		// "use strict";
		// 
		// 


		function Loader(_srcs) {
			var _loader = this;
			_loader.__cbs = [];

			var _loadingCount = 0;
			var _loadedCount = 0;


			_srcs.forEach(function _load(src) {

				src = global.__loadjsBasePath + src;
				if (!/.js$/.test(src)) {
					src += '.js';
				}

				function _onload(ev) {

					if (ev) {
						var target = ev.target;
						console.info('"'+ target.getAttribute('src') + '" loaded.');
						global.__loadedjs[src] = target;
						_loadedCount++;
					}

					if (_loadedCount === _loadingCount) {
						while (_loader.__cbs.length > 0) {
							// try{
							_loader.__cbs[0]();
							// }catch(err){
							// console.error(err);
							// }
							_loader.__cbs.shift();
						}
					}

				}

				if (global.__loadedjs[src] && global.__loadedjs[src] !== 'loading') {

					// _onload(src);
					// return global.__loadedjs[src];
					// return _then;
				} else {

					_loadingCount++;

					global.__loadedjs[src] = 'loading';
					var ref = window.document.getElementsByTagName("script")[0];
					var script = window.document.createElement("script");

					
					script.src = src;
					script.async = true;
					ref.parentNode.insertBefore(script, ref);
					// if (cb && typeof(cb) === "function") {
					script.onload = _onload;
					// }
					// global.__loadedjs[src] = script;
					window.sp = script;
				}

			});



			var _then = {
				then: function(cb) {
					_loader.__cbs.push(cb);
					return _then;
				}
			};
			return _then;

		}

		Loader.prototype.then = function() {

		};

		var ld = new Loader(srcs);

		return ld;
		// return script;
	}

	global.loadJS = loadJS;
})(window);