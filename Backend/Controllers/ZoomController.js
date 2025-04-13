const axios = require('axios');
require('dotenv').config();

const createZoomMeeting = async (req, res) => {
    try {
        // Verify environment variables
        if (!process.env.ZOOM_ACCOUNT_ID || !process.env.ZOOM_clientID || !process.env.ZOOM_API_SECRET) {
            throw new Error('Missing required Zoom credentials in environment variables');
        }

        console.log('Starting Zoom meeting creation...', {
            accountId: process.env.ZOOM_ACCOUNT_ID,
            hasClientId: !!process.env.ZOOM_clientID,
            hasSecret: !!process.env.ZOOM_API_SECRET
        });

        // Get OAuth token
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

        if (!tokenResponse.data.access_token) {
            throw new Error('Failed to obtain access token from Zoom');
        }

        console.log('Token received successfully, creating meeting...');

        // Create meeting
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
                    join_before_host: true,
                    jbh_time: 0, // Allow join before host immediately
                    mute_upon_entry: false,
                    auto_recording: "none"
                }
            }
        });

        console.log('Meeting created successfully:', {
            meetingId: meetingResponse.data.id,
            joinUrl: meetingResponse.data.join_url
        });

        res.json({
            success: true,
            meeting: {
                id: meetingResponse.data.id,
                topic: meetingResponse.data.topic,
                join_url: meetingResponse.data.join_url,
                start_url: meetingResponse.data.start_url,
                password: meetingResponse.data.password
            }
        });

    } catch (error) {
        console.error('Zoom API Error:', {
            message: error.message,
            data: error.response?.data,
            status: error.response?.status,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                params: error.config?.params
            }
        });

        res.status(error.response?.status || 500).json({
            success: false,
            error: 'Failed to create Zoom meeting',
            details: error.response?.data?.message || error.message
        });
    }
};

module.exports = { createZoomMeeting };