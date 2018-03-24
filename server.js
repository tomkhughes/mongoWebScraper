    var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect("mongodb://localhost/scraper", {
//     useMongoClient: true
// });
if(process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI, function(){
    console.log("uri connected");
  });
}
else{
  mongoose.connect('mongodb://localhost/scraper', function(){
    console.log("local load");
  });
}
var mongoDB = mongoose.connection;

// Show any Mongoose errors
mongoDB.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Show any Mongoose errors
mongoDB.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Once logged into mongoDB mongoDB through mongoose, log a success message
mongoDB.once('open', function() {
  console.log('Mongoose connection successful')
});

// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://bleacherreport.com/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // Error Handler to prevent duplicates
        var titlesArray = [];
        // Now, we grab every h2 within an article tag, and do the following:
        $(".articleContent").each(function(i, element) {
            // Save an empty result object
            var result = {};
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(element).children().find('h3').text();
            // result.paragraph = $(element).children().find('p').text();
            result.link = $(element).children().attr("href");
            console.log(result.link);
            // $(element).children().find('a').text();
        if(titlesArray.indexOf(result.title) == -1){
        titlesArray.push(result.title);
            db.Article.count({ title: result.title }, function(err, test) {
                //if the test is 0, the entry is unique and good to save
                if (test == 0) {
                    var entry = new db.Article(result);
                    // Save the entry to MongoDB
                    entry.save(function(err, doc) {
                        if (err) {
                            console.log(err);
                        }
                        // or log the doc that was saved to the DB
                        else {
                            console.log(doc);
                        }
                    });

                }
                // Log that scrape is working, content is already in the Database
                else {
                    console.log('Repeated DB Content. Not saved to DB.')
                }
            });
        }   

        });
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.redirect("/");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function(dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
// Delete Comment Route
app.post('/articles/:id', function (req, res){
  // Collect comment id
  var commentId = req.params.id;
  // Find and Delete the Comment using the Id
  db.Article.findByIdAndRemove(req.params.id, function (err, todo) {  
    if (err) {
      console.log(err);
    } 
    else {
      // Send Success Header
      res.sendStatus(200);
    }
  });

});
// Server and set up for Heroku app
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('App listening on PORT: ' + PORT);
});
// // Start the server
// app.listen(PORT, function() {
//     console.log("App running on port " + PORT + "!");
// });