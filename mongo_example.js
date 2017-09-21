"use strict";

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

const db = MongoClient.connect(MONGODB_URI
, (err, db) => {

  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  db.collection("tweets").find().toArray((err, results) => {
      if (err) throw err;

      console.log("results array: ", results);
      // This is the end...
      db.close();
  });


  // function getTweets(callback) {
  //   db.collection("tweets").find().toArray((err, tweets) => {
  //     if (err) {
  //       return callback(err);
  //     }
  //      return callback(null, tweets);
  //   });
  // }

  // getTweets((err, tweets) => {
  //   if (err) throw err;
  //   //console.log(tweets);
  //   db.close();
  //   return tweets;
  // });
});

console.log(db);
