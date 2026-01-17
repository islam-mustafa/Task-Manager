const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const onlineUsers = new Map();

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('registerUser', (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        onlineUsers.set(userId, socket.id);
        console.log(`Registered user ${userId} with socket ${socket.id}`);
      } catch (err) {
        console.error('❌ Invalid token for socket:', err.message);
      }
    });

    socket.on('disconnect', () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User disconnected: ${userId}`);
          break;
        }
      }
    });
  });

  return { io, onlineUsers };
}

module.exports = { initSocket, onlineUsers };
