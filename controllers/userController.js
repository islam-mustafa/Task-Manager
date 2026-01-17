const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const ResetToken = require('../models/resetModel');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

/* =========================================================
   Google OAuth Callback (Passport Redirect Flow)
========================================================= */
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user; // جاي من passport

    if (!user) {
      return res.status(401).json({ message: 'Google authentication failed' });
    }

    const token = generateToken(user._id);
  
    console.log(token)

    // لو Frontend
    return res.redirect(
      `http://localhost:5000/login-success.html?token=${token}`
    );

    // أو API فقط
    // return res.json({ token, user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Google login error' });
  }
};

/* =========================================================
   Register
========================================================= */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   Login
========================================================= */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
    console.log()
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   Get Current User
========================================================= */
exports.getMe = async (req, res) => {
  res.json(req.user);
};

/* =========================================================
   Logout (Blacklist JWT)
========================================================= */
exports.logout = async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Token.create({ token, expiresAt });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error during logout' });
  }
};

/* =========================================================
   Change Password
========================================================= */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (user.provider === 'google') {
      return res.status(400).json({ message: 'Google account cannot change password' });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: 'يرجى إدخال الباسورد القديم والجديد'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'الباسورد القديم غير صحيح' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'تم تغيير الباسورد بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

/* =========================================================
   Forgot Password
========================================================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await ResetToken.findOneAndDelete({ email });
    await ResetToken.create({ email, code, expiresAt });

    await sendEmail(
      email,
      'إعادة تعيين كلمة المرور',
      `رمز التحقق: ${code}`
    );

    res.status(200).json({
      message: 'تم إرسال رمز التحقق إلى البريد الإلكتروني'
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء إرسال الكود' });
  }
};

/* =========================================================
   Reset Password
========================================================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const tokenEntry = await ResetToken.findOne({ email, code });
    if (!tokenEntry) {
      return res.status(400).json({ message: 'رمز التحقق غير صحيح' });
    }

    if (tokenEntry.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'رمز التحقق منتهي' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    user.password = newPassword;
    await user.save();

    await ResetToken.deleteOne({ email });

    res.status(200).json({
      message: 'تم تعيين كلمة مرور جديدة بنجاح'
    });
  } catch (err) {
    res.status(500).json({ message: 'فشل إعادة تعيين كلمة المرور' });
  }
};
