const axios = require('axios');

const createZoomMeeting = async (req, res) => {
    try {
        // Verify scopes are configured
        console.log('Starting Zoom meeting creation...');

        // Get OAuth token with specific scope request
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://zoom.us/oauth/token',
            params: {
                grant_type: 'account_credentials',
                account_id: process.env.ZOOM_ACCOUNT_ID
            },
            headers: {
                'Authorization': `Basic ${Buffer.from(
                    `${process.env.ZOOM_clientID}:${process.env.ZOOM_API_SECRET}`
                ).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Token received, creating meeting...');

        // Create meeting with obtained token
        const meetingResponse = await axios({
            method: 'post',
            url: 'https://api.zoom.us/v2/users/me/meetings',
            headers: {
                'Authorization': `Bearer ${tokenResponse.data.access_token}`,
                'Content-Type': 'application/json'
            },
            data: {
                topic: req.body.topic || 'CityAssist Meeting',
                type: 1, // Instant meeting
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: true
                }
            }
        });

        console.log('Meeting created successfully');
        res.json({
            success: true,
            meeting: meetingResponse.data
        });

    } catch (error) {
        console.error('Zoom API Error:', {
            message: error.message,
            data: error.response?.data,
            status: error.response?.status
        });

        res.status(500).json({
            success: false,
            error: 'Failed to create meeting',
            details: error.response?.data?.message || error.message
        });
    }
};

module.exports = { createZoomMeeting };