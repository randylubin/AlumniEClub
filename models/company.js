/** Event Schema for CrowdNotes **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define schema
var CompanySchema = new Schema({
    name    	: String
  , description : String
  , contactName	: String
  , contactId	: String
  , sectors		: String
  , needs		: Array
});

module.exports = mongoose.model('Company', CompanySchema);
