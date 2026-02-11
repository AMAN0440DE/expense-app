console.log("Hello World");
try {
    const mongoose = require('mongoose');
    console.log("Mongoose loaded");
    const crypto = require('crypto');
    console.log("Crypto loaded");
    const jwt = require('jsonwebtoken');
    console.log("JWT loaded");
    require('dotenv').config();
    console.log("Dotenv loaded");

    const User = require('../src/model/User');
    console.log("User loaded");
    const Group = require('../src/model/group');
    console.log("Group loaded");
    const Expense = require('../src/model/Expense');
    console.log("Expense loaded");

    // Configuration
    const API_URL = 'http://localhost:3000/api/payment/verify-order';
    const ADMIN_EMAIL = 'test_admin_settle@example.com';
    const USER_EMAIL = 'test_user_settle@example.com';
    const GROUP_NAME = 'Settlement Test Group';

    async function testSettlement() {
        try {
            console.log("DEBUG: Setting up Test Data...");

            // 1. Create Admin
            let admin = await User.findOne({ email: ADMIN_EMAIL });
            if (!admin) {
                admin = await User.create({
                    name: 'Test Admin',
                    email: ADMIN_EMAIL,
                    password: 'password',
                    role: 'admin'
                });
                console.log("DEBUG: Created Admin:", admin._id);
            } else {
                console.log("DEBUG: Found Admin:", admin._id);
            }

            // 2. Create User (Managed by Admin)
            let user = await User.findOne({ email: USER_EMAIL });
            if (!user) {
                user = await User.create({
                    name: 'Test User',
                    email: USER_EMAIL,
                    password: 'password',
                    role: 'viewer',
                    adminId: admin._id,
                    credits: 10
                });
                console.log("DEBUG: Created User:", user._id);
            } else {
                console.log("DEBUG: Found User:", user._id);
                if (!user.adminId) {
                    user.adminId = admin._id;
                    await user.save();
                    console.log("DEBUG: Fixed User adminId");
                }
            }

            // 3. Create Group (Mutual)
            let group = await Group.findOne({ adminEmail: ADMIN_EMAIL, name: GROUP_NAME });
            if (!group) {
                group = await Group.create({
                    name: GROUP_NAME,
                    adminEmail: ADMIN_EMAIL,
                    membersEmail: [USER_EMAIL, ADMIN_EMAIL]
                });
                console.log("DEBUG: Created Group:", group._id);
            } else {
                console.log("DEBUG: Found Group:", group._id);
            }

            // 4. Generate Token
            const tokenVal = jwt.sign({
                name: user.name,
                email: user.email,
                id: user._id,
                role: user.role
            }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log("DEBUG: Generated Token");

            // 5. Generate Signature
            const ORDER_ID = 'order_' + Date.now();
            const PAYMENT_ID = 'pay_' + Date.now();
            const AMOUNT = 500;

            const body = ORDER_ID + '|' + PAYMENT_ID;
            const signature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            // 6. Call API
            console.log("DEBUG: Calling Verify API...");
            const payload = {
                razorpay_order_id: ORDER_ID,
                razorpay_payment_id: PAYMENT_ID,
                razorpay_signature: signature,
                isSettlement: true,
                amount: AMOUNT,
                credits: 0
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `jwtToken=${tokenVal}`
                },
                body: JSON.stringify(payload)
            });

            console.log("DEBUG: Response Status:", response.status);
            const data = await response.json();
            console.log("DEBUG: Response Data:", data);

            if (response.ok && data.message === 'Settlement successful') {
                console.log("✅ TEST PASSED: Settlement recorded.");

                const expense = await Expense.findOne({
                    groupId: group._id,
                    type: 'SETTLEMENT',
                    amount: AMOUNT,
                    paidByEmail: user.email
                });
                if (expense) {
                    console.log("✅ Expense Verified in DB:", expense._id);
                } else {
                    console.error("❌ Expense NOT found in DB!");
                }
            } else {
                console.error("❌ TEST FAILED: Unexpected response.");
            }

        } catch (error) {
            console.error("TEST ERROR:", error);
        }
    }

    console.log("DEBUG: Connecting to DB...");
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("DEBUG: DB Connected. Running Test...");
            testSettlement().then(() => {
                console.log("DEBUG: Test Finished. Disconnecting...");
                mongoose.disconnect();
            });
        })
        .catch(err => console.error("DB Connect Error", err));

} catch (e) {
    console.error("FAIL:", e);
}
