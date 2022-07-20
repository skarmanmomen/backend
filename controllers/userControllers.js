const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const User = require("../models/User");
const { use, unsubscribe } = require("../routers/productRoutes");
const ErroHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/sendToken");
const crypto = require("crypto")

// scaffolding for user 
const user = {}

// register user
user.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErroHandler("field is required!", 400))
    }

    const user = await User.create({
        name, email, password,
        avatar: {
            pubic_id: "sldfkh",
            url: "sdf"
        }
    })

    sendToken(user, 201, res)
})

// login user

user.login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErroHandler("field is required!", 400))
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErroHandler("user doesnot exits!", 404))
    }

    const isPassword = await user.comparePassword(password)
    if (!isPassword) {
        return next(new ErroHandler("invalid credentials!", 404))
    }

    sendToken(user, 200, res)

})

// logout user 
user.logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", null, { expires: new Date(Date.now()) }).json({
        suc: true,
        msg: "logged out successful"
    })
})


// forgot user
user.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErroHandler("user not found!", 404))
    }

    // get reset token 
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const resetpasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/reset/password/${resetToken}`

    const msg = `your reset token is \n\n ${resetpasswordUrl} \n\n if you have not requested this email than, ignore this. `

    try {

        sendEmail({
            email: user.email,
            subject: "Ecommerce password recovery",
            message: msg
        })

        res.status(200).json({ suc: true, msg: `email sent to ${user.email} successfully` })



    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErroHandler(error.message, 500))
    }

})


// forgot password token verify
user.forgotPasswordTokenVerify = catchAsyncErrors(async (req, res, next) => {

    const resetTokenhash = crypto.createHash("sha256").update(req.params.token).digest("hex")

    console.log(resetTokenhash)
    const user = await User.findOne({
        resetPasswordToken: resetTokenhash,
        resetPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErroHandler("Invalid reset token or has been expired! again try", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErroHandler("password doesn't match!", 404))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save()

    sendToken(user, 201, res)

})


// get user details 
user.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.id })

    res.status(200).json({ suc: true, user })
})

// update user password
user.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { newPassword, oldPassword, confirmPassword } = req.body;

    const user = await User.findOne({ _id: req.user.id }).select("+password")

    const isPasswordMatched = user.comparePassword(oldPassword)
    if (!isPasswordMatched) {
        return next(new ErroHandler("old password is incorrect!", 404))
    }

    if (newPassword !== confirmPassword) {
        return next(new ErroHandler("password does not match!", 404))
    }

    user.password = newPassword
    await user.save()
    sendToken(user, 201, res)


})


// update user profile 
user.updpateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const userData = {
        email: req.body.email,
        name: req.body.name
    }
    const user = await User.findByIdAndUpdate(req.user.id, userData, { new: true })

    res.status(201).json({
        suc: true,
        msg: "user updated successfully"
    })
})

// get single user for admin
user.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErroHandler("use not found!", 404))
    }

    res.status(200).json({ suc: true, user })
})

// get all user by admin
user.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({ suc: true, users })
})

// update user role
user.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErroHandler("user not exits!", 400))
    }
    user.role = req.body.role;

    await user.save()

    res.status(201).json({ suc: true, msg: "user role updated successful." })
})

// delete user 
user.userDelete = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErroHandler("user not exits!", 400))
    }
    await user.remove()

    res.status(201).json({ suc: true, msg: "user delete  successful." })
})

module.exports = user