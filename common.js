
const asPort = 3333;
const apiPort = 3334;
const spaPort = 3000;

module.exports = {
    asPort,
    apiPort,
    asUrl: `http://localhost:${asPort}`,
    serverUrl: `http://localhost:${apiPort}`,
    spaUrl: `http://localhost:${spaPort}`,
    jwtSecret: 'tjaupgxgmbcezgqlcnwmgpfn',
    jwtExp: '30s'
}
