const sendToken = async (user, statusCode, res) => {
    const token = await user.getjwtToken()


    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000),

    }

    res.status(statusCode).cookie("token", token, options).json({ suc: true, user, token })
}

module.exports = sendToken