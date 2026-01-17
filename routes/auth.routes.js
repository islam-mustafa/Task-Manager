// const express = require('express');
// const passport = require('passport');
// const jwt = require('jsonwebtoken');

// const router = express.Router();

// // 1️⃣ Redirect المستخدم لجوجل
// router.get('/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // 2️⃣ Callback بعد تسجيل الدخول
// router.get('/google/callback',
//   passport.authenticate('google', { session: false, failureRedirect: '/login' }),
//   (req, res) => {
//     // إنشاء JWT
//     const token = jwt.sign(
//       { userId: req.user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // ممكن ترجع JSON أو تعمل redirect للـ frontend
//     res.json({
//       message: 'Login successful',
//       user: req.user,
//       token
//     });
//   }
// );

// module.exports = router;
