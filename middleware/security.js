module.exports = (req, res, next) => {
  const origin = req.headers.origin;
  const allowed = ['http://localhost:5000'];

  if (origin && !allowed.includes(origin)) {
    return res.status(403).json({ message: 'Forbidden origin' });
  }

  next();
};
