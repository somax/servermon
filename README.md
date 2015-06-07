# ServerMon

Reap and report the server's status

## Usage

Install with npm

    npm install servermon


Run as server    `./bin/servermon -s`


Run as reaper    `./bin/servermon -r`

Options
	--help, -h
		Displays help information about this script
		'servermon -h' or 'servermon --help'

	--reaper, -r
		Run as reaper.
		'servermon -r' or 'servermon --reaper'

	--server, -s
		Run as server.
		'servermon -s' or 'servermon --server'

	--host, -H
		Specify the server's hostname. (default: 127.0.0.1)
		'servermon -r -H 127.0.0.1' or 'servermon --reaper --host=127.0.0.1'

	--port, -p
		Specify the port. (default: 1337)
		'servermon -s -p 1337' or 'servermon --server --port=1337' or 'servermon -r -p 1337' or 'servermon --reaper --port=1337'

	--reaperid, -n
		Specify the reaper's id.
		'servermon -n serv1' or 'servermon --reaperid=serv1'

	--interval, -i
		Specify the reaper's interval.
		'servermon -i 5000' or 'servermon --interval=5000'

	--version
		Displays version info
		servermon --version


Data storage

	/db.json

Config

    /config.json

### Example
```javascript


```



## Test
```bash
$ npm install -g mocha
$ mocha
```

## License

**MIT**
