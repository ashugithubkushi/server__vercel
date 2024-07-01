const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleName: String,
    vehicleNum: String,
    contactNum: String,
    count: Number
});


const VehicleModel = mongoose.model('Vehicle', vehicleSchema);

module.exports = VehicleModel;