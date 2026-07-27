const express = require('express');
const router = express.Router();
const multer = require('multer');
const studentSvc = require('./student.service');
const { verifyToken, authorizeRoles } = require('../../middlewares/auth.middleware');

const auth = [verifyToken, authorizeRoles('admin')];
const mgrAuth = [verifyToken, authorizeRoles('admin', 'manager')];

// Multer: nhận file Excel trong memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      || file.mimetype === 'application/vnd.ms-excel'
      || file.originalname.endsWith('.xlsx')
      || file.originalname.endsWith('.xls');
    ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)'));
  },
});

// ── GET /api/v1/students — danh sách ─────────────────────────
router.get('/', ...mgrAuth, async (req, res, next) => {
  try {
    res.json({ success: true, data: await studentSvc.getStudents(req.query) });
  } catch (e) { next(e); }
});

// ── GET /api/v1/students/classes — danh sách lớp ─────────────
router.get('/classes', ...mgrAuth, async (req, res, next) => {
  try {
    res.json({ success: true, data: await studentSvc.getClasses() });
  } catch (e) { next(e); }
});

// ── GET /api/v1/students/template — tải file Excel mẫu ───────
router.get('/template', ...auth, async (req, res) => {
  const buf = studentSvc.generateTemplate();
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=student_import_template.xlsx');
  res.send(buf);
});

// ── GET /api/v1/students/:id — chi tiết ──────────────────────
router.get('/:id', ...mgrAuth, async (req, res, next) => {
  try {
    res.json({ success: true, data: await studentSvc.getStudentById(req.params.id) });
  } catch (e) { next(e); }
});

// ── POST /api/v1/students — thêm thủ công ────────────────────
router.post('/', ...auth, async (req, res, next) => {
  try {
    const student = await studentSvc.createStudent(req.body);
    res.status(201).json({ success: true, message: 'Thêm học sinh thành công', data: student });
  } catch (e) { next(e); }
});

// ── POST /api/v1/students/import — import Excel ───────────────
router.post('/import', ...auth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Vui lòng chọn file Excel' });
    const result = await studentSvc.importExcel(req.file.buffer);
    const success = result.failed === 0;
    res.status(success ? 200 : 207).json({
      success,
      message: success
        ? `Import thành công ${result.inserted} học sinh`
        : `Import xong: ${result.inserted} thành công, ${result.failed} lỗi`,
      data: result,
    });
  } catch (e) { next(e); }
});

// ── PUT /api/v1/students/:id — cập nhật ──────────────────────
router.put('/:id', ...auth, async (req, res, next) => {
  try {
    res.json({ success: true, data: await studentSvc.updateStudent(req.params.id, req.body) });
  } catch (e) { next(e); }
});

// ── PATCH /api/v1/students/:id/status — đổi trạng thái ───────
router.patch('/:id/status', ...auth, async (req, res, next) => {
  try {
    res.json({ success: true, data: await studentSvc.updateStatus(req.params.id, req.body.status) });
  } catch (e) { next(e); }
});

// ── DELETE /api/v1/students/:id ───────────────────────────────
router.delete('/:id', ...auth, async (req, res, next) => {
  try {
    await studentSvc.deleteStudent(req.params.id);
    res.json({ success: true, message: 'Đã xóa học sinh' });
  } catch (e) { next(e); }
});

module.exports = router;
