#About
This repo consists of 3.5 different projects which all need to be abstracted
from each other but haven't been because I haven't had time.  However, they are
all useful in their own right.

## node-namecoin
Node-namecoin is based on node-bitcoin, a simple wrapper for the Bitcoin
client's JSON-RPC API using `jsonrpc.js`. Node-namecoin simply adds a few
Namecoin-specific calls and disables a few Bitcoin-specific calls. Node-Namecoin
doesn't even have it's own testing steup, although we could really use them!  I
MEAN, YOU WOULDN'T WANT TO TRUST THIS SORT OF THING TO SOMEONE WHO TYPES IN ALL
CAPS, WOULD YOU?

The API is mostly equivalent to the command line API minus the stupidity ...
meaning camelCase naming for the methods, most of which are accessed through the
`namecoin.Client` object. You may also call the API directly using the `cmd`
method.

The reason that node-namecoin doesn't just use node-bitcoin as a dependency is
because node-bitcoin will require some refactoring before it can become a base
library for other alt-coins.

## nmc.js
nmc.js adds syntactic sugar to node-namecoin: adding promises, providing sane
defaults, converting multiple options into objects, building query strings, etc.

It is in fairly good shape.

## dump.js
This is a monsterous, hacky script which scrapes the namecoin blockchain into a
local CouchDB instance.  It should be rewritten in Java or Python but, until
then, use it at your own peril.

Dump.js assumes that you have a local CouchDB install which is world writable
and a DB called 'bit'.  This is currently hardcoded into dump.js but it should
be trivial to setup passwords, etc, for the DB. You should (at the very least)
bind CouchDB to localhost or 127.0.0.1.

Even if after you setup passwords, it's unwise to pair your CouchDB front-end
server and your Namecoind instance on the same server. Relax and use CouchDB's
excellent continuous replication feature to sync with your frontend servers.
Binding to localhost will not interfere with outgoing replication jobs.

## Usage notes
Connecting to Namecoind should "just work" on most Unix systems.  `nmc.js` first
checks for a passed config object, then it checks for a local `settings.json`
file and it finally falls back to __searching for the config file at
`~/.namecoin/namecoin.conf`.__

(Technically, it looks for the `process.env.HOME + /.namecoin/namecoin.conf`.)
### Manually specify namecoind settings
#### GUI
1. Make a copy of `settings-example.json` and rename it to `settings.json`
2. Fill in config information in `settings.json`

#### CLI One-liner

```js
echo '{
   "host": "localhost",
   "port": 8334,
   "user": "REPLACE ME",
   "pass": "REPLACE ME"
 }
' > settings.json
```

#### JS Application Object

```js
var client = new namecoind.Client({
  host: 'localhost',
  port: 8334,
  user: 'username',
  pass: 'password'
});
```

### Get balance across all accounts with minimum confirmations of 6

```js
client.getBalance('*', 6, function(err, balance) {
  if (err) return console.log(err);
  console.log('Balance:', balance);
});
```

### Getting the balance directly using `cmd`

```js
client.cmd('getbalance', '*', 6, function(err, balance){
  if (err) return console.log(err);
  console.log('Balance:', balance);
});
```

### Batch multiple RPC calls into single HTTP request

```js
var batch = [];
for (var i = 0; i < 10; ++i) {
  batch.push({
    method: 'getnewaddress',
    params: ['myaccount']
  });
}
client.cmd(batch, function(err, address) {
  if (err) return console.log(err);
  console.log('Address:', address);
});
```

## SSL for namecoin-node
I haven't tested it but I also didn't change any code that depends on it.
See [Enabling SSL on original client](https://en.bitcoin.it/wiki/Enabling_SSL_on_original_client_daemon).

If you're using this to connect to namecoind across a network it is highly
recommended to enable `ssl`, otherwise an attacker may intercept your RPC
credentials resulting in theft of your namecoins.

When enabling `ssl` by setting the config option to `true`, the `sslStrict`
option (verifies the server certificate) will also be enabled by default. It is 
highly recommended to specify the `sslCa` as well, even if your namecoind has
a certificate signed by an actual CA, to ensure you are connecting
to your own namecoind.

```js
var client = new namecoind.Client({
  host: 'localhost',
  port: 8336,
  user: 'username',
  pass: 'password',
  ssl: true,
  sslStrict: true,
  sslCa: fs.readFileSync(__dirname + '/myca.cert')
});
```