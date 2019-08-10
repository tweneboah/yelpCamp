var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    //Extracting the most important data from the user and associate it to the comment

    //We have to link this user to the comment creating route and we can only get the user after authentication as req.user
    author: {
     id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
     },

     username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);