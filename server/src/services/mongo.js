require('dotenv').config()
const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect() {
    try {
        await mongoose.connect(MONGO_URL)
    } catch (err) {
        console.error('MONGODB_CONNECTION_ERROR::', err)
    }
}

module.exports = { mongoConnect }
