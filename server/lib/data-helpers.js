"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection('tweets').insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection('tweets').find().toArray((err, results) => {
        if (err) throw err;

        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, results.sort(sortNewestFirst));
      });
    },

    // Saves a user to `db`
    saveUser: function(newUser, callback) {
      db.collection('users').insertOne(newUser);
      callback(null, true);
    },

    // Get all users in `db`
    getUser: function(callback) {
      db.collection('users').find().toArray((err, results) => {
        if (err) throw err;
        callback(null, results);
      });
    }

  }
}