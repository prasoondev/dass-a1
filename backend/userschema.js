const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
    },

    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
    },

},{ database: 'bst' });

module.exports = mongoose.model.users || mongoose.model("users", UserSchema);