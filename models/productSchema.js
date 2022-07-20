const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name."]
    },
    price: {
        type: Number
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: Number,
        // required: [true, "please enter product rating"]
    },
    category: {
        type: String,
        required: [true, "please enter product category"]
    },
    stock: {
        type: Number,
        default: 0,
        required: [true, "please enter product stock"]
    },
    images: [
        {
            public_id: { type: String, required: [true, "please enter images id "] },
            url: { type: String, required: [true, "please enter images id "] }
        }
    ],
    numOfreviews: {
        type: Number,
        default: 0,
        required: [true, "please enter prodcu num of reviews"]
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            name: String,
            comment: String,
            rating: Number
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = new mongoose.model("Product", productSchema)