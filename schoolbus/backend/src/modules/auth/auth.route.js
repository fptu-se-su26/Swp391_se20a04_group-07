const express = require('express');
const router  = express.Router();
const authService = require('./auth.service');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ success: false, message: 'Thiếu email, password hoặc role' });
    res.json({ success: true, message: 'Đăng nhập thành công', data: await authService.loginPassword(email, password, role) });
  } catch (e) { next(e); }
});

router.post('/google', async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ success: false, message: 'Thiếu idToken' });
    res.json({ success: true, message: 'Đăng nhập Google thành công', data: await authService.loginGoogle(idToken) });
  } catch (e) { next(e); }
});

router.post('/refresh-token', async (req, res, next) => {
  try { res.json({ success: true, data: await authService.refreshToken(req.body.refreshToken) }); }
  catch (e) { next(e); }
});

router.post('/logout', async (req, res, next) => {
  try { await authService.logout(req.body.refreshToken); res.json({ success: true, message: 'Đăng xuất thành công' }); }
  catch (e) { next(e); }
});

router.get('/me', verifyToken, async (req, res, next) => {
  try { res.json({ success: true, data: await authService.getMe(req.user.id, req.user.role) }); }
  catch (e) { next(e); }
});

router.post('/forgot-password', async (req, res, next) => {
  try { await authService.forgotPassword(req.body.email, req.body.role); res.json({ success: true, message: 'Nếu email tồn tại, OTP đã được gửi' }); }
  catch (e) { next(e); }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    await authService.resetPassword(req.body.email, req.body.code, req.body.new_password, req.body.role);
    res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
  } catch (e) { next(e); }
});

module.exports = router;
