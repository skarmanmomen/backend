const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const database = require("./config/database")
const productRoute = require("./routers/productRoutes")
const userRoute = require("./routers/userRoutes")
const orderRoute = require("./routers/orderRoutes")
const error = require("./middleware/error")
const cookieparser =  require("cookie-parser")


// congig
dotenv.config({ path: "./config/config.env" })

// use
app.use(express.json())
app.use(cookieparser())
app.use(cors())
 

//connect wtih server
database()

// just for demo 
app.get("/", (req,res, next) => {
    res.send("welcome to our api service")
})

// product route
app.use("/api/v1",  productRoute)
app.use("/api/v1", userRoute)
app.use("/api/v1", orderRoute)

 
// error handler 
app.use(error)


module.exports = app