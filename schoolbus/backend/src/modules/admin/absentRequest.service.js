// ============================================================
// ABSENT REQUEST SERVICE — Admin/Manager xem & lọc đơn xin vắng học
// Tái sử dụng bảng AbsentRequests + Students + Classes có sẵn,
// không tạo bảng mới.
// ============================================================
const { AbsentRequest, Student, ClassRoom } = require('../../models');
const { Op } = require('sequelize');

class AbsentRequestService {

  // ── Danh sách đơn xin vắng học, có tìm kiếm + lọc ────────────
  async getAbsentRequests({ search, status, date, fromDate, toDate, page = 1, limit = 20 }) {
    const where = {};
    if (status) where.status = status;
    if (date) {
      where.absent_date = date;
    } else if (fromDate && toDate) {
      where.absent_date = { [Op.between]: [fromDate, toDate] };
    }

    const studentWhere = {};
    if (search) {
      studentWhere[Op.or] = [
        { full_name:   { [Op.like]: `%${search}%` } },
        { student_id:  { [Op.like]: `%${search}%` } },
        { parent_name: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await AbsentRequest.findAndCountAll({
      where,
      include: [{
        model: Student,
        as: 'student',
        where: Object.keys(studentWhere).length ? studentWhere : undefined,
        required: true,
        attributes: ['id', 'student_id', 'full_name', 'parent_name', 'parent_gmail'],
        include: [{ model: ClassRoom, as: 'classInfo', attributes: ['class_name'], required: false }],
      }],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
    });

    return { total: count, page: parseInt(page), limit: parseInt(limit), data: rows };
  }

  // ── Chi tiết 1 đơn ────────────────────────────────────────
  async getAbsentRequestById(id) {
    const req = await AbsentRequest.findByPk(id, {
      include: [{
        model: Student, as: 'student',
        attributes: ['id', 'student_id', 'full_name', 'parent_name', 'parent_gmail'],
        include: [{ model: ClassRoom, as: 'classInfo', attributes: ['class_name'], required: false }],
      }],
    });
    if (!req) throw Object.assign(new Error('Không tìm thấy đơn xin vắng học'), { status: 404 });
    return req;
  }
}

module.exports = new AbsentRequestService();
