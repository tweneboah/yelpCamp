var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user')
const seed = require('./seed');
const passport = require('passport');
const LocalStrategy = require('passport-local')
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

//============
// CONGIGURING PASSPORT
//==================

app.use(require('express-session')({
    secret: 'Am on the way',
    resave:  false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Passing the authenticated user - req.user to every routs
app.use(function(req, res, next) {
    //Whatever we put into res.local is what available in our templates
    res.locals.currentUser = req.user;
    next()

})
//IsLogin middleware to protect routes

const IsLoggedIn = (req, res, next) => {
    
    if(req.isAuthenticated()){
        return next()
    }else {
        res.redirect('/login')
    }
}

//====================
// HOME PAGE
//====================

app.get("/", function(req, res){
    console.log('From Landing', req.user)
    res.render("landing");
});





//GET FORM
app.get("/campgrounds/new", function(req, res){
    console.log('From Form', req.user)
    res.render("campgrounds/new.ejs"); 
 });
 

//==================================
//INDEX PAGE -> Show all campgrounds
//==================================

app.get('/campgrounds', (req, res) => {
    //Get All campgrounds from DB
    console.log('All campgrounds', req.user)
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
})


//==========
//COMMENTS ROUTES
//=============

//1. get the comment form
app.get('/campgrounds/:id/comments/new', IsLoggedIn , (req, res) => {
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

app.post("/campgrounds/:id/comments",IsLoggedIn , function(req, res){
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
 
//=============
//  AUTH ROUTES
//==============


 //============
 // REGISTER USER
 //Show form
 //===========
 app.get('/register', (req, res) => {
    res.render('register')
 });

//Registration logic

app.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log('Registration Error', err.message);
            return res.render('register')
        }else {
            passport.authenticate('lpcal')(req, res, () =>{
               res.redirect('/campgrounds')
            });
        }
    })
})


//Login form
app.get('/login', (req, res) => {
    res.render('login')
})

//Login logic
app.post('/login',passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}) , (req, res) => {
    
});

//logout route

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds')
})





//=================
// SERVER
//=================

app.listen(5000, function(){
   console.log("The YelpCamp Server Has Started!");
});