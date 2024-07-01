const mongoose = require('mongoose');

const createuserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    designation: String,
    contact: String,
});


const CreateUserModel = mongoose.model('Createuser', createuserSchema);

module.exports = CreateUserModel;