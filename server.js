const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server,  {cors: { origin: '*' }})
const{ sessionMiddleware }= require('./config/sessionConfig')
const formatMessage = require('./utils/messages')
const functions = require('./utils/functions')
require('dotenv').config()

app.use(express.static(path.join(__dirname, 'public')))


io.engine.use(sessionMiddleware)

//to save the flow and remember previous message
const levels = {};

// socket.io stuff
io.on('connection', socket => {
    // get session
    const session = socket.request.session
    const sessionId = session.id
    socket.join(sessionId)

    // chatter bot sends a welcome message
    functions.sendWelcomeMessage(io, sessionId)
    functions.sendLoadMessage(io, sessionId)

    // listen for user message
    levels[sessionId] = 0;
    socket.on('user-message', async (msg) => {
        let userMessage = formatMessage('You', msg)
        const number = parseInt(msg)
        io.to(sessionId).emit('user-message', userMessage);
        let botMessage = '';
        let botName = 'chatterbot'
        switch(levels[sessionId]){
            case 0: 
                botMessage = await functions.sendOrderMenu(io, sessionId);
                levels[sessionId] = 1;
                break;
                case 1:
				if (number === 1) {
					botMessage = await functions.sendFoodMenu(io, sessionId);
					levels[sessionId] = 2;
					return;
				} else if (number === 99) {
					botMessage = await functions.checkOutOrder(io, sessionId);
					levels[sessionId] = 1;
				} else if (number === 98) {
					botMessage = await functions.sendOrderHistory(io, sessionId);
					levels[sessionId] = 1;
				} else if (number === 97) {
					botMessage = await functions.sendCurrentOrder(io, sessionId);
				} else if (number === 0) {
					botMessage = await functions.cancelOrder(io, sessionId);
				} else {
					botMessage = await formatMessage(
						botName,
						"Invalid Input. Enter 1 or 99 or 98 or 97 or 0"
					);
					io.to(sessionId).emit("bot-message", botMessage);
				}
				levels[sessionId] = 1;
				break;
                // case of invalid inputs
                case 2:
                    if (
                        number !== 1 &&
                        number !== 2 &&
                        number !== 3 &&
                        number !== 4 &&
                        number !== 5
                    ) {
                        botMessage = await formatMessage(
                            botName,
                            "Invalid Input. Enter 1 or 2 or 3 or 4 or 5"
                        );
                        io.to(sessionId).emit("bot message", botMessage);
                        levels[sessionId] = 2;
                        return;
                    } else {
                        botMessage = await functions.saveOrder(io, sessionId, number);
                        levels[sessionId] = 1;
                    }
                    break;
        }
    })
})

const PORT = process.env.PORT ?? 3000

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

