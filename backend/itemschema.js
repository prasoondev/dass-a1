const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({

    itemId: {
            type: String,
            required: true,
            unique: true,
            default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique ID if not provided
          },
    
    name: {
        type: String,
        required: [true, "Please provide a name!"],
        unique: false,
    },

    price: {
        type: Number,
        required: [true, "Please provide a price!"],
        unique: false,
    },

    description: {
        type: String,
        required: false,
        unique: false,
        default: "",
    },

    sellerid: {
        type: String,
        required: [true, "Please provide a seller id!"],
        unique: false,
    },

    category: {
        type: Array,
        required: false,
        unique: false,
        default: [],
    },

});

module.exports = mongoose.model.items || mongoose.model("items", UserSchema);