var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require('mongoose')
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//======================
// DB CONNECTION
//==============
mongoose.connect('mongodb://localhost/yelpCampV2');

//==============
//SCHEMA
//===========

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

let Campground = mongoose.model('Campground', campgroundSchema);

//====================
// HOME PAGE
//====================

app.get("/", function(req, res){
    res.render("landing");
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
            res.render('index', {campgrounds: allCampgrounds})
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
            console.log(err)
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
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err)
        }else{
            //Render show template with that campground
            res.render('show', {campground: foundCampground})
        }
    });
})




//=================
// GET THE FORM
//=================

app.get("/campgrounds/new", function(req, res){
   res.render("new.ejs"); 
});


//=================
// SERVER
//=================

app.listen(5000, function(){
   console.log("The YelpCamp Server Has Started!");
});