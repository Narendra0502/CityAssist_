const express = require('express');
const { createZoomMeeting } = require('../Controllers/ZoomController');
const router = express.Router();

router.post('/create-meeting', createZoomMeeting);

module.exports = router;