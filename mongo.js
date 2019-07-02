const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://admin:admin@35.225.220.91:27017';
 
// Database Name
const DB_NAME = 'sopes1proyecto';

const COLLECITON_NAME = 'tweets';
 

const MONGODB = {

    insert: function(document) {
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
            if (err) throw err;
            console.log("Connected successfully to server");
        
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECITON_NAME);
            collection.insertOne(document, function(err, result) {

                if (err) throw err;
                console.log("tweet guardado en database;");
                client.close();
            });
        });
    },

    delete: function(callback) {
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
            if (err) throw err;
            console.log("Connected successfully to server");
        
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECITON_NAME);
            collection.remove({});
        });
    }



/*
    insert: function(db, callback) {
        // Get the documents collection
        const collection = db.collection('tweets');
        // Insert some documents
        collection.insertOne({
            content:"this is a tweet #test"
        }, function(err, result) {

            if (err) {
                console.error(err);
                return;
            }

            console.log("tweet guardado en database;");
            callback(result);
            
        });

    }*/
}


module.exports = MONGODB;