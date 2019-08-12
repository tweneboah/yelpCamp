
// All middlewares goes here

const middlewareObj = {}

//LOGIN 
middlewareObj.isLogin = function(req, res, next){
   if(req.isAuthenticated()){
      return next()
  }else {
   req.flash('error', 'Please login first')
   res.redirect('/login')
  }
}
// NOTE
//This middleware is not relevant because we are handling the logic on the show template page because the show template page has access to the current login user and the all the camps created by all the users. Our main objective is to show or hide the edit and delete button. 

//If we are showing the edit/delete button to all users but our objective is to alert a user who don't have access to the camp he/she created when he/she is trying to delete


// middlewareObj.checkCampgroundOwnership = function(req, res, next) {
//            //Is user logged in ?
//            if(req.isAuthenticated()){
        
//             Campground.findById(req.params.id, (err, foundCampground) => {
//                 if(err){
//                     res.redirect('back')
//                 }else {
//                     //If a user logged in, does the user own this post?
//                     //Here we will compare the id of the current logged in user to the user/author used to create this post
    
//                     //So after we found the campground we will compare the author's id  (foundCampground.author.id)and the current logged in user (req.user.id).
    
//                     //NOTE: The id from mongoose foundCampground.author.id is an object and the id from the authentication req.user.id is a string, so we can't use === to compare instead mongoose has an api that helps us to compare id in mongoose (object) to a string
    
//                 //    console.log('Author created this camp', typeof foundCampground.author.id);
//                 //    console.log('User who just login',typeof req.user.id)
//                      if(foundCampground.author.id.equals(req.user.id)){
//                             next()
//                      }else {
//                          res.redirect('back') //Return user to previous page
//                      }
                    
//                 }
//             })
//         }else {
//              res.redirect('back')
//         }
// }



module.exports  = middlewareObj;