var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment')
const seed = require('./seed')
app.use(bodyParser.urlencoded({extended: true}));

 app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");


seed()
//======================
// DB CONNECTION
//==============

mongoose.connect('mongodb://localhost/YelpCampV3', {
 useNewUrlParser: true,
 useCreateIndex: true
})
.then(() => console.log("DB Connected successfully"));



//====================
// HOME PAGE
//====================

app.get("/", function(req, res){
    res.render("landing");
});

//GET FORM
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new.ejs"); 
 });
 

//==================================
//INDEX PAGE -> Show all campgrounds
//==================================

app.get('/campgrounds', (req, res) => {
    //Get All campgrounds from DB
    Campground.find({}, (err, allCampgrounds)=> {
        if(err){
            console.log(err)
        }else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds})
        }
    })
})


//============================
// CREATE CAMPGROUNDS
//============================

app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    let desc = req.body.description
    var newCampground = {name: name, image: image, description: desc}

    //Create a new campground and save to DB
    Campground.create(newCampground, (err, newlyVreated) => {
        if(err){
            //console.log(err)
        }else {
            //Redirect back to campground page
            res.redirect('/campgrounds')
        }
    })
    
});

//=================
// SHOW MORE INFO
//=============

app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})


//==========
//COMMENTS ROUTES
//=============

//1. get the comment form
app.get('/campgrounds/:id/comments/new', (req, res) => {
     //find camprgound by ID after finding the id we will search for the full details of the campground and we will pass it to the form template
     Campground.findById(req.params.id, (err, campground) => {
         if(err){
             console.log(err)
         }else {
            res.render('comments/new', {campground: campground})
         }
     })
})

//Create Comment

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //req.body.comment contains all the values from the form
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                //Adding to campgrounds comment
                campground.comments.push(comment);
                //save
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
            }
         });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
 });
 
//=================
// SERVER
//=================

app.listen(5000, function(){
   console.log("The YelpCamp Server Has Started!");
});