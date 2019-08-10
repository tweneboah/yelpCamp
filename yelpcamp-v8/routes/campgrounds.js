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
router.get("/new" ,isLoggedIn ,function(req, res){
    console.log('new form loggin user', req.user)
 res.render("campgrounds/new.ejs"); 
});


//==================================
//INDEX PAGE -> Show all campgrounds
//==================================

router.get('/', (req, res) => {
    
 //Get All campgrounds from DB
 //console.log('All campgrounds', req.user)
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

router.post("/", isLoggedIn ,function(req, res){
 // get data from form and add to campgrounds array
 var name = req.body.name;
 var image = req.body.image;
 let desc = req.body.description

 var newCampground = {
     name: name, 
     image: image,
     description: desc,

    }

 //Create a new campground and save to DB
 Campground.author.push(req.user.username).create(newCampground, (err, newlyCreated) => {
     if(err){
         //console.log(err)
     }else {
         //Redirect back to campground page
         console.log('Created Camp', newlyCreated)
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



module.exports = router;

