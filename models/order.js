const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            required: true
        },
        dateTime: {
            type: Date,
            required: true
        },
        bill: {
            cart: [
                {
                    id: {
                        type: Number,
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    },
                    description: {
                        type: String,
                        required: true
                    },
                    price: {
                        type: Number,
                        required: true
                    },
                    image: {
                        type: String,
                        required: true
                    }
                }
            ],
            totalBill: {
                type: Number,
                required: true
            },
            status: {
                type: String,
                required: true
            },
            tableNumber: {
                type: String,
                required: true
            },
            dateTime: {
                type: Date,
                required: true
            }
        },
        info: {
            fullName: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            }
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Orders", orderSchema);
module.exports = Order;
