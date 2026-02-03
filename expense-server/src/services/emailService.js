const nodemailer = require('nodemailer');

const emailClient = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    }
});

const emailService = {
    send: async (to, subject, body) => {
        const emailOption = {
            from: process.env.GOOGLE_EMAIL,
            to: to,
            subject: subject,
            text: body
        };

        await emailClient.sendMail(emailOption);
    },
};

module.exports = emailService;

/**
 * 
 * RESET PASSWORD FLOW
 * ======================
 * 
 * 
 * user                              Login.jsx(expense-react-client)                              expense-server(authcontroller.js)
 *   |-----------reset password link---------->|----------------/auth/reset-password---------------------->|
 *                                                              1. generate random 6 digit otp
 *                                                              2. Store the otp in user collection
 *                                                              3. Send email with the otp to the user
 * 
 * 
 * 
 * CHANGE PASSWORD FLOW
 * ======================
 *  
 * 
 * user                               ResetPassword.jsx(expense-raect-client)                     expense-server(authcontroller.js)
 *   |-----------Navigated After---------------------->|-------------------/auth/change-password-------------->|
 *         /auth/reset-password success call           |                 will take otp, email, newPassword       on backend :
 *                                                     |                                                       |  1. verify the otp is validated by getting it from the database
 *                                                     |                                                       |  2. Delete the otp from database
 *                                                     |                                                       |  3. Update the password for the user
 * <------------------------------------------Navigate to Login page post password change----------------------|    
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */