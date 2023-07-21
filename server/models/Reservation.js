const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ReservationSchema = new Schema({
    customer: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phonenum: {
        type: String,
        required: true
    },
    reservedvehicle: {
        type: String,
        required: true
    },
    fromdate: {
        type: String,
        required: true
    },
    todate: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    }
})

const Reservation = mongoose.model("reservation", ReservationSchema);
module.exports = Reservation;