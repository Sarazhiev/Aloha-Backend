import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    status : {
        type: String,
        required: true
    },
    orders : {
        type: Array,
        required: true
    },
    number: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
})

export default  mongoose.model('Orders', OrdersSchema)