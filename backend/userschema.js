const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    
    userId: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique ID if not provided
      },
    
    fname: {
        type: String,
        required: [true, "Please provide a First Name!"],
        unique: false,
    },

    lname: {
        type: String,
        required: [true, "Please provide a Last Name!"],
        unique: false,
    },

    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
    },

    age: {
        type: Number,
        required: [true, "Please provide an Age!"],
        unique: false,
    },

    contact: {
        type: Number,
        required: [true, "Please provide a Contact!"],
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
    },

    items: {
        type: Array,
        required: false,
        unique: false,
        default: [],
    },

    deliver: {
        type: Array,
        required: false,
        unique: false,
        default: [],
    },

    orderhistory: {
        type: Array,
        required: false,
        unique: false,
        default: [],
    },

    reviews: {
        type: Array,
        required: false,
        unique: false,
        default: [],
    },

});

module.exports = mongoose.model.users || mongoose.model("users", UserSchema);