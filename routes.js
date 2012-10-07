
/** routes.js
  */

var passport = require('passport');

var start = require('./routes/index');
var notes = require('./routes/notes');
var events = require('./routes/events');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = function(app) {

  app.get('/', start.index);

  app.get('/register', start.getRegister);
  app.post('/register', start.postRegister);

  app.get('/about', start.about);

  app.get('/login', start.login);
  app.post('/login', passport.authenticate('local', 
    { 
      successRedirect: '/account', 
      failureRedirect: '/login'
    })
  );

  app.get('/account', ensureAuthenticated, start.getAccount);

  app.get('/logout', start.logout);

  app.get('/user/all', ensureAuthenticated, start.showAllUsers);
  app.get('/user/edit', ensureAuthenticated, start.editUser);
  app.post('/user/edit', ensureAuthenticated, start.postEditUser)
  app.get('/user/:id', ensureAuthenticated, start.publicUserProfile);

  app.get('/company/all', ensureAuthenticated, start.showAllCompanies);
  app.get('/company/new', ensureAuthenticated, start.newCompany);
  app.post('/company/new', ensureAuthenticated, start.postNewCompany);
  app.post('/company/edit', ensureAuthenticated, start.postEditCompany);
  app.get('/company/edit/:id', ensureAuthenticated, start.editCompany);
  app.get('/company/:id', ensureAuthenticated, start.publicCompanyPage);

  app.get('/error/:errorType', ensureAuthenticated, start.errorPage);






/*
  app.get('/reviewNotes', ensureAuthenticated, notes.reviewNotes);

  app.get('/newNote', ensureAuthenticated, notes.getNewNote);
  app.post('/newNote', ensureAuthenticated, notes.postNewNote);
  
  app.get('/myNotes', ensureAuthenticated, notes.getMyNotes);
  
  app.get('/myEventNotes', ensureAuthenticated, notes.getMyEventNotes);

  app.get('/eventNotes', ensureAuthenticated, notes.getEventNotes);
  app.post('/eventNotes', ensureAuthenticated, notes.postEventNotes);

  app.get('/userNotes', ensureAuthenticated, notes.getUserNotes);
  app.post('/userNotes', ensureAuthenticated, notes.postUserNotes);

  app.get('/newEvent', ensureAuthenticated, events.getNewEvent);
  app.post('/newEvent', ensureAuthenticated, events.postNewEvent);

  app.get('/setEvent', ensureAuthenticated, events.getSetEvent);
  app.get('/setEvent/:id', ensureAuthenticated, events.setEventID);
  app.get('/sortEvents/:operation', ensureAuthenticated, events.setEventSort);

  app.get('/clearEvent', ensureAuthenticated, events.clearEvent);  
  */
}
