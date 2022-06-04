const http = require('http')
const mongoose = require('mongoose')

const app = require('./app')

const { loadPlanetsData } = require('./models/planets.model')

const PORT = process.env.PORT || 8000

const MONGO_URL =
    'mongodb+srv://nasa-api:4mFoiwupeX5r1f5r@cluster0.jkpu3.mongodb.net/nasa?retryWrites=true&w=majority'

const server = http.createServer(app)

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function connectToMongo() {
    try {
        await mongoose.connect(MONGO_URL)
    } catch (err) {
        console.error('MONGODB_CONNECTION_ERROR::', err)
    }
}

async function startServer() {
    await connectToMongo
    await loadPlanetsData()

    server.listen(PORT, () => {
        console.log(`Listening on PORT ${PORT} ...`)
    })
}

startServer()
