const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user')


//middleware
function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
     return next();
 }
 res.redirect("/login");
}

//============
 // REGISTER USER
 //Show form
 //===========
 router.get('/register', (req, res) => {
  res.render('register')
});

//Registration logic

router.post('/register', (req, res) => {
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
router.get('/login', (req, res) => {
  res.render('login')
})

//Login logic
router.post('/login',passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}) , (req, res) => {
  
});

//logout route

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds')
})





module.exports = router;


