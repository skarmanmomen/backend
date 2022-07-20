const app = require("./app");



// uncauth error
process.on("uncaughtException",err=> {
    console.log(`uncautherror ${err.message}`)
    process.exit(1)
})
 

const server = app.listen(process.env.PORT, (err) => {
    if (!err) {
        return console.log(`server is working on port : ${process.env.PORT}`)
    }
    console.log(err, "server is not working! due to problem")

}) 

// unhandeled rejecton 
process.on("unhandledRejection",err => {
    console.log(err.message)
    console.log(`shutting down the server due to  unhadled rejection `)

    server.close(() => 
    {
        process.exit(1)
    })
})