<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<%@taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Quản lý Học sinh - Admin</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

            * {
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background-color: #f0f4f8;
                margin: 0;
            }

            .main-content-wrapper {
                margin-left: 260px;
                min-height: 100vh;
                background-color: #f0f4f8;
            }

            /* ── PAGE HEADER ── */
            .page-header {
                background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
                padding: 28px 40px 80px;
                position: relative;
                overflow: hidden;
            }
            .page-header::before {
                content: '';
                position: absolute;
                top: -60px;
                right: -60px;
                width: 220px;
                height: 220px;
                border-radius: 50%;
                background: rgba(255,255,255,0.06);
            }
            .page-header::after {
                content: '';
                position: absolute;
                bottom: -40px;
                left: 20%;
                width: 160px;
                height: 160px;
                border-radius: 50%;
                background: rgba(255,255,255,0.04);
            }
            .page-header .back-link {
                color: rgba(255,255,255,0.75);
                text-decoration: none;
                font-size: 0.82rem;
                font-weight: 500;
                letter-spacing: 0.3px;
                transition: color 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 14px;
            }
            .page-header .back-link:hover {
                color: #ffffff;
            }
            .page-header h1 {
                font-size: 1.6rem;
                font-weight: 800;
                color: #ffffff;
                margin: 0 0 4px;
                letter-spacing: -0.3px;
            }
            .page-header p {
                color: rgba(255,255,255,0.65);
                font-size: 0.85rem;
                margin: 0;
            }
            .header-actions {
                display: flex;
                gap: 10px;
            }

            /* ── STATS CARDS ── */
            .stats-row {
                padding: 0 40px;
                margin-top: -44px;
                position: relative;
                z-index: 10;
                display: flex;
                gap: 16px;
                margin-bottom: 24px;
            }
            .stat-card {
                background: #ffffff;
                border-radius: 14px;
                padding: 18px 22px;
                flex: 1;
                box-shadow: 0 4px 20px rgba(0,0,0,0.07);
                display: flex;
                align-items: center;
                gap: 16px;
                border: 1px solid rgba(255,255,255,0.8);
            }
            .stat-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            .stat-icon.blue {
                background: #eff6ff;
                color: #2563eb;
            }
            .stat-icon.green {
                background: #f0fdf4;
                color: #16a34a;
            }
            .stat-icon.purple {
                background: #faf5ff;
                color: #9333ea;
            }
            .stat-label {
                font-size: 0.78rem;
                color: #94a3b8;
                font-weight: 500;
                margin-bottom: 2px;
            }
            .stat-value {
                font-size: 1.4rem;
                font-weight: 800;
                color: #0f172a;
                line-height: 1;
            }

            /* ── MAIN CARD ── */
            .content-area {
                padding: 0 40px 40px;
            }

            .main-card {
                background: #ffffff;
                border-radius: 18px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                overflow: hidden;
                border: 1px solid #e8edf2;
            }

            .card-toolbar {
                padding: 20px 24px;
                border-bottom: 1px solid #f1f5f9;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                flex-wrap: wrap;
            }

            .search-box {
                position: relative;
                flex: 1;
                max-width: 320px;
            }
            .search-box input {
                width: 100%;
                padding: 9px 14px 9px 38px;
                border: 1.5px solid #e2e8f0;
                border-radius: 10px;
                font-size: 0.875rem;
                font-family: 'Inter', sans-serif;
                outline: none;
                transition: border-color 0.2s, box-shadow 0.2s;
                background: #f8fafc;
                color: #334155;
            }
            .search-box input:focus {
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
                background: #fff;
            }
            .search-box i {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #94a3b8;
                font-size: 0.85rem;
            }
            .toolbar-right {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .count-badge {
                background: #f1f5f9;
                color: #64748b;
                font-size: 0.78rem;
                font-weight: 600;
                padding: 5px 12px;
                border-radius: 20px;
            }

            /* ── TABLE ── */
            .table-responsive {
                overflow-x: auto;
            }

            table.student-table {
                width: 100%;
                border-collapse: collapse;
            }
            table.student-table thead th {
                background: #f8fafc;
                color: #64748b;
                font-size: 0.72rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.6px;
                padding: 14px 20px;
                border-bottom: 1px solid #e8edf2;
                white-space: nowrap;
            }
            table.student-table thead th:first-child {
                border-radius: 0;
            }

            table.student-table tbody tr {
                border-bottom: 1px solid #f1f5f9;
                transition: background 0.15s;
            }
            table.student-table tbody tr:last-child {
                border-bottom: none;
            }
            table.student-table tbody tr:hover {
                background: #fafbfd;
            }

            table.student-table tbody td {
                padding: 16px 20px;
                vertical-align: middle;
                font-size: 0.875rem;
                color: #334155;
            }

            /* Student Code */
            .student-code {
                font-weight: 700;
                font-size: 0.82rem;
                color: #2563eb;
                background: #eff6ff;
                padding: 4px 10px;
                border-radius: 6px;
                font-family: 'Courier New', monospace;
                letter-spacing: 0.3px;
                white-space: nowrap;
            }

            /* Avatar */
            .avatar-wrap {
                width: 42px;
                height: 42px;
                border-radius: 12px;
                background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                color: #2563eb;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                flex-shrink: 0;
            }
            .avatar-wrap.female {
                background: linear-gradient(135deg, #fce7f3, #fbcfe8);
                color: #db2777;
            }
            .student-name {
                font-weight: 700;
                color: #0f172a;
                font-size: 0.9rem;
                line-height: 1.3;
            }
            .student-school {
                font-size: 0.78rem;
                color: #94a3b8;
                margin-top: 1px;
            }

            /* Date */
            .date-text {
                color: #64748b;
                font-size: 0.85rem;
            }

            /* Gender Badge */
            .badge-gender {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 700;
                white-space: nowrap;
            }
            .badge-gender.male {
                background: #eff6ff;
                color: #1d4ed8;
            }
            .badge-gender.female {
                background: #fdf2f8;
                color: #be185d;
            }

            /* Area Badge */
            .badge-area {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                background: #f0fdf4;
                color: #15803d;
                border: 1px solid #bbf7d0;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.78rem;
                font-weight: 600;
                white-space: nowrap;
                max-width: 160px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .area-unknown {
                color: #cbd5e1;
                font-size: 0.82rem;
                font-style: italic;
            }

            /* Parent cell */
            .parent-cell {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .parent-avatar {
                width: 34px;
                height: 34px;
                border-radius: 50%;
                background: linear-gradient(135deg, #fef3c7, #fde68a);
                color: #b45309;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.9rem;
                flex-shrink: 0;
            }
            .parent-name {
                font-weight: 600;
                color: #1e293b;
                font-size: 0.875rem;
            }
            .parent-unlinked {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                color: #94a3b8;
                font-size: 0.82rem;
                font-style: italic;
            }

            /* Action buttons */
            .action-group {
                display: flex;
                gap: 6px;
                align-items: center;
                justify-content: center;
            }
            .btn-act {
                width: 34px;
                height: 34px;
                border-radius: 9px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: none;
                cursor: pointer;
                transition: all 0.18s;
                font-size: 0.82rem;
                text-decoration: none;
            }
            .btn-act.edit {
                background: #eff6ff;
                color: #2563eb;
            }
            .btn-act.edit:hover {
                background: #2563eb;
                color: #fff;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(37,99,235,0.3);
            }
            .btn-act.del {
                background: #fef2f2;
                color: #dc2626;
            }
            .btn-act.del:hover {
                background: #dc2626;
                color: #fff;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(220,38,38,0.3);
            }

            /* Empty state */
            .empty-state {
                padding: 72px 20px;
                text-align: center;
            }
            .empty-icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: #94a3b8;
                margin-bottom: 20px;
            }
            .empty-state h5 {
                color: #334155;
                font-weight: 700;
                margin-bottom: 6px;
            }
            .empty-state p {
                color: #94a3b8;
                font-size: 0.875rem;
                max-width: 300px;
                margin: 0 auto;
            }

            /* Alerts */
            .alert-custom {
                border-radius: 12px;
                border: none;
                font-weight: 600;
                font-size: 0.875rem;
                padding: 14px 18px;
                margin: 0 40px 20px;
            }
            .alert-custom.success {
                background: #f0fdf4;
                color: #15803d;
                border-left: 4px solid #22c55e;
            }
            .alert-custom.danger  {
                background: #fef2f2;
                color: #dc2626;
                border-left: 4px solid #f87171;
            }

            /* Top buttons */
            .btn-excel {
                background: #16a34a;
                color: #fff;
                border: none;
                border-radius: 10px;
                padding: 9px 18px;
                font-size: 0.85rem;
                font-weight: 600;
                font-family: 'Inter', sans-serif;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 7px;
                transition: all 0.2s;
                text-decoration: none;
            }
            .btn-excel:hover {
                background: #15803d;
                color: #fff;
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(22,163,74,0.35);
            }
            .btn-add {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: #fff;
                border: none;
                border-radius: 10px;
                padding: 9px 18px;
                font-size: 0.85rem;
                font-weight: 600;
                font-family: 'Inter', sans-serif;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 7px;
                transition: all 0.2s;
                text-decoration: none;
            }
            .btn-add:hover {
                background: linear-gradient(135deg, #1d4ed8, #1e40af);
                color: #fff;
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(37,99,235,0.4);
            }
        </style>
    </head>
    <body>

        <jsp:include page="admin-sidebar.jsp" />

        <div class="main-content-wrapper">
            <jsp:include page="admin-header.jsp" />

            <!-- PAGE HEADER -->
            <div class="page-header">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <a href="${pageContext.request.contextPath}/admin/manage-classes" class="back-link">
                            <i class="fas fa-arrow-left"></i> Quay lại danh sách lớp
                        </a>
                        <h1><i class="fas fa-user-graduate me-2" style="opacity:0.85;"></i>Danh sách Học sinh</h1>
                        <p>Quản lý hồ sơ và cập nhật thông tin học sinh của lớp</p>
                    </div>
                    <div class="header-actions">
                        <button type="button" class="btn-excel">
                            <i class="fas fa-file-excel"></i> Nhập Excel
                        </button>
                        <a href="${pageContext.request.contextPath}/admin/add-student?classId=${param.classId}" class="btn-add">
                            <i class="fas fa-plus"></i> Thêm Học sinh
                        </a>
                    </div>
                </div>
            </div>

            <!-- STATS -->
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-users"></i></div>
                    <div>
                        <div class="stat-label">Tổng học sinh</div>
                        <div class="stat-value">${not empty studentList ? studentList.size() : 0}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-user-check"></i></div>
                    <div>
                        <div class="stat-label">Đã liên kết phụ huynh</div>
                        <div class="stat-value">
                            <c:set var="linkedCount" value="0"/>
                            <c:forEach var="s" items="${studentList}">
                                <c:if test="${not empty s.parentName}"><c:set var="linkedCount" value="${linkedCount + 1}"/></c:if>
                            </c:forEach>
                            ${linkedCount}
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple"><i class="fas fa-map-marker-alt"></i></div>
                    <div>
                        <div class="stat-label">Đã xác định khu vực</div>
                        <div class="stat-value">
                            <c:set var="areaCount" value="0"/>
                            <c:forEach var="s" items="${studentList}">
                                <c:if test="${not empty s.areaName && s.areaName != 'Chưa xác định'}"><c:set var="areaCount" value="${areaCount + 1}"/></c:if>
                            </c:forEach>
                            ${areaCount}
                        </div>
                    </div>
                </div>
            </div>

            <!-- ALERTS -->
            <c:if test="${param.msg eq 'delete_success'}">
                <div class="alert-custom success alert-dismissible fade show" role="alert">
                    <i class="fas fa-check-circle me-2"></i>Đã xóa học sinh khỏi hệ thống thành công!
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </c:if>
            <c:if test="${param.error eq 'delete_failed'}">
                <div class="alert-custom danger alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>Xóa học sinh thất bại. Vui lòng kiểm tra lại liên kết dữ liệu!
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </c:if>

            <!-- MAIN TABLE CARD -->
            <div class="content-area">
                <div class="main-card">
                    <div class="card-toolbar">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="searchInput" placeholder="Tìm kiếm học sinh..." oninput="filterTable()">
                        </div>
                        <div class="toolbar-right">
                            <span class="count-badge" id="countBadge">
                                ${not empty studentList ? studentList.size() : 0} học sinh
                            </span>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="student-table" id="studentTable">
                            <thead>
                                <tr>
                                    <th>Mã HS</th>
                                    <th>Học Sinh</th>
                                    <th>Ngày Sinh</th>
                                    <th class="text-center">Giới Tính</th>
                                    <th>Khu Vực</th>
                                    <th>Phụ Huynh</th>
                                    <th class="text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:choose>
                                    <c:when test="${not empty studentList}">
                                        <c:forEach var="s" items="${studentList}">
                                            <tr>
                                                <td>
                                                    <span class="student-code">#${s.studentCode}</span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center gap-3">
                                                        <div class="avatar-wrap ${s.gender eq 'Nữ' ? 'female' : ''}">
                                                            <i class="fas ${s.gender eq 'Nữ' ? 'fa-user' : 'fa-user-graduate'}"></i>
                                                        </div>
                                                        <div>
                                                            <div class="student-name">${s.fullName}</div>
                                                            <div class="student-school"><i class="fas fa-school me-1" style="opacity:0.5;"></i>${s.schoolName}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="date-text">
                                                        <i class="fas fa-calendar-alt me-1" style="color:#cbd5e1;"></i>
                                                        <fmt:formatDate value="${s.dateOfBirth}" pattern="dd/MM/yyyy"/>
                                                    </span>
                                                </td>
                                                <td class="text-center">
                                                    <span class="badge-gender ${s.gender eq 'Nam' ? 'male' : 'female'}">
                                                        <i class="fas ${s.gender eq 'Nam' ? 'fa-mars' : 'fa-venus'} me-1"></i>${s.gender}
                                                    </span>
                                                </td>
                                                <td>
                                                    <c:choose>
                                                        <c:when test="${not empty s.areaName && s.areaName != 'Chưa xác định'}">
                                                            <span class="badge-area">
                                                                <i class="fas fa-map-marker-alt"></i>${s.areaName}
                                                            </span>
                                                        </c:when>
                                                        <c:otherwise>
                                                            <span class="area-unknown"><i class="fas fa-question-circle me-1"></i>Chưa xác định</span>
                                                        </c:otherwise>
                                                    </c:choose>
                                                </td>
                                                <td>
                                                    <c:choose>
                                                        <c:when test="${not empty s.parentName}">
                                                            <div class="parent-cell">
                                                                <div class="parent-avatar"><i class="fas fa-user-tie"></i></div>
                                                                <span class="parent-name">${s.parentName}</span>
                                                            </div>
                                                        </c:when>
                                                        <c:otherwise>
                                                            <span class="parent-unlinked">
                                                                <i class="fas fa-unlink"></i>Chưa liên kết
                                                            </span>
                                                        </c:otherwise>
                                                    </c:choose>
                                                </td>
                                                <td>
                                                    <div class="action-group">
                                                        <a href="${pageContext.request.contextPath}/admin/update-student?id=${s.studentId}&classId=${param.classId}" class="btn-action btn-edit me-1" title="Chỉnh sửa thông tin">
                                                            <i class="fas fa-pencil-alt small"></i>
                                                        </a>
                                                        <form action="${pageContext.request.contextPath}/admin/manage-students" method="post"
                                                              class="d-inline"
                                                              onsubmit="return confirmDelete('${s.fullName}');">
                                                            <input type="hidden" name="action" value="delete">
                                                            <input type="hidden" name="studentId" value="${s.studentId}">
                                                            <input type="hidden" name="classId" value="${param.classId}">
                                                            <button type="submit" class="btn-act del" title="Xóa học sinh">
                                                                <i class="fas fa-trash-alt"></i>
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>
                                    <c:otherwise>
                                        <tr>
                                            <td colspan="7">
                                                <div class="empty-state">
                                                    <div class="empty-icon"><i class="fas fa-user-graduate"></i></div>
                                                    <h5>Lớp này chưa có học sinh nào</h5>
                                                    <p>Sử dụng nút <strong>Thêm Học sinh</strong> hoặc <strong>Nhập Excel</strong> ở góc trên bên phải để bắt đầu.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </c:otherwise>
                                </c:choose>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <script>
                                                                  function confirmDelete(name) {
                                                                      return confirm('Bạn có chắc chắn muốn xóa học sinh "' + name + '" không?\nHành động này không thể hoàn tác.');
                                                                  }

                                                                  function filterTable() {
                                                                      const input = document.getElementById('searchInput').value.toLowerCase();
                                                                      const rows = document.querySelectorAll('#studentTable tbody tr');
                                                                      let visible = 0;
                                                                      rows.forEach(row => {
                                                                          const text = row.innerText.toLowerCase();
                                                                          const show = text.includes(input);
                                                                          row.style.display = show ? '' : 'none';
                                                                          if (show)
                                                                              visible++;
                                                                      });
                                                                      document.getElementById('countBadge').textContent = visible + ' học sinh';
                                                                  }
        </script>
    </body>
</html>
