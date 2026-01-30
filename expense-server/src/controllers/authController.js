// const users = require('../dao/userDb');    // called refractoring for maintainig code time to time for better structuring // delete related files like: userDb.js under dao folder
const userDao = require('../dao/userDao');

const bcrypt = require('bcryptjs');  // for hashing password before storing in db for security 
const jwt = require('jsonwebtoken'); // for generating token after login for authentication purpose
// it takes password and adds random string to it and then hashes it so even if 2 users have same password then also hashed value will be different because of random string
// salt rounds - how many times we want to apply hashing algorithm
// more the salt rounds more secure but takes more time to hash
// usually 10-12 salt rounds are used
// installed via npm install bcrypt command in expense-server folder
// compare user provided password with hashed password stored in db via bcrypt.compare method

const authController = {
    login: async (request, response) => {             // async keyword lets know that this will take time, and await tell at which line it will take time(line 14)
        // cut/copy paste the created login api code from server.js here
        const {email, password} = request.body;
        if(!email || !password){
            return response.status(400).json({
                message: 'Email and Password are required'
            });
        }
        // const user = users.find(user => user.email === email && user.password === password);
        const user = await userDao.findByEmail(email);
        if (!user) {
            return response.status(400).json({
                message: 'Invalid Email or Password'
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password); // comparing plain text password with hashed password stored in db

        // if(user && user.password == password){
        if (user && isPasswordMatched) {             // changed after adding bcrypt for hashing password
            const token = jwt.sign({
                email: user.email,
                name: user.name,
                id: user._id
            }, process.env.JWT_SECRET,
                { expiresIn: '1h' }              // token will expire in 1 hour
            );

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/',
            });
            return response.status(200).json({
                message: 'User Authenticated',
                // user: {id: user.id, name: user.name, email: user.email}
                user: user
            });
        } else {
            return response.status(400).json({
                message: 'Invalid Email or Password'
            });
        }

    },
    register: async (request, response) => {
        // cut/copy paste the created register api code from server.js here
        const {name, email, password} = request.body;  
    
        if(!name || !email || !password){
            return response.status(400).json({
                message: 'Name, Email, Password are required'
            });
        }

        const salt = await bcrypt.genSalt(10);   // generating salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt);  // hashing password with generated salt

        // when user is logging in then the plain text password provided by user is compared with hashed password stored in db

        // Implement logic to check existing user

        // const user = users.find(user => user.email === email);
        // if(user){
        //     return response.status(400).json({
        //         message: `User already exists with email: ${email}`
        //     });
        // }

        // Check if user already exists
        const existingUser = await userDao.findByEmail(email);
        if(existingUser){
            return response.status(400).json({
                message: `User already exists with email: ${email}`
            });
        }

        const user = await userDao.create({
            name: name,
            email: email,
            password: hashedPassword
        })
        
            .then(u => { return u;})
            .catch(error => {
                if (error.code === 'USER_EXISTS'){
                    return response.status(400).json({
                        message: `User already exists with email: ${email}`
                    });
                }
            });

            //  Generate JWT token
        const token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 🍪 Set JWT as cookie
        response.cookie('jwtToken', token, {
            httpOnly: true,
            secure: false,   // localhost
            sameSite: 'lax'
        });


        // return response.status(200).json({
        //     message: 'User registered',
        //     user: {id: user._id}
        // });                                         // refracted
        return response.status(201).json({
            message: 'User registered successfully',
            user: user
        });

    

        // const newUser = {
        //     id: users.length + 1,
        //     name: name,
        //     email: email,
        //     password: password
        // };

        // users.push(newUser);

        // return response.status(200).json({
        //     message: 'User Registered',
        //     user: {id: newUser.id}
        // });

        // remaining
        console.log("Registering user")
    },
    isUserLoggedIn: async (request, response) => {
        try {
            const token = request.cookies?.jwtToken;
            if(!token){
                return response.status(401).json({
                    message: 'Unauthorized access'
                });
            }
            jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
                if(error){
                    return response.status(401).json({
                        message: 'Invalid Token'
                    });
                }else {
                    response.json({
                        user: user
                    });
                }
            });
        }catch (error){
            console.log(error);
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    logout: async(request, response) => {
        try {
            response.clearCookie('jwtToken');
            response.json({ message: 'Logout successful'});
        }catch (error) {
            console.log(error);
            return response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
};
// create top level object and export so others can import because its privet so export is done, importing via require keyword
module.exports = authController;

