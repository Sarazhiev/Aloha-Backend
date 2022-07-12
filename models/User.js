import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash : {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    favorites : {
        type: Array,
        default: []
    },
    orders : {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
})

export default  mongoose.model('User', UserSchema)