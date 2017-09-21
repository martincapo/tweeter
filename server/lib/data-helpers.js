"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      simulateDelay(() => {
        db.collection('tweets').insertOne(newTweet);
        callback(null, true);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      let  tweet = db.collection('tweets').find().toArray((err, results) => {
        if (err) throw err;

        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, results.sort(sortNewestFirst));
      });
    }
  }
}

// db.collection('inventory').insertOne({
//   item: "canvas",
//   qty: 100,
//   tags: ["cotton"],
//   size: { h: 28, w: 35.5, uom: "cm" }
// })
// .then(function(result) {