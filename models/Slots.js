const mongoose = require('mongoose');

const slotsSchema = new mongoose.Schema({
    selectedVehicle: String,
    selectedDate: String,
    fromTime: String,
    toTime: String,
    vehicleNumber: String,
    villaNumber: String,
    bookedBy: String,
    status: String,
});


const SlotsModel = mongoose.model('Slots', slotsSchema);

module.exports = SlotsModel;