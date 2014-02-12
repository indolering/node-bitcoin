/**
 * @license AGPLv3 2014
 * @author indolering
 */

var cradle = require('cradle');
var db = new (cradle.Connection)().database('bit');
var sugar = require('sugar');
Object.extend();
var names = require('./names');
var _ = require('underscore');

for (var i = 0; i < names.length; i++) {
  var name = names[i];
  if (typeof name !== 'undefined') {


  db.get(name, function(err, doc){
      if (!err) {
        db.get('$test' + name, function(err, testdoc){
          if (!err) {
            if (!doc.isObject()) {
              console.log(doc);
              doc = { "nonobject" : doc};
            }
            var keys = doc.value.keys();
            var same = true;
            keys.forEach(function(key) {
              if ((key.slice(0,1) !== '_') && (key.slice(0,1) !=='$') && (key!=='expires')) {
                if (!Object.equal(otherDoc[key], doc[key])) {
                  same = false;
                }
              }
            });
            if(!same){
              console.log(name,doc,testdoc,"---------");
            }else{
              console.log(name + "valid");
            }
          }

        });
      }
    });
  }
  };
