const mongoose = require('mongoose');
const passportLocalMongoose = requrie('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);