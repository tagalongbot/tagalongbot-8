let cluster = require('cluster')
let os = require('os')
let express = require('express')
let isPrime = require('./is-prime')

if (cluster.isMaster) {
    let cpuCount = os.cpus().length
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork()
    }
} else {
  
}