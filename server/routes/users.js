"use strict";

const express       = require('express');
const usersRoutes  = express.Router();
const bcrypt = require('bcrypt');

module.exports = function(DataHelpers) {

  usersRoutes.get("/active", function(req, res) {
    res.send(req.session.user_id);
  });

// User Login
  usersRoutes.get("/login", function(req, res) {
      res.render("login");
  });

  usersRoutes.post("/login", (req, res) => {

    if (!req.body.username) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const username = req.body.username;
    const password = req.body.password;
    var isUser = false;
    var isPass = false;

    DataHelpers.getUsers((err, users) => {

      if (err) {
        res.status(500).json({ error: err.message });
      }

    // Check if user is registed
      users.find ((element) => {
        // 1. check user name
        if(element.user === username) {
            isUser = true;
          // 2. check password
          if(bcrypt.compareSync(password, element.password)) {
            req.session.user_id = element.id;
            isPass = true;
          }
        }
      });

      if (isUser && isPass) {
        res.redirect("/");
      } else if (isUser && !isPass) {
        res.status(400).json({ error: "password does not match"});
      } else {
        res.status(400).json({ error: "user name is not exist" });
      }
    });
  });

  // Logout
  usersRoutes.post("/logout", (req, res) => {
    req.session = null;
    res.redirect('/');
  });


// User Registration
  usersRoutes.get("/register", (req, res) => {
      res.render("register");
  })

  usersRoutes.post("/register", (req, res) => {
    if (!req.body.username) {
      res.status(400).json({ error: err.message });
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
        res.redirect("/users/login");
      }
    });

  });

  return usersRoutes;
}
