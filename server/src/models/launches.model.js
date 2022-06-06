const axios = require('axios')
const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const launches = new Map()

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
    flightNumber: 100, // flight_number
    mission: 'Kelper Exploration X', //name
    rocket: 'Exploration IS1', // rocketname
    launchDate: new Date('December 27, 2030'), //date_local
    target: 'Kepler-442 b', //not applicable
    customers: ['ZTM', 'NASA'], //payload.customers for each payload
    upcoming: true, //upcoming
    success: true, //success
}

saveLaunch(launch)

const SPACEX_API_URL = process.env.SPACEX_API_URL

const loadLaunchData = async () => {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    },
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1,
                    },
                },
            ],
        },
    })

    const launchDocs = response.data.docs

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocketname'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
            target: launchDoc[''],
        }

        console.log(`${launch.flightNumber} - ${launch.mission}`)
    }
}

async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({ flightNumber: launchId })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber')
    return !latestLaunch ? DEFAULT_FLIGHT_NUMBER : latestLaunch.flightNumber
}

async function getAllLaunches() {
    return await launchesDatabase.find(
        {},
        {
            _id: 0,
            __v: 0,
        }
    )
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    })

    if (!planet) {
        throw new Error('No matching planet found')
    }

    await launchesDatabase.findOneAndUpdate(
        {
            flightNumber: launch.flightNumber,
        },
        launch,
        {
            upsert: true,
        }
    )
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber()

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero To Mastery', 'NASA'],
        flightNumber: newFlightNumber + 1,
    })
    await saveLaunch(newLaunch)
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne(
        {
            flightNumber: launchId,
        },
        {
            upcoming: false,
            success: false,
        }
    )

    return aborted.modifiedCount === 1
}

module.exports = {
    loadLaunchData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
}
