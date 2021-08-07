#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const http = require('http');
const https = require('https');
const fs = require('fs');
const debug = require('debug')('testserver:server');

/**
 * Get port from environment and store in Express.
 */

const options = {
    key: fs.readFileSync(__dirname+'/private-key.pem'),
    cert: fs.readFileSync(__dirname+'/public-cert.pem')
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', 8000);
app.set('secPort', 8080);
/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const secureServer = https.createServer(options, app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
secureServer.listen(app.get('secPort'), () => {
    console.log('Server listening on port ',app.get('secPort'));
});
server.on('error', onError);
server.on('listening', onListening);
secureServer.on('error', onError);
secureServer.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}