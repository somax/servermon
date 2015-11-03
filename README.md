# ServerMon

Reap and report the server's status


## Usage

Install
	
	git clone https://git.coding.net/somax/servermon.git
	cd servermon && npm install
    cd html && bower install
	cd ..

Run as server `node . -s`

Run as reaper `node . -r`

## Options
### --help, -h
	
Displays help information about this script.

`servermon -h` or `servermon --help`

### --reaper, -r

Run as reaper.

`servermon -r` or `servermon --reaper`

### --server, -s

Run as server.

`servermon -s` or `servermon --server`

### --host, -H

Specify the server's hostname. (default: 127.0.0.1)

`servermon -r -H 127.0.0.1` or `servermon --reaper --host=127.0.0.1`

### --port, -p

Specify the port. (default: 1337)

`servermon -s -p 1337` or `servermon --server --port=1337` or `servermon -r -p 1337` or `servermon --reaper --port=1337`

### --reaperid, -n

Specify the reaper's id.

`servermon -n serv1` or `servermon --reaperid=serv1`

### --interval, -i

Specify the reaper's interval.

`servermon -i 5000` or `servermon --interval=5000`

### --version

	Displays version info

	`servermon --version`


## Data storage

默认 `db/db.json`， 可在 config.json 中自定义。

## Config

`/config.json`


	{
		"mailer": {
			"service": "163", 
			"auth": {
				"user": "jkr3_servermon@163.com",
				"pass": "dXN2a3FvcXl1cnd2bHd6ZQ"
			},
			"mailto":"jkr3_servermon@163.com",
			"reportDataNum":10
		},
		"checker":{
			"freememPercent":1.5,
			"loadAvg":0.7,
			"count":3 //连续检查超过此数字，则采取相应措施
		},
		"reaper":{
			"interval":600000
		},
		"reporterStorage":{
			"MaxStoreNum":100
		},
		"storage":{
			"jsonFile":"db/db.json"
		}
	}



## DELETDATA 

> !! Unrecoverable, BE CAREFUL !!
`curl -X "DELETE" http://SERVERHOST:1338/api/status?q=REAPER-ID`

## Test
```bash
$ npm install -g mocha
$ mocha
```

## License

**MIT**
