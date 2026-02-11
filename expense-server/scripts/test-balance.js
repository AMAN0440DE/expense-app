require('dotenv').config();
const mongoose = require('mongoose');
const rbacDao = require('../src/dao/rbacDao');
const User = require('../src/model/User');
const Expense = require('../src/model/Expense');
const Group = require('../src/model/group'); // Case sensitive? 'group.js' is lower case in list_dir

async function test() {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_URL);
    console.log('Connected.');

    const adminEmail = 'testadmin@example.com';
    const user1Email = 'alice@example.com';
    const user2Email = 'bob@example.com';

    try {
        // Cleanup
        await User.deleteMany({ email: { $in: [adminEmail, user1Email, user2Email] } });
        await Expense.deleteMany({ title: 'Test Expense Balance' });
        await Group.deleteMany({ name: 'Test Group Balance' });

        // Create Admin
        const admin = await rbacDao.create(adminEmail, 'Admin User', 'admin', 'password', new mongoose.Types.ObjectId());

        // Create Users (linked to admin)
        const alice = await rbacDao.create(user1Email, 'Alice', 'viewer', 'password', admin._id);
        const bob = await rbacDao.create(user2Email, 'Bob', 'viewer', 'password', admin._id);

        console.log('Users created.');

        // Create Group
        const group = await Group.create({
            name: 'Test Group Balance',
            adminEmail: adminEmail,
            membersEmail: [user1Email, user2Email]
        });

        // 1. Expense: Alice pays 100, split 50/50
        await Expense.create({
            groupId: group._id,
            title: 'Test Expense Balance',
            amount: 100,
            paidByEmail: user1Email,
            splits: [
                { email: user1Email, amount: 50 },
                { email: user2Email, amount: 50 }
            ]
        });

        console.log('Expense created: Alice pays 100, split 50/50');

        let result = await rbacDao.getUsersByAdminId(admin._id);
        let aliceData = result.users.find(u => u.email === user1Email);
        let bobData = result.users.find(u => u.email === user2Email);

        console.log(`Alice Balance (Expected +50): ${aliceData.balance}`);
        console.log(`Bob Balance (Expected -50): ${bobData.balance}`);

        // 2. Settlement: Bob pays Alice 50
        // In settlement, payer is Bob, split target is Alice? 
        // Or typical logic: Expense is "Settlement", paidBy: Bob, splits: [{email: Alice, amount: 50}]
        // Logic: Bob pays 50. Alice receives 50.
        // My logic in rbacDao: 
        // Bob: Credit +50.
        // Alice: Debit -50.
        // Prev Bob: -50. New Net: 0.
        // Prev Alice: +50. New Net: 0.

        await Expense.create({
            groupId: group._id,
            title: 'Test Expense Balance Settlement',
            amount: 50,
            paidByEmail: user2Email,
            type: 'SETTLEMENT',
            splits: [
                { email: user1Email, amount: 50 }
            ]
        });

        console.log('Settlement created: Bob pays Alice 50');

        result = await rbacDao.getUsersByAdminId(admin._id);
        aliceData = result.users.find(u => u.email === user1Email);
        bobData = result.users.find(u => u.email === user2Email);

        console.log(`Alice Balance (Expected 0): ${aliceData.balance}`);
        console.log(`Bob Balance (Expected 0): ${bobData.balance}`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

test();
