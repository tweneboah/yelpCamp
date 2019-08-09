const mongoose = require('mongoose');


//CONNECT DB

mongoose.connect("mongodb://localhost/DB-Association");



// 1. CREATE MODELS
// POST - title, content
var postSchema = new mongoose.Schema({
 title: String,
 content: String
});
var Post = mongoose.model("Post", postSchema);


// USER - email, name
var userSchema = new mongoose.Schema({
  email: String,
  name: String,
  posts: [postSchema]
});
var User = mongoose.model("User", userSchema);

// 2. CREATE A USER
let newUser = new User({
    email: "hermione@hogwarts.edu",
    name: "Hermione Granger"
});

//  SAVING THE USER
newUser.save(function(err, user){
  if(err){
      console.log(err);
  } else {
      console.log(user);
  }
});


// 3. CREATE A POST
var newPost = new Post({
    title: "Reflections on Apples",
    content: "They are delicious"
});

newPost.save(function(err, post){
    if(err){
        console.log(err);
    } else {
        console.log(post);
    }
});

//==============AT THIS POINT THE USER AND IT'S POST ARE UNRELATED

// ========
// RELATING POST TO A USER
//===============


// NOTE:

// 1. A user must be created in our DB then we find that user and he/she can created it's post

//If a user is authenticated, we can find it by req.user.id

//After finding the user we then push the post into the embeded field in the user model that represent the post array

User.findOne({name: "Hermione Granger"}, function(err, user){
 if(err){
     console.log(err);
 } else {
     user.posts.push({
         title: "3 Things I really hate 2",
         content: "Voldemort.  Voldemort. Voldemort 2"
     });
     user.save(function(err, user){
         if(err){
             console.log(err);
         } else {
             console.log(user);
         }
     });
 }
});