const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      message: 'Não autorizado.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Não autorizado.'
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      message: 'Não autorizado.'
    });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Acesso negado.'
      });
    }

    next();
  };
}

module.exports = {
  protect,
  authorize
};