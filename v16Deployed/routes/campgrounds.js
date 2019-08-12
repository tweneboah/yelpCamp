const express = require('express');
const router = express.Router();
const Campground = require('../models/campground')
const middleware = require('../middleware/index')


//GET FORM
router.get("/new", middleware.isLogin, function(req, res){
 
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

router.post("/" , middleware.isLogin ,function(req, res){
 // get data from form and add to campgrounds array
 var name = req.body.name;
 var image = req.body.image;
 let desc = req.body.description

 //This must be the same as field in the model
 let author = {
     id: req.user.id,
     username: req.user.username
 }
 var newCampground = {name: name, image: image, description: desc, author: author}

 //Create a new campground and save to DB
 Campground.create(newCampground, (err, newlyCreated) => {
     if(err){
         //console.log(err)
     }else {
         req.flash('success', 'Campground created successfully')
         res.redirect('/campgrounds')
     }
 })
 
});

//=================
// SHOW MORE INFO
//=============

router.get('/:id', (req, res) => {
 Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
     if(err){
         console.log(err);
     } else {
         //render show template with that campground
         res.render("campgrounds/show", {campground: foundCampground});
     }
 });
});


//==============
//EDIT CAMPGROUND AND UPDATE
//=============

//get the edit form
router.get('/:id/edit', function(req, res) {

        Campground.findById(req.params.id, (err, foundCampground) => {
            res.render('campgrounds/edit', {campground: foundCampground}) 

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
           
            req.flash('success', 'Campground Updated successfully')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})


//==============
// DELETE
//=========

router.delete("/:id",middleware.isLogin ,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           req.flash('success', 'Campground deleted successfully')
           res.redirect("/campgrounds");
       }
    });
 });


 
module.exports = router;

