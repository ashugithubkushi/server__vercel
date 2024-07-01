const mongoose = require('mongoose');

const userloginSchema = new mongoose.Schema({
    email: String,
    password: String,
});


const UserloginModel = mongoose.model('Userlogin', userloginSchema);

module.exports = UserloginModel;