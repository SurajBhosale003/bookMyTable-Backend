const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['available', 'reserving', 'booked'],
        required: true
    },
    duration: {
        type: String,
        required: true
    }
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
