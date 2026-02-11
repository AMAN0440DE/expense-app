require('dotenv').config();
const mongoose = require('mongoose');
const userDao = require('./src/dao/userDao');

const run = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense-app');
        console.log("Connected.");

        console.log("Attempting to create user...");
        const user = await userDao.create({
            name: "Debug User",
            email: "debug_" + Date.now() + "@example.com",
            password: "hashedpassword123",
            role: "admin"
        });
        console.log("User created successfully:", user);

    } catch (error) {
        console.error("DEBUG ERROR:", error);
    } finally {
        await mongoose.connection.close();
    }
};

run();
