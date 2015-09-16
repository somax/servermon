var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	url = require('url'),
	log = require('log'),
	storage = require('./storage');


var MimeMap = {
  'txt': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'xml': 'application/xml',
  'json': 'application/json',
  'js': 'application/javascript',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'png': 'image/png',
  'svg': 'image/svg+xml'
};

var _handles = {
	'*':function(req,res){
		if(req.url==='/'){
			req.url = '/index.html';
		}
		var _path = './html'+req.url; 

		var _ext = req.url.split('.').pop();

		res.writeHead(200,{'Content-Type':MimeMap[_ext]});

		try{
			res.write(fs.readFileSync(_path, 'utf-8'));
		}catch(err){
			res.writeHead(404);
			res.write('404 Not find!');
		}
	},
	'/download/db.json':function(req,res){
		var filename = 'db.json';
		try{
		  res.writeHead(200,{'Content-disposition': 'attachment; filename=' + filename,'Content-type': MimeMap.json});
		
			res.write(fs.readFileSync('./'+filename, 'utf-8'));
		}catch(err){
			log.err(err);

			res.writeHead(404);
			res.write('File not find!');
		}

		// var file = __dirname + './db.json';

		//   var filename = path.basename(file);


		//   var filestream = fs.createReadStream(file);
		//   filestream.pipe(res);

	},
	'/api':function (req,res) {
		log.debug('_handles','/', Object.getOwnPropertyNames(req.headers),req.headers.host);

		function parseUri(path){
			return 'http://'+req.headers.host+path;
		}
		var _res = {
			'getList':{uri:parseUri('/api/list'),discription:'返回监控服务器id列表'},
			'getStatus':{uri:parseUri('/api/status?q={serverId}'),discription:'返回指定服务器数据'}
		};
		res.write(JSON.stringify(_res));
	},
	'/api/list':function (req,res) {
		log.debug('_handles','/api/list');
		res.write(JSON.stringify(Object.getOwnPropertyNames(storage.get('status'))));
	},
	'/api/status':function (req,res) {
		log.debug('_handles','/api/status');
		var _url = url.parse(req.url,true);
		var _q = _url.query.q;
		var _success;


		switch (req.method){
			case 'GET':
				if(_q){
					var _d = storage.get('status')[_q];
					if(_d){
						res.write(JSON.stringify(_d));
						_success = true;
					}
				}

				if(!_success){
					res.writeHead(404);
					res.write('{"err":"资源不存在"}');			
				}	
				break;
			case 'DELETE':
				if(_q){
					var _status = storage.get('status');
					if(_status.hasOwnProperty(_q)){
						delete _status[_q];
						storage.set('status',_status);
					}
					res.writeHead(204);
					// res.write('{"message":"删除成功！"}');			
				}			
				break;
			default:
				res.writeHead(405);
				res.write('{"err":"Method Not Allowed '+ req.method +'"}');
		}



	}
};


function apiServerHandler(req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});


	var _pathname = url.parse(req.url).pathname;
	var _handle = _handles[_pathname];
	log.debug(_pathname,_handle);
	if(_handle){
		_handle(req,res);
	}else{
		_handles['*'](req,res);
	}

	// res.write(JSON.stringify(storage.get('status')['MxjMBAir.local'].data));
	res.end('');
}
function start () {
	http.createServer(apiServerHandler).listen(1338);
	console.log('API Server running at http://127.0.0.1:1338/');
}

module.exports = {start:start};