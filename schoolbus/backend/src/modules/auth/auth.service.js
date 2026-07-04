const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Op }   = require('sequelize');
const { OAuth2Client } = require('google-auth-library');
const { UserAdmin, UserManager, UserDriver, Student, RefreshToken, OtpCode } = require('../../models');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const MODEL_MAP = { admin: UserAdmin, manager: UserManager, driver: UserDriver };

const generateTokens = (payload) => ({
  accessToken:  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }),
  refreshToken: uuidv4(),
});

class AuthService {

  async loginPassword(email, password, role) {
    if (role === 'parent' || role === 'student') {
      throw Object.assign(new Error('Phụ huynh và học sinh phải đăng nhập bằng Google OAuth.'), { status: 403 });
    }
    const Model = MODEL_MAP[role];
    if (!Model) throw Object.assign(new Error('Role không hợp lệ'), { status: 400 });
    const user = await Model.findOne({ where: { email: email.toLowerCase(), is_active: true } });
    if (!user) throw Object.assign(new Error('Tài khoản không tồn tại hoặc đã bị khóa'), { status: 401 });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw Object.assign(new Error('Mật khẩu không đúng'), { status: 401 });
    const { accessToken, refreshToken } = generateTokens({ id: user.id, role, email: user.email });
    await RefreshToken.create({ id: uuidv4(), user_id: user.id, user_type: role, token: refreshToken, expires_at: new Date(Date.now() + 7*24*60*60*1000) });
    await user.update({ last_login: new Date() });
    const { password_hash, ...userOut } = user.toJSON();
    return { accessToken, refreshToken, user: { ...userOut, role } };
  }

  async loginGoogle(idToken) {
    let gPayload;
    try {
      const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
      gPayload = ticket.getPayload();
    } catch { throw Object.assign(new Error('Google token không hợp lệ hoặc đã hết hạn'), { status: 401 }); }

    const emailLower = gPayload.email.toLowerCase().trim();
    const picture    = gPayload.picture;

    const student = await Student.findOne({
      where: { [Op.or]: [{ student_email: emailLower }, { parent_gmail: emailLower }], status: 'active' },
      include: [{ model: require('../../models').ClassRoom, as: 'classInfo', attributes: ['id','class_name','grade'] }],
    });

    if (!student) {
      throw Object.assign(
        new Error('Tài khoản Google này chưa được đăng ký trong hệ thống. Vui lòng liên hệ quản trị viên.'),
        { status: 403 }
      );
    }

    const isStudent = student.student_email === emailLower;
    const role      = isStudent ? 'student' : 'parent';
    const userId    = isStudent ? student.id : `parent_${student.id}`;

    const userData = isStudent ? {
      id: student.id, student_id: student.student_id, full_name: student.full_name,
      email: student.student_email, avatar_url: picture,
      class_name: student.classInfo?.class_name, class_id: student.class_id,
      bus_route_id: student.bus_route_id, bus_stop_id: student.bus_stop_id, role: 'student',
    } : {
      id: `parent_${student.id}`, full_name: student.parent_name, email: student.parent_gmail,
      avatar_url: picture, student_id: student.student_id, student_name: student.full_name,
      student_db_id: student.id, role: 'parent',
    };

    const { accessToken, refreshToken } = generateTokens({ id: userId, role, email: emailLower });
    return { accessToken, refreshToken, user: userData };
  }

  async refreshToken(token) {
    const stored = await RefreshToken.findOne({ where: { token, expires_at: { [Op.gt]: new Date() } } });
    if (!stored) throw Object.assign(new Error('Refresh token không hợp lệ'), { status: 401 });
    const Model = MODEL_MAP[stored.user_type];
    if (!Model) throw Object.assign(new Error('User type không hợp lệ'), { status: 400 });
    const user = await Model.findByPk(stored.user_id);
    if (!user) throw Object.assign(new Error('User không tồn tại'), { status: 404 });
    const accessToken = jwt.sign({ id: user.id, role: stored.user_type, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
    return { accessToken };
  }

  async logout(token) {
    if (token) await RefreshToken.destroy({ where: { token } });
  }

  async getMe(userId, role) {
    if (role === 'student') {
      const s = await Student.findByPk(userId, { include: [{ model: require('../../models').ClassRoom, as: 'classInfo' }] });
      if (!s) throw Object.assign(new Error('Không tìm thấy học sinh'), { status: 404 });
      return { ...s.toJSON(), role: 'student' };
    }
    if (role === 'parent') {
      const studentId = userId.replace('parent_', '');
      const s = await Student.findByPk(studentId);
      if (!s) throw Object.assign(new Error('Không tìm thấy phụ huynh'), { status: 404 });
      return { id: userId, full_name: s.parent_name, email: s.parent_gmail, student_id: s.student_id, student_name: s.full_name, role: 'parent' };
    }
    const Model = MODEL_MAP[role];
    if (!Model) throw Object.assign(new Error('Role không hợp lệ'), { status: 400 });
    const user = await Model.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
    if (!user) throw Object.assign(new Error('User không tồn tại'), { status: 404 });
    return { ...user.toJSON(), role };
  }

  async forgotPassword(email, role) {
    if (role === 'parent' || role === 'student') {
      throw Object.assign(new Error('Phụ huynh và học sinh đăng nhập qua Google, không dùng mật khẩu.'), { status: 400 });
    }
    const Model = MODEL_MAP[role];
    if (!Model) return;
    const user = await Model.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await OtpCode.create({ id: uuidv4(), user_id: user.id, user_type: role, code, type: 'password_reset', expires_at: new Date(Date.now() + 10*60*1000) });
    try {
      const nodemailer = require('nodemailer');
      const t = nodemailer.createTransport({ host: process.env.MAIL_HOST, port: +process.env.MAIL_PORT, auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS } });
      await t.sendMail({ from: `"SchoolBus" <${process.env.MAIL_USER}>`, to: email, subject: 'Đặt lại mật khẩu - School Bus',
        html: `<div style="font-family:sans-serif;max-width:420px;margin:auto;padding:28px;border-radius:12px;border:1px solid #e5e7eb"><h2 style="color:#1e40af">🚌 School Bus</h2><p>Mã OTP:</p><h1 style="font-size:42px;letter-spacing:10px;color:#1e40af;text-align:center">${code}</h1><p style="color:#888;font-size:13px">Hiệu lực 10 phút. Không chia sẻ với ai.</p></div>` });
    } catch (e) { console.error('Email error:', e.message); }
  }

  async resetPassword(email, code, newPassword, role) {
    const Model = MODEL_MAP[role];
    if (!Model) throw Object.assign(new Error('Role không hợp lệ'), { status: 400 });
    const user = await Model.findOne({ where: { email: email.toLowerCase() } });
    if (!user) throw Object.assign(new Error('Email không tồn tại'), { status: 404 });
    const otp = await OtpCode.findOne({ where: { user_id: user.id, user_type: role, code, type: 'password_reset', is_used: false, expires_at: { [Op.gt]: new Date() } } });
    if (!otp) throw Object.assign(new Error('OTP không hợp lệ hoặc đã hết hạn'), { status: 400 });
    await user.update({ password_hash: await bcrypt.hash(newPassword, 12) });
    await otp.update({ is_used: true });
    await RefreshToken.destroy({ where: { user_id: user.id, user_type: role } });
  }
}

module.exports = new AuthService();
