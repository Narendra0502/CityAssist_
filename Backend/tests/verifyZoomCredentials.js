require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function verifyZoomCredentials() {
    console.log('🔍 Starting Zoom Credentials Verification...\n');

    try {
        // Step 1: Check if credentials exist
        console.log('1. Checking Credentials:');
        const clientId = process.env.ZOOM_clientID;
        const apiSecret = process.env.ZOOM_API_SECRET;

        console.log('Client ID:', clientId ? '✅ Found' : '❌ Missing');
        console.log('API Secret:', apiSecret ? '✅ Found' : '❌ Missing');

        // Step 2: Generate JWT token with specific payload structure
        console.log('\n2. Generating JWT Token:');
        const payload = {
            iss: clientId,
            exp: ((new Date()).getTime() + 5000),
            iat: (new Date()).getTime()
        };

        const token = jwt.sign(payload, apiSecret);
        console.log('Token:', token.substring(0, 20) + '...');

        // Step 3: Test API connection with modified headers
        console.log('\n3. Testing API Connection:');
        const response = await axios({
            method: 'get',
            url: 'https://api.zoom.us/v2/users/me',
            headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Zoom-API-JWT-Request',
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ API Connection Successful!\n');
        console.log('Account Details:');
        console.log('----------------');
        console.log(`Email: ${response.data.email}`);
        console.log(`Account Name: ${response.data.account_name}`);

    } catch (error) {
        console.error('\n❌ Verification Failed:');
        console.error('Error Details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
    }
}

verifyZoomCredentials();