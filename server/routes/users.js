"use strict";

const express       = require('express');
const usersRoutes  = express.Router();
const bcrypt = require('bcrypt');


module.exports = function(DataHelpers) {

  usersRoutes.get("/login", function(req, res) {
      res.render("login");
  })

  // User Login
  usersRoutes.post("/login", (req, res) => {

    if (!req.body.username) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const username = req.body.username;
    const password = req.body.password;
    var IsUser = false;

    DataHelpers.getUser((err, users) => {

      if (err) {
        res.status(500).json({ error: err.message });

      } else {
    // Check if user is registed
        IsUser = users.find(element => {
          // 1. check user name
          if(element.user === username) {
            // 2. check password
            if(bcrypt.compareSync(password, element.password)) {
              req.session.user_id = element.id;
              res.redirect("/");
              return true;
            } else {
              res.status(400).json({ error: "password does not match"});
              return true;
            }
          } else {
            res.status(400).json({ error: "user name is not exist" });
            return true;
          }
        });
      }
    });
  });


  usersRoutes.get("/register", function(req, res) {
      res.render("register");
  })

  usersRoutes.post("/register", function(req, res) {
    if (!req.body.username) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    // Store hash in user password DB
    var hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = {
      user: req.body.username,
      password: hashedPassword
    };

    DataHelpers.saveUser(user, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.redirect("/");
      }
    });

  });

  return usersRoutes;
}
