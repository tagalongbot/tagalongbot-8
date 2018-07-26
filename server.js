let cluster = require('cluster')
let os = require('os')
// let { sendErrorMsg } = require('./libs/telegram.js');

if (cluster.isMaster) {
    let cpuCount = os.cpus().length
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork()
    }
} else {
  require('./app.js');
}

cluster.on('exit', (worker) => {
  // sendErrorMsg('Bevl Beauty Worker Exited');
  cluster.fork();
});