
/**
  * Module dependencies.
  */
var db = require('../accessDB');


module.exports = {

  // app.get('/'...)
  index: function(req, res) {
    if(req.isAuthenticated()){
      res.render('homeLoggedIn.jade',{ locals:
        { title: 'Alumni EClub'
        , currentUser: req.user
        }
      });
    }else{
      res.render('index.jade', { locals:
        { title: 'Alumni EClub' 
        , currentUser: null
        }
      });
    }  
  },

  // app.get('/register'...)
  getRegister: function(req, res) {
    res.render('register.jade');
  },

  // app.post('/register'...)
  postRegister: function(req, res) {
    db.saveUser({
      fname : req.param('name.first')
    , lname : req.param('name.last')
    , email : req.param('email')
    , password : req.param('password')
    , blurb : req.param('blurb')
    , gradClass: req.param('gradClass')
    , skills : req.param('skills')
    , industries : req.param('industries')
    , blurb : req.param('blurb')
    }, function(err,docs) {
      res.redirect('/account');
    });
  },

  // app.get('/about', ...
  about: function(req, res) {
    res.render('about.jade');
  },

  // app.get('/login', ...
  login: function(req, res) {
    res.render('login.jade');
  },

  // app.get('/account', ensureAuthenticated, ...
  getAccount: function(req, res) {
      res.render('account.jade', { locals:
        { title: 'Alumni EClub' 
        , currentUser: req.user
        }
      });
  },

  // app.get('/logout'...)
  logout: function(req, res){
    req.logout();
    res.redirect('/');
  },

  // app.get/company/new
  newCompany: function(req, res) {
    res.render('newCompany.jade', { locals:
      { title: 'Alumni EClub'
      , currentUser: req.user
      }
    });
  },

  postNewCompany: function(req, res) {
    db.saveCompany({
      name      : req.param('name')
    , description : req.param('description')
    , contactName   : req.param('contactName')
    , contactId: req.param('userId')
    , sectors   : req.param('sectors')
    , needs   : req.param('needs')

    }, function(err,companyInfo) {
      console.log(companyInfo)
      db.addCompanyToUser(companyInfo
      , function(err){
          res.redirect('/account');
        }); 
    });
  },


  // app.get('/companies/all')
  showAllCompanies: function(req, res) {
    db.getAllCompanies(function(err, allUsers) {
      res.render('showAllCompanies.jade', { locals:
      { title: 'Alumni EClub'
      , companyList: allUsers
        }
      });
    });
  },

  showAllUsers: function(req, res) {
    db.getAllUsers(function(err, allUsers) {
      res.render('showAllUsers.jade', { locals:
        { title: 'Alumni EClub'
        , userList: allUsers
        }
      });
    });
  },  

  // app.get(/user/:id)
  publicUserProfile: function(req, res) {
    db.getUserInfo(req.params.id, function(err, userObject) {
      console.log('in index.js: ' + userObject);
      res.render('publicUserProfile.jade', { locals:
        { title: 'Alumni EClub'
        , currentUser: req.user
        , publicProfileObject: userObject

        /*{
            mentorName: 'First and Last'
          , gradYear: '2011'
          , blurb: 'This is some info about me'
          , companyLink: {
              companyName: 'Meetings.io'
            , companyId: '123456'
            }
          , skillsOffered: ['Money','Intros', 'Coding']
          , industryInterests: ['tech', 'healthcare']
          }*/
        }
      });
    });
  },

  // app.get(/company/:id)
  publicCompanyPage: function(req, res) {
    db.getCompanyInfo(req.params.id, function(err, companyObject){


      res.render('publicCompanyPage.jade', { locals:
        { title: 'Alumni EClub'
        , currentUser: req.user
        , publicCompanyObject: companyObject

          /*  name: 'Meetings.io'
          , year: '2010'
          , blurb: 'Effortless Video Meetings'
          , contact: 'randy@meetings.io'
          , founders: [{name: 'Randy', id: '123123'},{name:'Denis', id: '234234'}]
          , industry: ['tech','video']
          , needs: ['fundraising', 'hiring']
          }*/
          
        }
      });
    });
  }

};


