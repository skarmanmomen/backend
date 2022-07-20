const mongoose = require("mongoose")

const database = async () => {
   
        await mongoose.connect(process.env.DB_URL, {})
        console.log(`database connection successful.`)
   
}

module.exports = database