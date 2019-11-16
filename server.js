var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var app = express();
var axios = require("axios");
var cheerio = require("cheerio");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars"); 

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";



var collections = ["scrapedData"];
var db = require("./models");

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", function (req, res) {
    res.send("Hello world");
});

app.get("/scrape", function (req, res) {
    axios.get("http://www.lavanguardia.com/politica")
        .then(function (response) {
            console.log("something ran");
            var $ = cheerio.load(response.data);

            var articlesArray = [];

            $("article").each(function (i, element) {

                var title = $(this).find("h1").text();
                var link = $(this).find("a").attr("href");

                var result = {
                    title: title,
                    link: link,
                };

                articlesArray.push(result);


            });
            console.log(articlesArray);
            db.Article.create(articlesArray);
        });
    res.send("Scrape Complete");
});

app.get("/all", function (req, res) {
    db.Article.find({})
        .then(function (Article) {
            res.json(Article);
        })
        .catch(function (err) {
            res.json(err)
        })
});

app.listen(3000, function () {
    console.log("App running on port 3000!");
});
