const mongoose = require('mongoose')

const planetSchema = mongoose.Schema({
    keplerName: { type: String, required: true },
})

modules.exports = mongoose.model('Planet', planetSchema)
