const ErroHandler = require("./errorHandler")


const isauthorizedRole = (...roles) => (req, res, next) => {


    if(!roles.includes(req.user.role)) {
        next( new ErroHandler(`Role: ${req.user.role} is not allowd access this resouce`))
    }
    next()
}

module.exports = isauthorizedRole