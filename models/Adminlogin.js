const mongoose = require('mongoose');

const adminloginSchema = new mongoose.Schema({
    username: String,
    password: String,
});


const AdminloginModel = mongoose.model('Adminlogin', adminloginSchema);

module.exports = AdminloginModel;