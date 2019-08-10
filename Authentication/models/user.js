const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const UserSchema = new mongoose.Schema({
 username: String,
 password: String
});

//Plugin in the passport
// Taking care of hashing, salting and others
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)