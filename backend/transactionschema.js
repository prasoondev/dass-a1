const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema({

    transactionId: {
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

    buyerid: {
        type: String,
        required: [true, "Please provide a buyer id!"],
        unique: false,
    },

    status: {
        type: String,
        required: [true, "Please provide a status!"],
        unique: false,
        default: "pending",
    },

    hashedOTP: {
        type: String,
        required: [true, "Please provide a hashed OTP!"],
        unique: false,  
    },

});

module.exports = mongoose.model.transaction || mongoose.model("transaction", TransactionSchema);