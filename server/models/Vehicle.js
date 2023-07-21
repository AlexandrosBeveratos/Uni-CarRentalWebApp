const mongoose = require('mongoose');
const Schema = mongoose.Schema

const VehicleSchema = new Schema({
    carmake: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    enginetype: {
        type: String,
        enum: ['Petrol', 'Diesel', 'Electric', 'LPG'],
        required: true
    },
    enginesize: {
        type: String,
        required: true
    },
    seats: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        enum: ['available', 'reserved', 'unoperational'],
        required: true
    },
    stdprice: {
        type: String,
        required: true
    },
    regnumber: {
        type: String,
        unique: true,
        required: true
    },
    vehicleImage: {
        data: Buffer,
        contentType: String,
    }
})

const Vehicle = mongoose.model("vehicle", VehicleSchema);
module.exports = Vehicle;