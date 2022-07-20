const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErroHandler = require("./errorHandler");

const isAutenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErroHandler("login fast", 401))
    }

    const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.user = await User.findById(decodedData.id)

    next()
})

 
module.exports = isAutenticated