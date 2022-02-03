/*
 *  refactoring according to Separate Express 'app' and 'server'
 *  https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/separateexpress.md
 */
const http = require('http')
const app = require('./app')
// const {PORT, BASE_URL} = require('./utils/config')

const port = 5000 //PORT ??
// app.set('port', port)

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
