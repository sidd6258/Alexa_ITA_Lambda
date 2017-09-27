// var MongoClient = require('mongodb').MongoClient;
// var db;
// var connected = false;
//
// var pool = {
//     _collections: {}
// };
//
//
// pool.getCollection = function (name) {
//     if (!this._collections[name]) {
//         this._collections[name] = db.collection(name);
//     }
//     return this._collections[name];
// };
//
// /**
//  * Connects to the MongoDB Database with the provided URL
//  */
// exports.connect = function (url,callback)
// {
// /*    var dbOptions = {
//         keepAlive: 1,
//         connectTimeoutMS: 300000,
//         socketTimeoutMS: 300000
//     };*/
//     MongoClient.connect(url, function(err, _db){
//         if (err)
//         {
//             throw new Error('Could not connect: '+err);
//         }
//         db = _db;
//         connected = true;
//         callback();
//     });
// };
//
//
// /**


//  * Returns the collection on the selected database
//  */
// exports.collection = function (name) {
//
//     return pool.getCollection(name);
//
// };



var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        connected = true;
        console.log(connected +" is connected?");
        callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
        throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db.collection(name);

};