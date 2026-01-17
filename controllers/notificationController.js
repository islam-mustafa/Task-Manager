const Notification = require('../models/notificationModel');
const { sendNotificationToUser } = require('../services/socketService');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'تم تأشير الإشعار كمقروء' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// For testing: send a notification to a userId (body: { userId, message, type })
exports.sendTestNotification = async (req, res) => {
  try {
    const { userId, message, type = 'new_task' } = req.body;
    if (!userId || !message) return res.status(400).json({ message: 'userId and message are required' });

    // Optionally persist notification
    const note = await Notification.create({ user: userId, message, type });

    // Send via socket service
    sendNotificationToUser(userId, note);

    res.json({ message: 'Notification sent', note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
