var mongoose         = require("mongoose");

var hospDatabaseSchema = mongoose.Schema({
    name:String,
    A1_ : String,
    A2 : String,
    A2_ : String,
    B : String,
    B_ : String,
    A1 : String,
    A1B : String,
    A1B_ : String,
    A2B : String,
    A2B_ : String,
    AB : String,
    AB_ : String,
    O : String,
    O_ : String,
    A : String,
    A_ : String,
});
module.exports = mongoose.model('hospDatabase', hospDatabaseSchema);