const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "please enter your email"],
        validate: [validator.isEmail, "Please enter a valid email!"]
    },
    password: {
        type: String,
        required: [true, "password is required!"],
        select: false
    },
    role: {
        type: String,
        default: "user"
    },
    avatar: {
        pubic_id: { type: String, required: [true, "avatar is required!"] },
        url: String
    },

    resetPasswordToken: String,
    resetPasswordExpiry: Date
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getjwtToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
}


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.getResetPasswordToken =  function () {
    const resetToken = crypto.randomBytes(10).toString("hex")

    const resetTokenhash = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordToken = resetTokenhash;
    this.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000)

    return resetToken
}

module.exports = new mongoose.model("User", userSchema)