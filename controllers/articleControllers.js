var express = require("express");
var router = express.Router();
var article = require("../models/Article");

router.get("/", function(req, res) {
    cat.all(function(data) {
      var hbsObject = {
        articles: data
      };
      console.log(hbsObject);
      res.render("index", hbsObject);
    });
  });


  module.exports = router;

