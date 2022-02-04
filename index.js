/*
 *  refactoring according to Separate Express 'app' and 'server'
 *  https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/separateexpress.md
 */
const http = require('http')
const debug = require('debug')('authZ:server')
const app = require('./app')
// const {PORT, BASE_URL} = require('./utils/config')

const port = 5000 //PORT ??
// app.set('port', port)

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

server.on('error', onError)
server.on('listening', onListening)

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}
