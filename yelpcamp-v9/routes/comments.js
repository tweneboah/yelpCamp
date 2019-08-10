const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground')
const Comment = require('../models/comment')

//middleware
function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
     return next();
 }
 res.redirect("/login");
}


//==========
//COMMENTS ROUTES
//=============

//1. get the comment form

router.get('/new', isLoggedIn , (req, res) => {
 //find camprgound by ID after finding the id we will search for the full details of the campground and we will pass it to the form template
 

 Campground.findById(req.params.id, (err, campground) => {
    console.log('This campground', campground)
     if(err){
         console.log(err)
     }else {
        
        res.render('comments/new', {campground: campground})
     }
 })
})

//Create Comment

router.post("/" , function(req, res){
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
            //Add username and id to comment. This can be found as req.user

            //associating the req.user.username and req.user._id to the author field inside the comment models. This means we are pushing the login user to the author inside the comment model. The comment here is an instance of the comment model created

            //Pushing the login user details to comments array/model
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
             
            //Save the comment
            comment.save();
            console.log('Comment with user', comment)
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




module.exports = router