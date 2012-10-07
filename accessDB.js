// Module dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

// dependencies for authentication
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var Company = require('./models/company');
var User = require('./models/user');


// Define local strategy for Passport
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    User.authenticate(email, password, function(err, user) {
      return done(err, user);
    });
  }
));
      
// serialize user on login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// deserialize user on logout
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// connect to database
module.exports = {
  // Define class variable
  myEventID: null,

  // initialize DB
  startup: function(dbToUse) {
    mongoose.connect(dbToUse);
    // Check connection to mongoDB
    mongoose.connection.on('open', function() {
      console.log('We have connected to mongodb');
    }); 

  },

  // get user's selected event
  getMyEvent: function(callback) {
    Event.findOne({'_id': this.myEventID}, function(err, myEvent) {
      callback(null, myEvent);
    });
  },

  getUserInfo: function(userId, callback){
    User.findOne({_id: userId}, function(err, userObject){
      console.log(userObject);
      callback(null, userObject);
    });
  },

  getCompanyInfo: function(companyId, callback){
    Company.findOne({_id: companyId}, function(err, companyObject){
      callback(null, companyObject);
    });
  },

  getAllUsers: function(callback){
    User.find({}, function(error, allUsers) {
          if( error ) callback(error)
          else callback(null, allUsers)
        });
  },

  getAllCompanies: function(callback){
    Company.find({}, function(error, allCompanies) {
          if( error ) callback(error)
          else callback(null, allCompanies)
    });
  },

/*  // clear user's selected event
  clearMyEvent: function(callback) {
    this.myEventID = null;
    callback(null);
  },
*/
  // save a user
  saveUser: function(userInfo, callback) {
    //console.log(userInfo['fname']);
    var newUser = new User ({
      name : { first: userInfo.fname, last: userInfo.lname }
    , email: userInfo.email
    , password: userInfo.password
    , blurb: userInfo.blurb
    , gradClass: userInfo.gradClass
    , skills: userInfo.skills
    , industries: userInfo.industries
    });


    newUser.save(function(err) {
      if (err) {throw err;}
      //console.log('Name: ' + newUser.name + '\nEmail: ' + newUser.email);
      callback(null, userInfo);
    });
  },

  saveCompany: function(companyInfo, callback) {
    var newCompany = new Company ({
      name: companyInfo.name
    , description: companyInfo.description
    , contactName:  companyInfo.contactName
    , contactId: companyInfo.contactId
    , sectors: companyInfo.sectors
    , needs: companyInfo.needs
    });

    newCompany.save(function(err, companyInfo){
      if (err) {throw err;}
      callback(null, companyInfo);
    })
  },

  updateUser: function(userInfo, callback) {
    console.log('checkone');
    User.update(
      {_id: userInfo._id}
    , {$set: 
        { name : { first: userInfo.fname, last: userInfo.lname }
        , blurb: userInfo.blurb
        , gradClass: userInfo.gradClass
        , skills: userInfo.skills
        , industries: userInfo.industries
        }
      }
    , {upsert: true}
    , function(err){
        console.log('checktwo');
        if (err) {throw err;}
        callback();
      }) 
  },

  updateCompany: function(companyInfo, callback) {
    console.log('checkone: ' + companyInfo.id);
    Company.update(
      {_id: companyInfo.id}
      , {$set:
          { name: companyInfo.name
          , description: companyInfo.description
          , sectors: companyInfo.sectors
          , needs: companyInfo.needs
          }
        }
      , {upsert: true}
      , function(err){
          console.log('checktwo');
          if (err) {throw err;}
          callback();
      })
  },

  addCompanyToUser: function(companyInfo, callback) {
    User.update(
      {_id: companyInfo.contactId}
    , { $set: {companyName: companyInfo.name, companyId: companyInfo._id}}
    , function(err){
        if (err) {throw err;}
        callback();
      }

    )
  },
/*
  // save an event
  saveEvent: function(eventInfo, callback) {
    var newEvent = new Event ({
      name : eventInfo.name
    , date : eventInfo.date
    , description : eventInfo.desc
    });

    newEvent.save(function(err) {
      if (err) {throw err;}
      //console.log('Name: ' + newEvent.name + '\nDate: ' + newEvent.date + '\nDesc: ' + newEvent.description);
      callback(null, eventInfo);
    });
  },

  // save a note
  saveNote: function(noteInfo, callback) {
    var newNote = new Note ({
        _user : noteInfo.userid
      , body    : noteInfo.note
      //, date    : Date.now
      , _event  : noteInfo.eventid
      });

    newNote.save(function (err) {
      if (err) {throw err;}
      //console.log('Name: ' + newNote._user + '\nNote: ' + newNote.body);
      callback(null, newNote);
    });
  },
*/
  // disconnect from database
  closeDB: function() {
    mongoose.disconnect();
  },

/* events
  // get all the events
  getEvents: function(sortby, callback) {
    var query = Event.find({},['name', 'date', '_id']);
    query.sort(sortby,1);
    query.exec(function(err, events) {
      callback(null, events);
    });
  },

  // get all the users
  getUsers: function(callback) {
    User.find({}, ['name', '_id'], function(err, users) {
      callback(null, users);
    });
  },

  // get all the notes from a specific event
  getNotesFromEvent: function(eventid, callback) {
    Note
    .find({'_event':eventid})
    .populate('_user')
    .populate('_event')
    .run(function(err, notes) {
      callback(null, notes);
    })
  },

  // set the event
  setEvent: function(eventid, callback) {
    this.myEventID = eventid;
    callback(null);
  },

  // get the notes from a specific user
  getNotesFromUser: function(userid, callback) {
    console.log('userid: ' + userid);
    Note
    .find({'_user':userid})
    .populate('_user')
    .populate('_event')
    .run(function(err, notes) {
      callback(null, notes);
    })
  }*/

}

