require('dotenv').config();
const mongoose = require('mongoose');
const userDao = require('./src/dao/userDao');
const rbacDao = require('./src/dao/rbacDao');

const run = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense-app');
        console.log("Connected.");

        // 1. Create a dummy user to update
        console.log("Creating dummy user...");
        const user = await userDao.create({
            name: "Original Name",
            email: "update_test_" + Date.now() + "@example.com",
            password: "password",
            role: "viewer"
        });
        console.log("User created:", user._id);

        // 2. Update the user
        console.log("Updating user...");
        const updatedUser = await rbacDao.update(
            user._id,
            "Updated Name",
            "manager"
        );
        console.log("User updated:", updatedUser);

        if (updatedUser.name === "Updated Name" && updatedUser.role === "manager") {
            console.log("SUCCESS: User update worked.");
        } else {
            console.log("FAILURE: User update did not reflect changes.");
        }

        // Cleanup
        await rbacDao.delete(user._id);
        console.log("User deleted.");

    } catch (error) {
        console.error("DEBUG ERROR:", error);
    } finally {
        await mongoose.connection.close();
    }
};

run();
