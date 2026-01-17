const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

require('./config/passport');

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { initSocket } = require('./socket');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => res.send('Server is running'));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket
const { io } = initSocket(server);
// Initialize socket service helper
const { initSocketService } = require('./services/socketService');
initSocketService(io);

server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
});
