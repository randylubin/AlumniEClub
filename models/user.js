/** User Schema for CrowdNotes **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passport = require('passport');
var bcrypt = require('bcrypt');

// Define schema
var UserSchema = new Schema({
    name : { 
        first: { type: String, required: true } 
      , last: { type: String, required: true }
    }
  , email: { type: String, unique: true }
  , blurb: { type: String, unique: false }
  , companyName: { type: String, unique: false }
  , companyId: { type: String, unique: false }
  , gradClass: { type: String, unique: false }
  , skills: { type: Array, unique: false }
  , industries: { type: Array, unique: false }
  , salt: { type: String, required: true }
  , hash: { type: String, required: true }
});


UserSchema
.virtual('password')
.get(function () {
  return this._password;
})
.set(function (password) {
  this._password = password;
  var salt = this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, salt);
});

// Not entirely sure why the async version isn't working...
//.virtual('password')
//.get(function() {
//  return this._password;
//})
//.set(function(password) {
//  this._password = password;
//  bcrypt.genSalt(10, function(err, salt) {
//    this.salt = salt;
//    bcrypt.hash(password, salt, function(err, hash) {
//      this.hash = hash;
//    });
//  });
//});

UserSchema.method('verifyPassword', function(password, callback) {
  bcrypt.compare(password, this.hash, callback);
});

UserSchema.static('authenticate', function(email, password, callback) {
  this.findOne({ email: email }, function(err, user) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false); }
      user.verifyPassword(password, function(err, passwordCorrect) {
        if (err) { return callback(err); }
        if (!passwordCorrect) { return callback(null, false); }
        return callback(null, user);
      });
    });
});

module.exports = mongoose.model('User', UserSchema);
