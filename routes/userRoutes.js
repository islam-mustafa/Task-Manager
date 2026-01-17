const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const passport = require('passport');


// ---------------------- Google OAuth ----------------------
// 1️⃣ بدء تسجيل الدخول بجوجل
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// 2️⃣ callback من جوجل
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login.html',
  }),
  userController.googleCallback
);

// ---------------------- تسجيل عادي ----------------------
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// ---------------------- بيانات المستخدم الحالية ----------------------
router.get('/me', auth, userController.getMe);

// ---------------------- تغيير كلمة المرور ----------------------
router.put('/change-password', auth, userController.changePassword);

// ---------------------- تسجيل الخروج ----------------------
router.post('/logout', auth, userController.logout);

// ---------------------- نسيان وإعادة تعيين كلمة المرور ----------------------
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
