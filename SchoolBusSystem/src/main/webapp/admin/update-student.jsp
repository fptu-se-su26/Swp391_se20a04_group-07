<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cập nhật Học sinh</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container mt-4">
    <form action="${pageContext.request.contextPath}/admin/update-student" method="POST">
        <input type="hidden" name="studentId" value="${student.studentId}">

        <div class="row card p-4 shadow-sm">
            <h4 class="mb-4 text-primary">Cập nhật thông tin học sinh</h4>
            <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Họ và tên</label>
                <input type="text" class="form-control" name="fullName" value="${student.fullName}" required>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Ngày sinh</label>
                <input type="date" class="form-control" name="dob" value="${student.dateOfBirth}" required>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Giới tính</label>
                <select name="gender" class="form-select">
                    <option value="Nam" ${student.gender == 'Nam' ? 'selected' : ''}>Nam</option>
                    <option value="Nữ" ${student.gender == 'Nữ' ? 'selected' : ''}>Nữ</option>
                </select>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Tên trường</label>
                <input type="text" class="form-control" name="schoolName" value="${student.schoolName}" required>
            </div>
            
            <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Lớp học</label>
                <select name="classId" class="form-select" required>
                    <option value="">-- Chọn lớp học --</option>
                    <c:forEach var="c" items="${classList}">
                        <option value="${c.classId}" ${student.classId == c.classId ? 'selected' : ''}>
                            ${c.className} (${c.academicYear})
                        </option>
                    </c:forEach>
                </select>
            </div>

            <div class="col-md-6 mb-3">
                <label class="form-label fw-bold">Trạng thái</label>
                <select name="status" class="form-select">
                    <option value="true" ${student.status ? 'selected' : ''}>Hoạt động</option>
                    <option value="false" ${!student.status ? 'selected' : ''}>Ngừng hoạt động</option>
                </select>
            </div>
            <div class="col-md-12 mb-4">
                <label class="form-label fw-bold">Địa chỉ</label>
                <input type="text" class="form-control" name="address" value="${student.address}" required>
            </div>
            
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success px-4">Cập nhật</button>
                <a href="manage-students" class="btn btn-secondary px-4">Hủy bỏ</a>
            </div>
        </div>
    </form>
</div>
</body>
</html>