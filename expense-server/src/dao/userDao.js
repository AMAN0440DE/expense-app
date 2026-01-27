const User = require('../model/User');

const userDao = {
    findByEmail: async (email) => {           // async - keyword 
        const user = await User.findOne({ email});  // findOne - unique(when first match then return) , findMore(if found then find more ), Await- if got response then fulfill
        return user;
    },

    create: async (userData) => {
        const newUser = new User(userData);
        try {
            return await newUser.save();   // save - mongoose method to save data to mongodb
        }
        catch (error){
            if(error.code === 11000){   // duplicate key error code
                const err = new Error()
                err.code = 'USER_EXISTS';
                throw err;
                // throw new Error({
                //     code: 'USER_EXISTS'

                // });   
            }
            else{
                console.error(error);
                const err = new Error('Something went wrong while communicating with database');
                err.code = 'INTERNAL_SERVER_ERROR';
                throw err;
                //
                // throw new Error({
                //     code: INTERNAL_SERVER_ERROR,
                //     message: 'Something went wrong while communicating with database'
                // });
            }
            // console.error(error);
        }
    }
};

module.exports = userDao;

// nodeJS is single thraed and needs to make sure it doesnt gets blocked via worker pool 
// it receives the request coming to server and evaluates if it can be fulfilled now , JS goes to backend MongoDB and doesnt know if for how long it will run, 
// so worker is initialized (event driven) , nodejs is not that smart so we need to write code when that will take time so we use async keyword
// we tell nodejs that this may take time by using async and to not block yourself



// we can handle error from authController also but better to handle here itself because if we have to shift in future to dynamic db then only this file need to be changed
// and also we can have multiple places where we are creating user so better to handle here itself
