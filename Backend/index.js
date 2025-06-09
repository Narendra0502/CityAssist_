const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require("crypto");
const zoomRouter = require('./Routes/zoomRouter');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const AuthRouter = require('./Routes/AuthRouter');
const AdminRouter = require('./Routes/adminRouter');
require('dotenv').config();
// 
// require("./models/db");

 
const connectDB = require('./Models/db');
connectDB();


const app = express();
const PORT = process.env.PORT || 6000;

// // Catch errors in the store
// store.on('error', function(error) {
//   console.error('Session store error:', error);
// });

// ✅ Fix CORS & Session Persistence
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'] // ✅ Allow session cookies in frontend
}));



// ✅ Use Express JSON Parser
app.use(express.json());
app.use(bodyParser.json()); 

app.post("/api/jitsi/meeting", (req, res) => {
  try {
      const { roomName } = req.body;
      
      // Generate a unique meeting room if not provided
      const uniqueRoom = roomName || `cityassist-${Date.now()}`;
      
      // Jitsi Meet Public Instance
      const jitsiURL = `https://meet.jit.si/${uniqueRoom}`;

      res.json({ meetingURL: jitsiURL });
  } catch (error) {
      console.error("Error generating Jitsi meeting URL:", error);
      res.status(500).json({ error: "Failed to generate meeting URL" });
  }
});


app.get('/ping', (req, res) => res.send('PONG'));

app.use('/auth', AuthRouter);
app.use('/zoom', zoomRouter);
app.use('/admin', AdminRouter);


app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
