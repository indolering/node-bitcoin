/**
 * @license AGPLv3 2014
 * @author indolering
 */
var namecoind = require('./lib/index'),
  DEBUG = true,
  Promise = require('es6-promise').Promise,
  fs = require("fs"),
  sugar = require('sugar');

Object.extend();

function nmc(config) {
  if (!config) {
    fs.readFileSync('settings.json', function(err, data) {
      if (err) {
        fs.readFileSync(process.env.HOME + '/.namecoin/namecoin.conf', function(err, data) {
          if (err) {
            if(debug){
              console.log("Error when reading system config file, assuming no username/password.");
            }

            config = {
              host: 'localhost',
              port: 8334,
              user: '',
              pass: ''
            };

          } else {
            config = JSON.parse(data);
          }
        });
      } else {
        config = JSON.parse(data);
      }
    });
  }

  var that = this;

  this.client = new namecoind.Client(config);

  this.blockCount = function() {
    return new Promise(function(resolve, reject) {
      that.client.getBlockCount(function(err, value) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  };

  this.info = function() {

    return new Promise(function(resolve, reject) {
      that.client.getInfo(function(err, value) {
        if (err)
          reject(err);
        else
          resolve(value);
      });
    });
  };

  this.show = function(name, namespace) {
    namespace = namespace || 'd';

    return new Promise(function(resolve, reject) {
      that.client.name_show(namespace + '/' + name, function(err, value) {
        if (err)
          reject(err);
        else
          resolve(value);
      });
    });
  };

  this.scan = function(args) {
    args = args || '';
    if (typeof args === 'string') {
      args = {'name': args};
    }
    args['namespace'] = args['namespace'] || 'd';
    args['max'] = args['max'] || 500;


    return new Promise(function(resolve, reject) {
      that.client.name_scan(
        args.namespace + '/' +
          args.name + ' ' +
          args.max,
        function(err, value) {
          if (err)
            reject(err);
          else
            resolve(value);
      });
    });
  };

  /**
   * Arguments for filter-args.
   * @typedef {Object} filter-args
   * @property {string} regex,
   * @property {?number} age,
   * @property {?number} start,
   * @property {?number} max,
   * @property {?boolean} stat
   * */

  /**
   * Returns all values whose name matches Regex.
   * @param {( string | {filter-args} )} args String regex or query parameters.
   * @returns {Array.<Object>}
   * TODO: turn namespace (d/) into parameter
   */
  this.filter = function(args) {
    args = args || '^d/';
    if (typeof args === 'string') {
      args = {'regex': args};
    }

    args.age = args.age || 36000;
    args.start = args.start || 0;
    args.max = args.max || 0;
    args.stat = args.stat || false;

    var query = [args.regex, args.age, args.start, args.max];


    //NOTE falsy check @ init, 'true' input COULD be 'stat' or 'hamburger'
    //check for (not false) and enter in 'stat'!
    if (args.stat !== false) {
      query.push('stat');
    }

    return new Promise(function(resolve, reject) {
      //Note that jsonrpc was modified and it looks for this specific
      //query, you cannot replace with generic jsonrpc w/out that mod.

      that.client.name_filter(query, function(err, value) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(value);
          }
        }
      );
    });

  };
}

module.exports = new nmc();