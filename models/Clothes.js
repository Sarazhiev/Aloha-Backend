import mongoose from "mongoose";

const ClothesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    priceSale: Number,
    colors : {
        type: String,
        required: true
    },
    sizes : {
        type: Array,
        default: [],
    },
    category: {
        type: String,
        required: true
    },
    gender: {
      type: String,
      default: "uni"
    },
    inStock: {
        type: Number,
        default: 0,
    },
    images: {
        type:Array,
        default: [],
    },
    viewsCount : {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
})

export default  mongoose.model('Clothes', ClothesSchema)