// ============================================================
// STUDENT SERVICE - imports
// ============================================================
const { Student, ClassRoom, Route, RouteStop, sequelize } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const XLSX = require('xlsx');
const { geocodeAddress, isInDaNang } = require('../../utils/geocode.util');

// ── Cột Excel bắt buộc ───────────────────────────────────────
const EXCEL_COLUMNS = [
  { key: 'student_id', label: 'Mã học sinh', required: true },
  { key: 'full_name', label: 'Họ và tên', required: true },
  { key: 'dob', label: 'Ngày sinh', required: true },
  { key: 'gender', label: 'Giới tính', required: true },
  { key: 'class_name', label: 'Lớp', required: true },
  { key: 'student_email', label: 'Email học sinh', required: true },
  { key: 'student_phone', label: 'SĐT học sinh', required: false },
  { key: 'parent_name', label: 'Tên phụ huynh', required: true },
  { key: 'parent_gmail', label: 'Gmail phụ huynh', required: true },
  { key: 'home_address', label: 'Địa chỉ', required: false },
];

class StudentService {

  // ── Danh sách học sinh ────────────────────────────────────
  async getStudents({ search, classId, status, routeId, page = 1, limit = 20 }) {
    const where = {};
    if (status) where.status = status;
    if (classId) where.class_id = classId;
    if (routeId) where.bus_route_id = routeId;
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { student_id: { [Op.like]: `%${search}%` } },
        { student_email: { [Op.like]: `%${search}%` } },
        { parent_name: { [Op.like]: `%${search}%` } },
        { parent_gmail: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Student.findAndCountAll({
      where,
      include: [
        {
          model: ClassRoom,
          as: 'classInfo',
          attributes: ['id', 'class_name', 'grade'],
          required: false,
        },
        {
          model: Route,
          as: 'busRoute',
          attributes: ['id', 'route_name', 'route_code'],
          required: false,
        },
        {
          model: RouteStop,
          as: 'busStop',
          attributes: ['id', 'stop_name'],
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
    });

    return { total: count, page: parseInt(page), limit: parseInt(limit), data: rows };
  }

  // ── Chi tiết 1 học sinh ───────────────────────────────────
  async getStudentById(id) {
    const s = await Student.findByPk(id, {
      include: [
        { model: ClassRoom, as: 'classInfo', required: false },
        { model: Route, as: 'busRoute', required: false },
        { model: RouteStop, as: 'busStop', required: false },
      ],
    });
    if (!s) throw Object.assign(new Error('Không tìm thấy học sinh'), { status: 404 });
    return s;
  }

  // ── Thêm học sinh thủ công ────────────────────────────────
  async createStudent(data) {
    await this._checkDuplicate(data.student_id, data.student_email, data.parent_gmail);

    const cls = await ClassRoom.findByPk(data.class_id);
    if (!cls) throw Object.assign(new Error('Lớp học không tồn tại'), { status: 404 });

    // ── MỚI: chuẩn hoá field UUID rỗng thành null ──
    const bus_route_id = data.bus_route_id || null;
    const bus_stop_id = data.bus_stop_id || null;

    let home_lat = null, home_lng = null;
    if (data.home_address) {
      const geo = await geocodeAddress(data.home_address);
      if (geo && isInDaNang(geo.lat, geo.lng)) {
        home_lat = geo.lat;
        home_lng = geo.lng;
      } else if (geo) {
        console.warn(`createStudent: toạ độ ngoài Đà Nẵng cho "${data.home_address}" -> (${geo.lat}, ${geo.lng}), bỏ qua`);
      } else {
        console.warn(`createStudent: không geocode được "${data.home_address}"`);
      }
    }

    const student = await Student.create({
      id: uuidv4(),
      student_id: data.student_id.trim().toUpperCase(),
      full_name: data.full_name.trim(),
      dob: data.dob,
      gender: data.gender,
      class_id: data.class_id,
      student_email: data.student_email.trim().toLowerCase(),
      student_phone: data.student_phone || null,
      parent_name: data.parent_name.trim(),
      parent_gmail: data.parent_gmail.trim().toLowerCase(),
      home_address: data.home_address || null,
      home_lat,
      home_lng,
      bus_route_id,       // ← dùng biến đã chuẩn hoá
      bus_stop_id,        // ← dùng biến đã chuẩn hoá
      status: 'active',
    });

    return this.getStudentById(student.id);
  }

  // ── Cập nhật học sinh ─────────────────────────────────────
  async updateStudent(id, data) {
    const student = await Student.findByPk(id);
    if (!student) throw Object.assign(new Error('Không tìm thấy học sinh'), { status: 404 });

    if (data.student_email && data.student_email !== student.student_email) {
      const dup = await Student.findOne({ where: { student_email: data.student_email, id: { [Op.ne]: id } } });
      if (dup) throw Object.assign(new Error('Email học sinh đã tồn tại'), { status: 409 });
    }
    if (data.parent_gmail && data.parent_gmail !== student.parent_gmail) {
      const dup = await Student.findOne({ where: { parent_gmail: data.parent_gmail, id: { [Op.ne]: id } } });
      if (dup) throw Object.assign(new Error('Gmail phụ huynh đã tồn tại'), { status: 409 });
    }

    // ── MỚI: chuẩn hoá các field UUID — chuỗi rỗng "" phải thành null,
    // vì SQL Server không convert "" sang uniqueidentifier được ──
    const uuidFields = ['class_id', 'bus_route_id', 'bus_stop_id'];
    for (const field of uuidFields) {
      if (data[field] === '' || data[field] === undefined) {
        data[field] = null;
      }
    }

    // ── Nếu địa chỉ thay đổi -> geocode lại tọa độ mới ──
    if (data.home_address && data.home_address !== student.home_address) {
      const geo = await geocodeAddress(data.home_address);
      if (geo && isInDaNang(geo.lat, geo.lng)) {
        data.home_lat = geo.lat;
        data.home_lng = geo.lng;
      } else {
        delete data.home_lat;
        delete data.home_lng;
        console.warn(`updateStudent: không geocode được/toạ độ ngoài Đà Nẵng cho "${data.home_address}", giữ tọa độ cũ`);
      }
    }

    await student.update(data);
    return this.getStudentById(id);
  }

  // ── Đổi trạng thái ───────────────────────────────────────
  async updateStatus(id, status) {
    const student = await Student.findByPk(id);
    if (!student) throw Object.assign(new Error('Không tìm thấy học sinh'), { status: 404 });
    await student.update({ status });
    return { id, status };
  }

  // ── Xóa học sinh ─────────────────────────────────────────
  async deleteStudent(id) {
    const student = await Student.findByPk(id);
    if (!student) throw Object.assign(new Error('Không tìm thấy học sinh'), { status: 404 });
    await student.destroy();
  }

  // ── Import Excel ─────────────────────────────────────────
  async importExcel(fileBuffer) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!rows.length) throw Object.assign(new Error('File Excel trống'), { status: 400 });

    // Map tên lớp → id
    const classes = await ClassRoom.findAll({ attributes: ['id', 'class_name'] });
    const classMap = {};
    classes.forEach(c => { classMap[c.class_name.toLowerCase()] = c.id; });

    // Email/ID đã có trong DB
    const existing = await Student.findAll({ attributes: ['student_id', 'student_email', 'parent_gmail'] });
    const existIds = new Set(existing.map(s => s.student_id.toLowerCase()));
    const existEmails = new Set(existing.map(s => s.student_email.toLowerCase()));
    const existGmails = new Set(existing.map(s => s.parent_gmail.toLowerCase()));

    const errors = [];
    const toInsert = [];
    const seenIds = new Set();
    const seenEmails = new Set();
    const seenGmails = new Set();

    for (let idx = 0; idx < rows.length; idx++) {
      const row = rows[idx];
      const lineNum = idx + 2;
      const rowErrors = [];

      // Lấy giá trị từng cột
      const studentId = String(row['Mã học sinh'] || '').trim().toUpperCase();
      const fullName = String(row['Họ và tên'] || '').trim();
      const dobRaw = row['Ngày sinh'];
      const gender = String(row['Giới tính'] || '').trim();
      const className = String(row['Lớp'] || '').trim().toLowerCase();
      const studentEmail = String(row['Email học sinh'] || '').trim().toLowerCase();
      const studentPhone = String(row['SĐT học sinh'] || '').trim() || null;
      const parentName = String(row['Tên phụ huynh'] || '').trim();
      const parentGmail = String(row['Gmail phụ huynh'] || '').trim().toLowerCase();
      const homeAddress = String(row['Địa chỉ'] || '').trim() || null;

      // Validate bắt buộc
      if (!studentId) rowErrors.push('Thiếu Mã học sinh');
      if (!fullName) rowErrors.push('Thiếu Họ và tên');
      if (!gender) rowErrors.push('Thiếu Giới tính');
      if (!className) rowErrors.push('Thiếu Lớp');
      if (!studentEmail) rowErrors.push('Thiếu Email học sinh');
      if (!parentName) rowErrors.push('Thiếu Tên phụ huynh');
      if (!parentGmail) rowErrors.push('Thiếu Gmail phụ huynh');

      // Validate email
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (studentEmail && !emailReg.test(studentEmail)) rowErrors.push(`Email học sinh không hợp lệ: "${studentEmail}"`);
      if (parentGmail && !emailReg.test(parentGmail)) rowErrors.push(`Gmail phụ huynh không hợp lệ: "${parentGmail}"`);

      // Validate ngày sinh
      let dob = null;
      if (dobRaw) {
        const d = new Date(dobRaw);
        if (isNaN(d.getTime())) rowErrors.push('Ngày sinh không đúng định dạng');
        else dob = d.toISOString().split('T')[0];
      } else {
        rowErrors.push('Thiếu Ngày sinh');
      }

      // Validate lớp
      const classId = classMap[className];
      if (!classId) rowErrors.push(`Lớp "${row['Lớp']}" không tồn tại trong hệ thống`);

      // Check trùng trong DB
      if (existIds.has(studentId.toLowerCase())) rowErrors.push(`Mã HS "${studentId}" đã tồn tại trong hệ thống`);
      if (existEmails.has(studentEmail)) rowErrors.push(`Email "${studentEmail}" đã tồn tại`);
      if (existGmails.has(parentGmail)) rowErrors.push(`Gmail PH "${parentGmail}" đã tồn tại`);

      // Check trùng trong file
      if (seenIds.has(studentId.toLowerCase())) rowErrors.push(`Mã HS "${studentId}" bị trùng trong file`);
      else seenIds.add(studentId.toLowerCase());

      if (seenEmails.has(studentEmail)) rowErrors.push(`Email "${studentEmail}" bị trùng trong file`);
      else seenEmails.add(studentEmail);

      if (seenGmails.has(parentGmail)) rowErrors.push(`Gmail PH "${parentGmail}" bị trùng trong file`);
      else seenGmails.add(parentGmail);

      if (rowErrors.length > 0) {
        errors.push({ line: lineNum, student_id: studentId || `(dòng ${lineNum})`, errors: rowErrors });
      } else {
        // ── Geocode địa chỉ nhà, giống hệt createStudent() ──
        // (không chặn import nếu geocode lỗi/không tìm thấy — vẫn insert, chỉ thiếu tọa độ)
        let home_lat = null, home_lng = null;
        if (homeAddress) {
          try {
            const geo = await geocodeAddress(homeAddress);
            if (geo && isInDaNang(geo.lat, geo.lng)) {
              home_lat = geo.lat;
              home_lng = geo.lng;
            } else if (geo) {
              console.warn(`importExcel: toạ độ ngoài Đà Nẵng cho "${homeAddress}" (dòng ${lineNum}) -> (${geo.lat}, ${geo.lng})`);
            }
          } catch (err) {
            console.error(`importExcel: geocode lỗi cho "${homeAddress}" (dòng ${lineNum}):`, err.message);
          }
          // Tránh gọi Mapbox quá nhanh khi import nhiều dòng liên tiếp (rate-limit)
          await new Promise(r => setTimeout(r, 150));
        }

        toInsert.push({
          id: uuidv4(),
          student_id: studentId,
          full_name: fullName,
          dob,
          gender: gender.charAt(0).toUpperCase() + gender.slice(1),
          class_id: classId,
          student_email: studentEmail,
          student_phone: studentPhone,
          parent_name: parentName,
          parent_gmail: parentGmail,
          home_address: homeAddress,
          home_lat,
          home_lng,
          status: 'active',
        });
      }
    }

    let inserted = 0;
    if (toInsert.length > 0) {
      await Student.bulkCreate(toInsert, { validate: true });
      inserted = toInsert.length;
    }

    return { total: rows.length, inserted, failed: errors.length, errors };
  }

  // ── Template Excel ────────────────────────────────────────
  generateTemplate() {
    const headers = EXCEL_COLUMNS.map(c => c.label);
    const example = [
      'HS2024001', 'Nguyễn Văn A', '15/05/2009', 'Nam',
      '10A1', 'a.nguyen@student.edu.vn', '0901234567',
      'Nguyễn Văn Bố', 'bo.nguyen@gmail.com', '123 Đường ABC, Q.1',
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    ws['!cols'] = headers.map(() => ({ wch: 22 }));
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachHocSinh');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  // ── Danh sách lớp ────────────────────────────────────────
  async getClasses() {
    return ClassRoom.findAll({
      where: { is_active: true },
      order: [['grade', 'ASC'], ['class_name', 'ASC']]
    });
  }

  // ── Helper check trùng ────────────────────────────────────
  async _checkDuplicate(studentId, studentEmail, parentGmail, excludeId = null) {
    const ne = excludeId ? { id: { [Op.ne]: excludeId } } : {};
    const [dupId, dupEmail, dupGmail] = await Promise.all([
      Student.findOne({ where: { student_id: studentId, ...ne } }),
      Student.findOne({ where: { student_email: studentEmail, ...ne } }),
      Student.findOne({ where: { parent_gmail: parentGmail, ...ne } }),
    ]);
    if (dupId) throw Object.assign(new Error(`Mã học sinh "${studentId}" đã tồn tại`), { status: 409 });
    if (dupEmail) throw Object.assign(new Error(`Email "${studentEmail}" đã tồn tại`), { status: 409 });
    if (dupGmail) throw Object.assign(new Error(`Gmail PH "${parentGmail}" đã tồn tại`), { status: 409 });
  }
}

module.exports = new StudentService();