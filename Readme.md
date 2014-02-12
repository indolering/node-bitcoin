# node-namecoin

Total lie: [![Build Status](https://travis-ci.org/freewil/node-bitcoin.png)](https://travis-ci.org/freewil/node-bitcoin)

~~The above build status is for node-**bitcoin**, a simple wrapper for the Bitcoin
client's JSON-RPC API. `node-namecoin` simply adds a few Namecoin-specific calls
and disables a few Bitcoin-specific calls. This doesn't even have it's own
testing steup, although we could really use them!  I MEAN, YOU WOULDN'T WANT TO
TRUST THIS SORT OF THING TO SOMEONE WHO TYPES IN ALL CAPS, WOULD YOU?~~

~~The API is mostly equivalent to the command line API minus the stupidity ...
meaning lower CamelCase naming for the methods, most of which are accessed
through the `nmc.Client` object. You may also call the API directly using the
`cmd` method.~~

This is a monsterous, hacky POS which scrapes the namecoin blockchain and pushes
it into a CouchDB instance.  It should be rewritten in Java or Python but, until
then, use it at your own peril.

## Install

`npm install nmcRPC`

## Examples

### Create client
```js
var client = new nmc.Client({
  host: 'localhost',
  port: 8336,
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

## SSL probably doesn't work!
See [Enabling SSL on original client](https://en.bitcoin.it/wiki/Enabling_SSL_on_original_client_daemon).

If you're using this to connect to namecoins across a network it is highly
recommended to enable `ssl`, otherwise an attacker may intercept your RPC credentials
resulting in theft of your namecoins.

When enabling `ssl` by setting the configuration option to `true`, the `sslStrict`
option (verifies the server certificate) will also be enabled by default. It is 
highly recommended to specify the `sslCa` as well, even if your namecoind has
a certificate signed by an actual CA, to ensure you are connecting
to your own namecoind.

```js
var client = new nmc.Client({
  host: 'localhost',
  port: 8336,
  user: 'username',
  pass: 'password',
  ssl: true,
  sslStrict: true,
  sslCa: fs.readFileSync(__dirname + '/myca.cert')
});
```