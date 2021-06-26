const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
const helmet = require('helmet')
const query = require('./controller/query')
// const auth = require('./config/auth.config')

dotenv.config()

const app = express()
const port = process.env.PORT || 8800

app.use(cors())
app.use(bodyparser.urlencoded({limit: '100mb', extended: true }))
app.use(bodyparser.json({limit: '100mb'}))
app.use(helmet())

const server = app.listen(port, () => {
        console.log(`Server running at ${port}`)
    })
    
const socketio = require('socket.io')(server, {
    cors: {
        origin: [
            process.env.URL,
            process.env.DD_URL,
            process.env.DD_LOCAL_URL,
        ], 
        methods: ["GET", "POST"],
        allowedHeaders: [
            "hris"
        ],
        credentials: true
    }
})

socketio.on('connection', (socket) => {

    //User Logged In
    socket.on('loggedIn', (data) => {
        socketio.emit('loggedIn', data)
    })

    //Notifications
    socket.on('newNotifications', (data) => {
        socketio.emit('showNotifications', {
            socket: data.socket,
            title: data.title,
            message: data.message
        })
    })
})

// app.use('/api', auth, query)
app.use('/api', query)

// Get Application Versions
app.get('/appversion', (req, res) => {
    res.send(JSON.stringify(require('./package.json').version))
})