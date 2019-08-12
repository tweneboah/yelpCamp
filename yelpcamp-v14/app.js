var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user')
//const seed = require('./seed');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const methodOverride = require('method-override')

//requiring routes
const commentsRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')


//MIDLLEWARES
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride('_method')); //is by default

//app.locals.moment = require('moment');
app.locals.moment = require('moment')

//seed()
//======================
// DB CONNECTION
//==============

mongoose.connect('mongodb://localhost/YelpCampV3', {
 useNewUrlParser: true,
 useCreateIndex: true,
 useFindAndModify: false
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
    res.render("landing");
});




//USING ROUTES
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes)

//=================
// SERVER
//=================

app.listen(5000, function(){
   console.log("The YelpCamp V14 Server Has Started!");
});