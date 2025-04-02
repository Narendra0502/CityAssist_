require('dotenv').config();
const EmailService = require('../services/Emailservices'); 

async function testEmailService() {
    console.log('🚀 Testing email notification system...\n');

    const adminEmail = 'narendrakaushik2525@gmail.com'; // Replace with actual admin email
    const testIssue = {
        email: 'nkaushik0502@gmail.com', // Replace with user's email to receive the notification
        name: 'Test User',
        title: 'Road Maintenance Required',
        status: 'Accepted',
        department: 'Public Works',
        city: 'Test City',
        reason: 'Work scheduled',
        remark: 'Will begin next week'
    };

    try {
        console.log('Admin Email:', adminEmail);
        console.log('User Email:', testIssue.email);
        console.log('\nSending test email...');
        
        const result = await EmailService.sendStatusUpdateEmail(adminEmail, testIssue);
        
        if (result) {
            console.log('✅ Email sent successfully!');
            console.log(`From: ${adminEmail}`);
            console.log(`To: ${testIssue.email}`);
        } else {
            console.log('❌ Email sending failed');
        }
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Error details:', error);
    }
}

testEmailService();