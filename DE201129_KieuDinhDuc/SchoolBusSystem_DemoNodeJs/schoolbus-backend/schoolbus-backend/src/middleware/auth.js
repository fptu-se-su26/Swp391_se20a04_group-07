const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Chỉ admin mới có quyền này' });
  }
  next();
}

function parentOnly(req, res, next) {
  if (req.user?.role !== 'parent') {
    return res.status(403).json({ error: 'Chỉ phụ huynh mới có quyền này' });
  }
  next();
}

module.exports = { authMiddleware, adminOnly, parentOnly };
