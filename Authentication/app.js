const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user')
const app = express();



mongoose.connect('mongodb://localhost/AuthDemo', {
 useNewUrlParser: true,
 useCreateIndex: true
})
.then(() => console.log("Auth Demo DB Connected successfully"));


//Adding express session
app.use(require('express-session')({
 secret: 'This is my best Auth', //encode and decode the session
 resave: false, //is by default
 saveUninitialized: false //is by default

}))

//Middleware
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));

//Telling express to use passport
passport.use(new LocalStrategy(User.authenticate()))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser()); //After deserializeUser it will encrypt the user again and put it back in session
passport.deserializeUser(User.deserializeUser());//Redding, taking data from session and turn it into actaull data

//=============
// ROUTES
//==============

app.get('/', (req, res) => {
 res.render('home')
})

//Show signup form
app.get('/register', (req, res) => {
   res.render('register')
})

//Create/register USER
app.post('/register' ,(req, res) => {
  //Getting values from the form to the req.body
  User.register( new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
     console.log(err)
     
     return res.render('/register')
    }else {
     console.log(user.salt)
     passport.authenticate('local')(req, res, () => {
      res.redirect('/secret')
     })
    }
    
  })

})


//============
//LOGIN
//=======

// GET THE LOGIN FORM
 app.get('/login', (req, res) => {
  res.render('login')
 })

 //  LOGIN LOGIC
 //PASS THE LOGIN LOGIC FROM PASSPORT AS A MIDDLEWARE
 app.post('/login', passport.authenticate('local', {
   successRedirect: '/secret',
   failureRedirect: '/login'
 }), (req, res) => {
     
 })

//====
// LOGOUT
//======

app.get('/logout', (req, res) => {
 req.logout();
 res.redirect('/')
});

//=====
// Middleware to check if a user is loggin 
const  isLoggedIn = (req, res, next) =>{
 //isAuthenticated comes with passport
 if(req.isAuthenticated()){
   
     return next();
 }
 res.redirect("/login");
}

app.get('/secret',isLoggedIn ,(req, res) => {
     res.render('secret')
})

app.listen(5000, () => {
 console.log('Authentication is runing')
})