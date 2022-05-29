const launches = new Map()

let latestFlightNumber = 100

const launch = {
    flightNumber: 100,
    misson: 'Kelper Exploration X',
    rocket: 'Exploration IS1',
    launchDate: new Date('December 27, 2030'),
    destination: 'kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch)

function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch(launch) {
    latestFlightNumber++
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            flightNumber: latestFlightNumber,
            customers: ['Zero To Mastery', 'NASA'],
            upcoming: true,
            success: true,
        })
    )
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
}
