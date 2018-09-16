var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var chatSchema = mongoose.Schema({
    user: String,
    body : String,
    whisper_id : String
});
module.exports = mongoose.model('Chat', chatSchema);