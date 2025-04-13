require('dotenv').config();
const EmailService = require('../services/Emailservices');

async function testEmailService() {
    console.log('🚀 Testing email notification system...\n');

    const testData = {
        adminEmail: 'admin@cityassist.com',
        issueDetails: {
            email: 'test@example.com',
            name: 'Test User',
            title: 'Road Maintenance Required',
            status: 'Accepted',
            department: 'Public Works',
            city: 'Test City',
            reason: 'Work scheduled',
            remark: 'Will begin next week'
        }
    };

    try {
        console.log('📧 Sending test email with following details:');
        console.log('Admin:', testData.adminEmail);
        console.log('User:', testData.issueDetails.email);
        
        const result = await EmailService.sendStatusUpdateEmail(
            testData.adminEmail, 
            testData.issueDetails
        );
        
        if (result.success) {
            console.log('\n✅ Email sent successfully!');
            console.log('Preview URL:', result.previewUrl);
        } else {
            console.log('\n❌ Email sending failed');
            console.error('Error:', result.error);
        }
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Error details:', error);
    }
}

// Run the test
testEmailService();