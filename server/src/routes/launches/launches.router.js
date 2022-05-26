const express = require('express')
const { getAllLaunches } = require('./launches.controller')

const launchesRouter = express.Router()
console.log(typeof getAllLaunches)
launchesRouter.get('/launches', getAllLaunches)

module.exports = launchesRouter
