"use strict";

// Basic express setup:
const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const cookieSession = require('cookie-session');
const morgan = require('morgan');

const app           = express();

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.set("view engine", "ejs");

// logging middleware so we can see what's going on
app.use(morgan('dev'))


// Connect to MongoDB
MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:
  const DataHelpers = require("./lib/data-helpers.js")(db);

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.

  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  const usersRoutes = require("./routes/users")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

  app.use("/users", usersRoutes);


  app.listen(PORT, () => {
    console.log("tweeter app listening on port " + PORT);
  });
})

