# chatterbot
a restaurant chatbot that will assist customers in placing orders for their preferred meals for a restaurant

### Live Site

---

-   [ChatterBot](https://chatterbot-j54v.onrender.com/)


### Technologies Used

---

-   Node.js & Express.js => used as the primary backend technologies for building the server and  logic.
-   MongoDB => used as the primary database for storing sessions.
-   Socket.io => used for enabling real-time communication between the server and clients
-   Express-Session => used for managing user sessions 
-   Moment.js  => used to format and display dates in a more user-friendly format.
-   connect-mongo =>  used as a session store for persisting user sessions in the database, ensuring that user sessions are maintained even if the server restarts.

### Features

---
#### The following are the features of the restaurant chatbot:
-   Place an Order: Users can place an order food by entering the corresponding number of the item they want from the menu.
-   Cancel order: Users can cancel their order by entering 0 and it cancels their current order cart
-   Check order history: Users can check their current or old order history by entering the corresponding number.
-   Save session and chat history: The chatbot saves the user's session and chat history, so they can resume their order or check their history at any time.



### Getting Started Locally
---
1. Clone the repository:
    - `https://github.com/KorkuTegbe/chatterbot.git`
2. Install all necessary dependencies:
    - `npm install`
3. Create a .env file in the root directory using the sample.env file as a guide 

4. Start the application:
    - `npm run dev`
5. Open the application in your browser:
    - `http://localhost:3400`

### Usage
---

To use this chatbot :

-   Visit the chatbot site [ChatterBot](https://chatterbot-j54v.onrender.com/) on your device


-   The chatbot sends a welcome message.After responding, it will return the available options from which you are to choose from.
-   You will choose from:
    -  "1" to order food

    -  "99" to checkout your order 

    -  "98" to see old orders

    -  "97" to see your current order

    -  "0" to cancel your order
   
-  If you enter "1" to order food, the chatbot will present you with a menu of items with corresponding numbers. You can enter the number of the item you want to order.
-  If you enter "99" to checkout your order, the chatbot will let you know that your order has been placed and will show the main menu.
-  If you enter "98" to see old orders, the chatbot will show you your old orders.
-  If you enter "97" to see your current order, the chatbot will show you your current order.
-  If you enter "0" to cancel your order, the chatbot will let you know that your order has been cancelled and will show the main menu.
- report bugs or issues faced here: [issues]("https://github.com/KorkuTegbe/chatterbot/issues")

## Thanks!!!
