const server = {}
const { User } = require('./models/User')

sockets.init =  (server)  => {
    // socket.io setup
    const io = require('socket.io')(server, {
        
    })
}