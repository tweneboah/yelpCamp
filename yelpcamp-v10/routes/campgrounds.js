const express = require('express');
const router = express.Router();
const Campground = require('../models/campground')

//middleware
function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
     return next();
 }
 res.redirect("/login");
}


//GET FORM
router.get("/new", isLoggedIn, function(req, res){
 
 res.render("campgrounds/new.ejs"); 
});


//==================================
//INDEX PAGE -> Show all campgrounds
//==================================

router.get('/', (req, res) => {
 //Get All campgrounds from DB
 
 Campground.find({}, (err, allCampgrounds)=> {
     if(err){
         console.log(err)
     }else {
         
         res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user})
     }
 })
})


//============================
// CREATE CAMPGROUNDS
//============================

router.post("/",isLoggedIn ,function(req, res){
 // get data from form and add to campgrounds array
 var name = req.body.name;
 var image = req.body.image;
 let desc = req.body.description

 //This must be the same as field in the model
 let author = {
     id: req.user_id,
     username: req.user.username
 }
 var newCampground = {name: name, image: image, description: desc, author: author}

 //Create a new campground and save to DB
 Campground.create(newCampground, (err, newlyCreated) => {
     if(err){
         //console.log(err)
     }else {
         //Redirect back to campground page
         console.log('Newly Created Cam', newlyCreated)
         res.redirect('/campgrounds')
     }
 })
 
});

//=================
// SHOW MORE INFO
//=============

router.get('/:id', (req, res) => {
 console.log('From Show more', req.user)
 Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
     if(err){
         console.log(err);
     } else {
         console.log(foundCampground)
         //render show template with that campground
         res.render("campgrounds/show", {campground: foundCampground});
     }
 });
});


//==============
//EDIT CAMPGROUND
//=============

//get the edit form
router.get('/:id/edit', (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err)
        }else {
            console.log('Found camp to edit', foundCampground.name)
            res.render('campgrounds/edit', {campground: foundCampground})
        }
    })
   
})

//Editing logic
router.put('/:id', (req, res) => {
    //find the campground you want to update and then retrieve the data from the form you want to update. Because of that we will build the data coming from the edit form and pass it as a second arguemnt to findByIdAndUpdate
    let campgroundsToBeUpdated = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }
    Campground.findByIdAndUpdate(req.params.id, campgroundsToBeUpdated, (err, updatedCampground) => {
        if(err){
            console.log(err)
        }else {
            console.log(updatedCampground);
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})
module.exports = router;

