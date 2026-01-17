const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth'); // تأكد إنه موجود

router.get('/', authMiddleware, notificationController.getNotifications);
router.patch('/:id/read', authMiddleware, notificationController.markAsRead);
// testing endpoint (optional) - send a notification to a user
router.post('/send-test', notificationController.sendTestNotification);


module.exports = router;
