const formatMessage = require('./messages')
const { orderMenu, foodMenu } = require('./menus')
const { store, sessionMiddleware }= require('../config/sessionConfig')
const formatArray = require('./formatArray')
const botName = 'chatterbot'



exports.saveSessionId = async (sessionId) => {
    const checkSessionId = store.get(sessionId, (err, session) => {
        if (err) {
          console.log('error' + err)
        } else {
          console.log(session)
        }
    });
    // console.log('checkSessionid ' + checkSessionId)

    if(!checkSessionId) {
        store.set(sessionId, (err) => {
            if(err){
                console.log('error' + err)
            }else{
                console.log('session added')
            }
        })      
    }
}

exports.sendLoadMessage = async (io, sessionId) => {

}

exports.sendWelcomeMessage = (io, sessionId ) => {
    io.to(sessionId).emit('bot-message', formatMessage(botName, 'Welcome to chatterbot. You hungry? I am at your service'))
}

exports.sendOrderMenu = (io, sessionId) => {
	let botMessage = formatMessage(botName, formatArray('mainMenu', orderMenu))
    io.to(sessionId).emit('bot-message', botMessage)
    return botMessage
}

exports.sendFoodMenu = (io, sessionId) => {
	let botMessage = formatMessage(botName, formatArray("Select a meal To Add to Your Cart", foodMenu));
	io.to(sessionId).emit("bot-message", botMessage);
	return botMessage;
};

exports.checkOutOrder = async (io, sessionId) => {
    const sessionOrder = await store.clientP
        .then(client => client.db()
        .collection(store.options.collection)
        .findOne({ _id: sessionId })
    );

    if (!sessionOrder) {
        botMessage = formatMessage(botName, 'You have not made any order yet');
        io.to(sessionId).emit('bot-message', botMessage);
        return botMessage;
    }

    if (!sessionOrder.currentOrder || sessionOrder.currentOrder.length < 1) {
        botMessage = formatMessage(botName, 'You have not ordered anything yet');
        io.to(sessionId).emit('bot-message', botMessage)
    } else {
        sessionOrder.placedOrder = [ 
            ...sessionOrder.currentOrder, 
            ...sessionOrder.placedOrder,
        ];
        sessionOrder.currentOrder = [];
        await store.clientP
            .then(client => client.db()
            .collection(store.options.collection)
            .updateOne({ _id: sessionId }, 
                { $set: sessionOrder }, 
                { upsert: true }
            )
        );

        botMessage = formatMessage(botName, 'Order placed');
        io.to(sessionId).emit('bot-message', botMessage);
    }

    io.to(sessionId).emit("bot-message", formatMessage(botName, formatArray('mainMenu',orderMenu)));

    return botMessage;
}

exports.sendOrderHistory =async (io, sessionId) => {
    const sessionOrder = await store.clientP
        .then(client => client.db()
        .collection(store.options.collection)
        .findOne({ _id: sessionId })
    );
    let botMessage = '';
    if (!sessionOrder) {
        botMessage = formatMessage(botName, 'You have not made any order yet');
        io.to(sessionId).emit('bot-message', botMessage);
        return botMessage;
    }

    if (!sessionOrder.placedOrder || sessionOrder.placedOrder.length < 1) {
        botMessage = formatMessage(botName, 'You do not have order history yet');
        io.to(sessionId).emit("bot-message", 'botMessage')
    }else {
		botMessage = formatMessage(botName, formatArray("Your Order History", sessionOrder.placedOrder));
		io.to(sessionId).emit("bot-message", botMessage);
	}
	io.to(sessionId).emit("bot-message", formatMessage(botName, formatArray('mainMenu',orderMenu)));

	return botMessage;
}

exports.sendCurrentOrder = async (io, sessionId) => {
    const sessionOrder = await store.clientP
        .then(client => client.db()
        .collection(store.options.collection)
        .findOne({ _id: sessionId })
    );
    let botMessage = '';

    if (!sessionOrder) {
        botMessage = formatMessage(botName, 'You do not have any order yet');
        io.to(sessionId).emit('bot-message', botMessage);
        return botMessage;
    }

    if (!sessionOrder.currentOrder || sessionOrder.currentOrder.length < 1) {
        botMessage = formatMessage(botName, 'You do not have any order yet');
        io.to(sessionId).emit("bot-message", botMessage)
    }else {
		botMessage = formatMessage(botName, formatArray("Your Current Order", sessionOrder.currentOrder)); 
		io.to(sessionId).emit("bot-message", botMessage);
	}

    io.to(sessionId).emit("bot-message", formatMessage(botName, formatArray('mainMenu',orderMenu)));

    return botMessage;
}

