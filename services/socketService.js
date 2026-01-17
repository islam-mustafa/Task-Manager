let ioInstance;
const userSockets = new Map();

function initSocketService(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('✅ User connected to socket');
    
    try {
      const token = socket.handshake.auth.token;
      const userId = decodeJWT(token);
      userSockets.set(userId, socket.id);
      console.log(`✅ Socket mapped for user: ${userId}`);
    } catch (err) {
      console.error('❌ Token decode error:', err.message);
    }

    socket.on('disconnect', () => {
      console.log('🔌 User disconnected');
    });
  });
}

function sendNotificationToUser(userId, notification) {
  const socketId = userSockets.get(userId);
  if (socketId && ioInstance) {
    ioInstance.to(socketId).emit('notification', notification);
    console.log(`📢 Notification sent to user: ${userId}`);
  } else {
    console.log(`❌ No active socket for user: ${userId}`);
  }
}

function decodeJWT(token) {
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  return payload.id || payload._id;
}

module.exports = { initSocketService, sendNotificationToUser };
