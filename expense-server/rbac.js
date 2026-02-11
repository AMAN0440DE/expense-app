const mongoose = require('mongoose');
const User = require('./src/model/User');
const dotenv = require('dotenv');

dotenv.config();

const migrateUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_URI);
        console.log("Connected to MongoDB");

        const result = await User.updateMany(
            { role: { $exists: false } }, // Find users without a role
            {
                $set: {
                    role: 'admin',      // Default to admin for existing users
                    adminId: null       // Will be set to their own _id by authController on next login if we really wanted to, but let's leave as null or set to themselves to be safe? 
                    // Actually authController does: user.adminId = user.adminId || user._id; so null is fine for now, or we can copy _id. 
                    // Let's just set role for now.
                }
            }
        );

        console.log(`Matched ${result.matchedCount} users.`);
        console.log(`Modified ${result.modifiedCount} users to have role 'admin'.`);

        // Also ensure adminId is set for those who don't have it
        // It's harder to do "set adminId to _id" in a simple updateMany without aggregation pipeline or loop.
        // Let's do a cursor for that.

        const usersWithoutAdminId = await User.find({ adminId: { $exists: false } });
        console.log(`Found ${usersWithoutAdminId.length} users without adminId. Updating...`);

        for (const user of usersWithoutAdminId) {
            user.adminId = user._id;
            await user.save();
        }
        console.log("AdminId updates complete.");

        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrateUsers();
