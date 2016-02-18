/**
 * Created by Rain on 1/9/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.methods.checkPassword = function (candidatePassword) {
    console.log('check pass', candidatePassword);
    var isUsersPassword = false;
    if (candidatePassword === this.password) {
        isUsersPassword = true;
    }
    return isUsersPassword;
};

var User = mongoose.model('User', userSchema);

module.exports = User;