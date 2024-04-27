const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        quote: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            default: 0
        },
        image: {
            type: String,
            required: false,
            default: 'defaultProfile/default-image.jpg' // Set default image path
        }
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
