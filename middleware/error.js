
const ErroHandler = require("../utils/errorHandler");

const error = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.messgae = err.messgae || "Inernal server error!"


    // wrong mongodb error
    if (err.name === "CastError") {
        const msg = `resource not found! invalid id : ${err.path}`
        err = new ErroHandler(msg, 400)
    }
    // duplicate key error
    if (err.code === 11000) {
        const msg = `duplicate ${Object.keys(err.keyValue)} entered!`
        err = new ErroHandler(msg, 400)
    }

    // wrong jsonwebtoken error
    if (err.name === "JsonWebTokenError") {
        const msg = `jwt toke is invalid! try again leter.`
        err = new ErroHandler(msg, 400)
    }


    // wrong jsonwebtoken expired error
    if (err.name === "TokenExpiredError") {
        const msg = `jwt toke is expired ry again leter.`
        err = new ErroHandler(msg, 400)
    }

    res.status(err.statusCode).json({ suc: false, error: err.stack })

}

module.exports = error