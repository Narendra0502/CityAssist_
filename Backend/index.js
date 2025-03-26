const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const crypto = require("crypto");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const AuthRouter = require('./Routes/AuthRouter');
const AdminRouter = require('./Routes/adminRouter');
require('dotenv').config();
require("./models/db");

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

// app.post("/generateSignature", (req, res) => {
//   try {
//       const { meetingNumber, role } = req.body;
//       const timestamp = new Date().getTime() - 30000;
//       const msg = Buffer.from(`${process.env.ZOOM_API_KEY}${meetingNumber}${timestamp}${role}`).toString("base64");
//       const hash = crypto.createHmac("sha256", process.env.ZOOM_API_SECRET).update(msg).digest("base64");
//       const signature = Buffer.from(`${process.env.ZOOM_API_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString("base64");

//       res.json({ signature });
//   } catch (error) {
//       console.error("Error generating Zoom signature:", error);
//       res.status(500).json({ error: "Failed to generate signature" });
//   }
// });
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// ✅ Use Express JSON Parser
app.use(express.json());
app.use(bodyParser.json()); // Not necessary but kept for compatibility



app.get('/ping', (req, res) => res.send('PONG'));

app.use('/auth', AuthRouter);
app.use('/admin', AdminRouter);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
