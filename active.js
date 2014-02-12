/**
 * @license AGPLv3 2014
 * @author indolering
 */

var doc =
{
  "_id": "advanced",
  "_rev": "2-4dcf03de5d905dd56fa2a402042e0bc2",
  "ip": "212.232.51.96",
  "map": {
    "*": "212.232.51.96"
  },
  "email": "namecoin@mail.com",
  "expires": 193407
};

var badVals = [
  "10.",
  "1.0.",
  "192.",
  "1.2.",
  "91.250.85.116",
  "164.138.28.170",
  "BM-GtzxVwFQiFCPYowVdMjq17krG6SehDxy",
  "namecoin@mail.com",
  "local",
  "127.",
  "212.232.51.96"
];

var badVars = [
  "bitmessage",
  "$reserved",
  "$error"
];

function checkVals(doc) {

  for (var i = 0; i < badVars.length; i++) {
    if (doc[badVars[i]]) {
      return false;
    }
  }

  var keys = Object.keys(doc);

  for (var i = 0; i < keys.length; i++) {
    var value = doc[keys[i]];

     if (typeof value === 'string') {
      for (var j = 0; j < badVals.length; j++) {
        var badVal = badVals[j];
        if (value === badVal ||
          value.lastIndexOf(badVals[j], 0) === 0) {
          return false;
        }
      }
    }

    if (typeof value === 'object') {
      return checkVals(value);
    }

  }
}


//console.log(checkVals(doc));

function test(doc) {
  if(Object.keys(doc).length > 3){
    if (checkVals(doc) !== false) {
      console.log((doc._id, doc));
    }
  }
}

test(doc);

//function(doc) {
//  if(
//    doc.value !== "" &&
//      doc.value !== "BM-GtzxVwFQiFCPYowVdMjq17krG6SehDxy" &&
//      typeof doc.$error === 'undefined' &&
//      typeof doc.$reserved === 'undefined' &&
//      typeof doc.bitmessage === 'undefined' &&
//      doc.email !== "namecoin@mail.com" &&
//      doc.ns !== ["qwert"] &&
//      doc.map[''] !== '1.0.0.0' &&
//      doc.map[''] !== '10.0.0.200' &&
//      doc.map[''] !== '10.0.0.0' &&
//      doc.map[''] !== '10.10.10.10' &&
//      doc.map[''] !== '91.250.85.116' &&
//      doc.map[''] !== '10.0.0.7' &&
//      doc.map[''] !== '164.138.28.170' &&
//      doc.ip !== '10.0.0.7' &&
//      doc.ip !== '164.138.28.170' &&
//      doc.ip !== '91.250.85.116' &&
//      doc.ip !== '10.10.10.10' &&
//      doc.ip !== '1.2.3.4' &&
//      doc.ip !== '127.0.0.1' &&
//      doc.ip !== '0.0.0.0' &&
//      doc.ip !== '10.0.0.0'){
//    if(
//      typeof doc.ip !== 'undefined' ||
//        typeof doc.ipv6 !== 'undefined' ||
//        typeof doc.map !== 'undefined' ||
//        typeof doc.ns !== 'undefined' ||
//        typeof doc.alias !== 'undefined' ||
//        typeof doc.translate !== 'undefined'){
//
//      emit(doc._id, doc);
//    }
//  }
//}