exports.cancelOrder = async (io, sessionId) => {
    const sessionOrder = await store.clientP
        .then(client => client.db()
        .collection(store.options.collection)
        .findOne({ _id: sessionId })
    );
    let botMessage = ''

    if (!sessionOrder) {
        botMessage = formatMessage(botName, 'You do not have any order yet');
        io.to(sessionId).emit('bot-message', botMessage);
        return botMessage;
    }

    if (!sessionOrder.currentOrder || sessionOrder.currentOrder.length < 1) {
        botMessage = formatMessage(botName, 'You do not have any order yet');
        io.to(sessionId).emit("bot-message", botMessage)
    }else {
		botMessage = formatMessage(botName, formatArray("Order Cancelled"));
        
        sessionOrder.currentOrder = [];
        await store.clientP
            .then(client => client.db()
            .collection(store.options.collection)
            .updateOne({ _id: sessionId }, 
                { $set: sessionOrder }, 
                { upsert: true }
            )
        );

        io.to(sessionId).emit('bot-message', botMessage);
	}
    io.to(sessionId).emit("bot-message", formatMessage(botName, formatArray('mainMenu',orderMenu)));

    return botMessage;
}

exports.saveOrder = async (io, sessionId, number) => {
    const sessionOrder = await store.clientP
        .then(client => client.db()
        .collection(store.options.collection)
        .findOne({ _id: sessionId })
    )|| { currentOrder: [] }; ;
    let botMessage = ''

    if (sessionOrder && sessionOrder.currentOrder) {
        // sessionOrder.currentOrder.push(foodMenu[0]);
        if (number === 1) {
            sessionOrder.currentOrder.push(foodMenu[0]);
        }else if (!sessionOrder) {
            sessionOrder = { currentOrder: [] };
            sessionOrder.currentOrder.push(foodMenu[0]);
        } else if (!sessionOrder.currentOrder) {
            sessionOrder.currentOrder = [];
            sessionOrder.currentOrder.push(foodMenu[0]);
        }
        if (number === 2) {
            sessionOrder.currentOrder.push(foodMenu[1]);
        }else if (!sessionOrder) {
            sessionOrder = { currentOrder: [] };
            sessionOrder.currentOrder.push(foodMenu[1]);
        } else if (!sessionOrder.currentOrder) {
            sessionOrder.currentOrder = [];
            sessionOrder.currentOrder.push(foodMenu[1]);
        }
        if (number === 3) {
            sessionOrder.currentOrder.push(foodMenu[2]);
        }else if (!sessionOrder) {
            sessionOrder = { currentOrder: [] };
            sessionOrder.currentOrder.push(foodMenu[2]);
        } else if (!sessionOrder.currentOrder) {
            sessionOrder.currentOrder = [];
            sessionOrder.currentOrder.push(foodMenu[2]);
        }
        if (number === 4) {
            sessionOrder.currentOrder.push(foodMenu[3]);
        }else if (!sessionOrder) {
            sessionOrder = { currentOrder: [] };
            sessionOrder.currentOrder.push(foodMenu[3]);
        } else if (!sessionOrder.currentOrder) {
            sessionOrder.currentOrder = [3];
            sessionOrder.currentOrder.push(foodMenu[0]);
        }
        await store.clientP
            .then(client => client.db()
            .collection(store.options.collection)
            .updateOne({ _id: sessionId }, 
                { $set: sessionOrder }, 
                { upsert: true }
            )
        );
    
        botMessage = formatMessage(
            botName, formatArray("Order Added", sessionOrder.currentOrder)
        );
    
        io.to(sessionId).emit("bot-message", botMessage);
    }
    
    io.to(sessionId).emit("bot-message", formatMessage(botName, formatArray(botMessage, orderMenu)))
	return botMessage;

}