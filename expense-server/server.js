console.log("Hi, I'm your server!");

/**
 * PS C:\Users\kumar_1sb3con\Desktop\Expense-app\expense-server> npm run start

> expense-server@1.0.0 start
> node server.js

Hi, I'm your server!
PS C:\Users\kumar_1sb3con\Desktop\Expense-app\expense-server> node server.js
Hi, I'm your server!

will giuve the same output
as we added the start command (custom command) in package.json file
either we can run npm run start or node server.js to run the server
 */

// now import express

// configure environment variables from .env file
require('dotenv').config();

const express = require('express');

const cookieParser = require('cookie-parser');

const cors = require('cors');

const mongoose = require('mongoose');

// connect to mongodb database

const authRoutes = require('./src/routes/authRoutes');  // refracted
const groupRoutes = require('./src/routes/groupRoutes');  // new for Splitt App


// mongoose.connect("mongodb://localhost:27017/expense-app")            // its sensitive and must not put on github untill privete so later use env variable
// // store in .env and .env must be added in .gitignore file

// we cant use above credentials directly so we use process.env to access environment variables stored the same in .env file and .env is gitignored
    mongoose.connect(process.env.MONGO_DB_CONNECTION_URL)

    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

const corsOption = {
    origin: process.env.CLIENT_URL,
    credentials: true
};

const app = express();   // object of express

app.use(cors(corsOption));

app.use(express.json());    // middleware to parse json data in request body// middleware function
// the request coming to server via client is in json format and this middleware will parse that json data to js object automatically

app.use(cookieParser());    // middleware to parse cookies from request
app.use('/auth', authRoutes);  // refracted
app.use('/groups', groupRoutes);  // new for Splitt App


//let users = [];  // to store user data

// app.post('/register', (request, response) => {       // whenever request comes to /register then run this callback function
//     const {name, email, password} = request.body;  // everything that will be sent to client will be a part of request body
    
//     if(!name || !email || !password){
//         return response.status(400).json({
//             message: 'Name, Email, Password are required'
//         });
//     }

//     // Implement logic to check existing user

//     const user = users.find(user => user.email === email);
//     if(user){
//         return response.status(400).json({
//             message: 'User already exists with email: $email'
//         });
//     }
 

//     const newUser = {
//         id: users.length + 1,
//         name: name,
//         email: email,
//         password: password
//     };

//     users.push(newUser);

//     return response.status(200).json({
//         message: 'User Registered',
//         user: {id: newUser.id}
//     });
// });


// /**
//  * create a POST API with path /login which takes email and password from request body and
//  * checks if user with same email exists and password exist in the users array
//  * if yes return 200 response, otherwise return 400 response with appropriate message 
//  */

// app.post('/login', (request, response) => {
//     const {email, password} = request.body;
//     if(!email || !password){
//         return response.status(400).json({
//             message: 'Email and Password are required'
//         });
//     }
//     const user = users.find(user => user.email === email && user.password === password);
//     if(user){
//         return response.status(200).json({
//             message: 'Login Successful',
//             user: {id: $users.id, name: $users.name, email: $users.email}
//         });
//     } else {
//         return response.status(400).json({
//             message: 'Invalid Email or Password'
//         });
//     }
// })

// cleaned up server.js by moving register and login api code to controller and route files
// also move let users = []; to dao folder to userDb.js file

app.listen(5001, () => {
    console.log('Server is running on port 5001');    // whenever request is sent http://ip-address: port
    // theres lots of port and generally express server run on port 5000 or 5001
})

// any project beyond 200 lines is not good practice to keep in single file lots of scrolling and diificult to edit the file
// so way to code structuring -  MVC (very old) 
// 1. single responsibility principle - every file should have single responsibility
// create src folder -> keeps parent directory clean, any source code there should go in src folder
// create controller folder under src-> to be the entry point in the business logic , responsible for data validation before going further, and calls different layers
// create route folder under src
// create dao folder under src -> data access object -> responsible to interact with database



// will check with postman via http://localhost:5001/auth/register and not http://localhost:5001/register beacuse we added /auth in app.use('/auth', authRoutes);


// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// back in days when one needs to check if user is admin or not
// we used session managed (key - value pair)before microservises
// these were kown as stateful session management beacuse it used to store session data on server side and somehow when changed then it looses track of user's credentials
// but now we use JWT (json web token) -> stateless authentication
// JWT is a library provides a way to generate the token by taking three things (Random String), Data to be encrypted(user-> email, name), expiry time(1 hour)<if money transaction then as low as 5 min>
// whever have this secret and token can acheve data - so never push token and secret to github/ .env to gpts/github
// if want to share API key then share the secret key and token will be generated on fly, this way if one gets the secret key he can get the data

// install jsonwebtoken package -> npm i jsonwebtoken in expense-server folder

// first it validate that whether the user passed the credentials are valid or not from database
// 


/**
 * Client(Postman)                            Server (Express)                      Database (MongoDB)         JWT
 * |                                            |                                     |
 * --1. Register / Login Request -------------> |-----email(Dao) -------------------->|                                         
 *                                              |--2. User Object --------------------|
 *                                              |----------------- 3. Sign secret data ------------------------->|          
 *                                              |<------------------Token-------------|--------------------------|
 * <-------- 5. Send Token 1(cookie)----------- |
 * -----------Middleware----------------------->|
 *                                              |-----------------------Token + Secret-------------------------->|
 *                                              |<-----------------------User Data-------------------------------|
 *                                              |
 *                                              | loop group controller
 
 * 
 * 
 * 
 * 
 * 
 * 
 */

/**
 * OAuth 2.0 (Autorization AuthZ)
 *    +
 * OIDC (Open ID Connect)(Authentication AuthN)
 * 
 * 
 * SSO
 */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Browser/User                            Client                               Google Auth Server                          Our Server
 *     |                                      |                                          |                                       |
 *     |--------Continue with google--------->|                                          |                                       |
 *     |                                      |--------------Client ID------------------>|                                       |
 *     |<-----------------------------------Login Page-----------------------------------|                                       |
 *     |-------------------------------------Login-------------------------------------->|                                       |
 *     |<------------------------------Consent Page--------------------------------------|                                       |
 *     |-------------------------------Consent Success---------------------------------->|                                       |
 *     |                                      |<----------------Token--------------------|                                       |
 *     |                                      |-------------------------------------Token--------------------------------------->|
 *                                                                                       |<-------------Verify token-------------|
 *                                                                                       |--------------Identify Data----------->|
 * 
 */