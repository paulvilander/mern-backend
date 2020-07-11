const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const PORT = process.env.PORT || 8000


const app = express()
const server = http.Server(app)
const io = socketio(server)

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

try {
	const MongoClient = require("mongodb").MongoClient;
	const client =  new MongoClient(process.env.MONGO_DB_CONNECTION,{ 
		useNewUrlParser: true});
	client.connect();
    mongoose.connection.once('open', () => { console.log('MongoDB Connected'); });
   

} catch (error) {
	mongoose.connection.on('error', (err) => { console.log('MongoDB connection error: ', err); }); 
}

const connectUsers = {}

io.on('connection', socket => {
	const { user } = socket.handshake.query

	connectUsers[user] = socket.id
})

//app.use()
app.use((req, res, next) => {
	req.io = io
	req.connectUsers = connectUsers
	return next()
})
app.use(cors())
app.use(express.json())
app.use('/files', express.static(path.resolve(__dirname, '..', 'files')))
app.use(routes)

server.listen(PORT, () => {
	console.log(`Listening on ${PORT}`)
})
