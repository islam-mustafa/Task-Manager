const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // ✅ تخطي التحقق من الشهادة
      }
    });

    await transporter.sendMail({
      from: `"Task Manager App" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      text
    });

    console.log('✅ Email sent successfully to:', to);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('حدث خطأ أثناء إرسال الكود');
  }
};

module.exports = sendEmail;
