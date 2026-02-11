const axios = require('axios');

const BASE_URL = 'http://localhost:5001'; // Server runs on 5001
const TEST_USER = {
    name: 'Test User',
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    role: 'manager' // Manager can create groups/expenses
};

async function verify() {
    try {
        console.log('1. Registering new user...');
        const regRes = await axios.post(`${BASE_URL}/auth/register`, TEST_USER);
        console.log('   Registered:', regRes.data.email);

        console.log('2. Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        const token = loginRes.data.token; // Assuming token is returned or set in cookie?
        // Wait, app uses cookies. I need to handle cookies.
        const cookie = loginRes.headers['set-cookie'];

        const axiosConfig = {
            headers: { Cookie: cookie },
            withCredentials: true
        };
        console.log('   Logged in.');

        console.log('3. Creating a test group...');
        const groupRes = await axios.post(`${BASE_URL}/groups/create`, {
            name: 'Expense Test Group',
            description: 'Testing expenses',
            membersEmail: [TEST_USER.email, 'other@example.com']
        }, axiosConfig);
        console.log('   Group Res Data:', groupRes.data);
        const groupId = groupRes.data.groupId || groupRes.data._id;
        console.log('   Group created ID:', groupId);

        console.log('4. Verification: Get Group Details...');
        const groupDetails = await axios.get(`${BASE_URL}/groups/${groupId}`, axiosConfig);
        if (groupDetails.data.name === 'Expense Test Group') {
            console.log('   [PASS] Group details fetched.');
        } else {
            console.error('   [FAIL] Group name mismatch:', groupDetails.data.name);
        }

        console.log('5. Adding an expense...');
        const expenseData = {
            title: 'Test Lunch',
            amount: 500,
            groupId: groupId,
            paidBy: TEST_USER.email,
            splitBetween: [TEST_USER.email, 'other@example.com']
        };
        const expenseRes = await axios.post(`${BASE_URL}/expenses`, expenseData, axiosConfig);
        console.log('   Expense created:', expenseRes.data.expense.title);

        console.log('6. Fetching expenses...');
        const listRes = await axios.get(`${BASE_URL}/expenses/group/${groupId}`, axiosConfig);
        const expenses = listRes.data.expenses;

        if (expenses.length > 0 && expenses[0].title === 'Test Lunch') {
            console.log('   [PASS] Expense listed correctly.');
        } else {
            console.error('   [FAIL] Expense not found or mismatch.');
        }

    } catch (error) {
        console.error('Verification failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

verify();
