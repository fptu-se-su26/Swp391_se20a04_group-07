# Changelog

## 1. Quy định ghi Changelog

File này dùng để ghi lại các thay đổi quan trọng trong quá trình thực hiện project.

Nguyên tắc ghi changelog:
- Chỉ ghi những gì đã hoàn thành thật sự.
- Không ghi kế hoạch nếu chưa thực hiện.
- Mỗi thay đổi nên có ngày, nội dung, người thực hiện và minh chứng.
- Nếu có AI hỗ trợ, cần ghi rõ AI đã hỗ trợ phần nào.
- Nếu có lỗi đã sửa, cần ghi rõ lỗi, nguyên nhân và cách xử lý.

---

## 2. Thông tin project

| Thông tin | Nội dung |
|---|---|
| Môn học | Software Development Project |
| Mã môn học | SWP391 |
| Lớp | SE20A04 |
| Học kỳ | SU26 |
| Tên bài tập / Project | School Bus System |
| Tên sinh viên | Đào Hoàng Ân |
| MSSV | DE191015 |
| Phần phụ trách | Admin Module |
| Giảng viên hướng dẫn | Lê Thiện Nhật Quang |
| Repository URL |  |
| Ngày bắt đầu | 19/05/2026 |
| Ngày hoàn thành |  |

---

## 3. Tổng quan các giai đoạn

| Giai đoạn | Thời gian | Nội dung chính | Trạng thái |
|---|---|---|---|
| Phase 01 | 19/05/2026 | Khởi tạo project, phân công nhiệm vụ Admin module | Completed |
| Phase 02 | 20/05/2026 | Phân tích yêu cầu Admin, xác định chức năng | Completed |
| Phase 03 | 25/05/2026 | Thiết kế giao diện Admin, thiết kế luồng xử lý | Completed |
| Phase 04 | 27/05/2026 | Implementation Admin module | In Progress |
| Phase 05 | /06/2026 | Testing & Debug Admin module | Not Started |
| Phase 06 | /06/2026 | Hoàn thiện báo cáo và demo | Not Started |

---

# [Phase 01] Khởi tạo project

## Ngày thực hiện

```text
19/05/2026
```

## Đã hoàn thành

- [x] Nhận phân công: phụ trách Admin Module
- [x] Tạo cấu trúc thư mục cho Admin: `src/main/webapp/admin/`
- [x] Tạo package `controllleradmin` trong Java source
- [x] Khởi tạo file `AI_AUDIT_LOG.md`, `PROMPTS.md`, `REFLECTION.md`, `CHANGELOG.md`
- [x] Cài đặt môi trường: NetBeans, Tomcat 10, SQL Server
- [x] Kết nối DB thành công qua DBContext

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 | Tạo cấu trúc thư mục admin trong webapp | Đào Hoàng Ân | `/webapp/admin/` | commit |
| 2 | Tạo package controllleradmin | Đào Hoàng Ân | `controllleradmin/` | commit |
| 3 | Cấu hình DBContext kết nối SQL Server | Đào Hoàng Ân | `dao/DBContext.java` | DB connect OK |

## AI có hỗ trợ không?

- [ ] Có
- [x] Không

## Ghi chú

```text
Phase này chủ yếu là setup môi trường, không cần AI hỗ trợ.
```

---

# [Phase 02] Phân tích yêu cầu

## Ngày thực hiện

```text
20/05/2026
```

## Đã hoàn thành

- [x] Xác định các chức năng Admin module cần xây dựng
- [x] Xác định các màn hình cần thiết
- [x] Xác định luồng dữ liệu Admin ↔ DB
- [x] Xác định các bảng DB liên quan: users, students, parents, drivers, vehicles, routes, trips, notifications, leave_requests, feedbacks, classes, parent_areas
- [x] Phân tích actor và phân quyền: Admin (role_id = 1)

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 | Lên danh sách 12 màn hình Admin cần xây dựng | Đào Hoàng Ân | SRS Document | Tài liệu yêu cầu |
| 2 | Xác định luồng Student-Parent linking | Đào Hoàng Ân | Flowchart | Diagram |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
ChatGPT hỗ trợ gợi ý danh sách chức năng Admin cần có trong hệ thống quản lý xe buýt.
Tôi dùng gợi ý đó để đối chiếu với SRS và bổ sung các chức năng còn thiếu.
```

---

# [Phase 03] Thiết kế hệ thống

## Ngày thực hiện

```text
25/05/2026
```

## Đã hoàn thành

- [x] Thiết kế layout Admin: sidebar + header + main content
- [x] Thiết kế wireframe cho 12 màn hình Admin
- [x] Thiết kế luồng Student → StudentDetail → AddParent
- [x] Thiết kế flow duyệt đơn xin nghỉ: PENDING → APPROVED/REJECTED + Notification
- [x] Xác định các Servlet cần tạo trong Admin module

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 | Thiết kế Admin sidebar navigation | Đào Hoàng Ân | admin-sidebar.jsp | Wireframe |
| 2 | Thiết kế luồng Student-Parent linking | Đào Hoàng Ân | Flowchart | Diagram |
| 3 | Xác định 15 Servlet cần xây dựng | Đào Hoàng Ân | controllleradmin/ | Danh sách servlet |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Claude hỗ trợ thiết kế layout Admin Dashboard và gợi ý cấu trúc luồng
Student-Parent linking. Tôi tự điều chỉnh màu sắc và thiết kế chi tiết
cho phù hợp phong cách của nhóm.
```

---

# [Phase 04] Implementation

## Ngày thực hiện

```text
27/05/2026 – đang tiến hành
```

## Đã hoàn thành

- [x] Admin layout: admin-sidebar.jsp, admin-header.jsp, admin-footer.jsp
- [x] Admin Dashboard: DashboardServlet.java + admin-dashboard.jsp
- [x] Quản lý Lớp học: ManageClassServlet.java + manage-classes.jsp
- [x] Quản lý Học sinh: ManageStudentServlet.java + manage-students.jsp
- [x] Chi tiết Học sinh: StudentDetailServlet.java + student-detail.jsp
- [x] Thêm và Gán Phụ huynh: AddParentFromStudentServlet.java
- [x] Cập nhật Học sinh: UpdateStudentServlet.java + update-student.jsp
- [x] Quản lý Phụ huynh: ManageParentServlet.java + manage-parents.jsp
- [x] Cập nhật Phụ huynh: UpdateParentServlet.java + update-parent.jsp
- [x] Quản lý Tài xế: ManageDriverServlet.java + manage-drivers.jsp
- [x] Quản lý Xe: ManageVehicleServlet.java + manage-vehicles.jsp
- [x] Quản lý Tuyến đường: ManageRouteServlet.java + manage-routes.jsp
- [x] Quản lý Chuyến đi: ManageTripServlet.java + manage-trips.jsp
- [x] Quản lý Điểm danh: ManageAttendanceServlet.java + manage-attendance.jsp
- [x] Thông báo: ManageNotificationServlet.java + manage-notifications.jsp
- [x] Duyệt đơn xin nghỉ: ManageLeaveRequestServlet.java + manage-leave-requests.jsp
- [x] Phản hồi: ManageFeedbackServlet.java + manage-feedbacks.jsp
- [x] SQL patch thêm cột phone vào bảng parents
- [x] SQL patch thêm cột latitude, longitude vào route_stops

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 | Tạo Admin layout (sidebar, header, footer) | Đào Hoàng Ân | admin-sidebar.jsp, admin-header.jsp | commit |
| 2 | Xây dựng chức năng quản lý học sinh + chi tiết | Đào Hoàng Ân | ManageStudentServlet, StudentDetailServlet, manage-students.jsp, student-detail.jsp | commit |
| 3 | Xây dựng chức năng Thêm & Gán phụ huynh từ trang chi tiết | Đào Hoàng Ân | AddParentFromStudentServlet.java, StudentDAO.updateParentId() | commit |
| 4 | Fix bug lỗi p.phone không tồn tại trong bảng parents | Đào Hoàng Ân | StudentDAO.java, ParentDAO.java, patch_add_phone.sql | commit |
| 5 | Tối ưu giao diện manage-students: badge PH, nút Chi tiết, modal | Đào Hoàng Ân | manage-students.jsp, Student.java | commit |
| 6 | Xây dựng chức năng duyệt đơn xin nghỉ + gửi notification | Đào Hoàng Ân | ManageLeaveRequestServlet.java, NotificationDAO.java | commit |
| 7 | Xây dựng chức năng broadcast notification đến tất cả user | Đào Hoàng Ân | ManageNotificationServlet.java, NotificationDAO.java | commit |
| 8 | Xây dựng quản lý tài xế, xe, tuyến, chuyến | Đào Hoàng Ân | ManageDriver/Vehicle/Route/TripServlet.java | commit |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
- Claude hỗ trợ thiết kế luồng Student-Parent linking và code StudentDetailServlet,
  AddParentFromStudentServlet (tôi tự sửa edge case email trùng và NULL parent_id).
- Claude xác định nguyên nhân bug lỗi p.phone trong StudentDAO.
- Claude gợi ý tối ưu giao diện manage-students.jsp (tôi tự thêm taglib fn, field
  parentPhone vào model Student).
- ChatGPT gợi ý cấu trúc NotificationServlet (tôi tự tối ưu thành INSERT-SELECT).
```

## Danh sách lỗi đã xử lý trong Phase này

| STT | Lỗi phát hiện | Nguyên nhân | Cách xử lý | Trạng thái |
|---:|---|---|---|---|
| 1 | Trang update-student redirect error=notfound | StudentDAO.getStudentById() lỗi SQL do cột p.phone không tồn tại trong DB | Thêm cột phone vào parents bằng ALTER TABLE | Fixed |
| 2 | Trang student-detail báo lỗi 500 khi student.parentId = 0 | Câu SQL JOIN parents với parent_id = 0 không có kết quả → NullPointerException | Kiểm tra parentId > 0 trước khi truy vấn Parent | Fixed |
| 3 | Form thêm phụ huynh không gán được parent_id cho student | StudentDAO.updateParentId() chưa tồn tại | Thêm hàm updateParentId() vào StudentDAO | Fixed |
| 4 | TagLib fn:substring() báo lỗi "Cannot resolve" | Thiếu <%@taglib prefix="fn"%> trong JSP | Thêm dòng taglib vào đầu file JSP | Fixed |
| 5 | Cột latitude/longitude không tồn tại trong route_stops → Hibernate validation fail | Thêm field lat/lng vào RouteStop entity nhưng chưa ALTER TABLE | Chạy patch_gps_map.sql trong SSMS | Fixed |

---

# [Phase 05] Testing & Debug

## Ngày thực hiện

```text
Chưa bắt đầu
```

## Đã hoàn thành

- [ ] Viết test case cho Admin module
- [ ] Chạy test chức năng quản lý học sinh
- [ ] Kiểm tra luồng Student-Parent linking
- [ ] Kiểm tra chức năng duyệt đơn xin nghỉ
- [ ] Kiểm tra broadcast notification
- [ ] Kiểm tra phân quyền: chỉ admin mới vào được /admin/*
- [ ] Fix bug phát sinh từ test
- [ ] Ghi nhận kết quả test

## Danh sách lỗi đã xử lý

| STT | Lỗi phát hiện | Nguyên nhân | Cách xử lý | Trạng thái |
|---:|---|---|---|---|
| 1 |  |  |  | Open / Fixed / Pending |
| 2 |  |  |  | Open / Fixed / Pending |

## AI có hỗ trợ không?

- [ ] Có
- [ ] Không

---

# [Phase 06] Hoàn thiện báo cáo và demo

## Ngày thực hiện

```text
Chưa bắt đầu
```

## Đã hoàn thành

- [ ] Hoàn thiện source code Admin module
- [ ] Kiểm tra lại AI_AUDIT_LOG.md
- [ ] Kiểm tra lại PROMPTS.md
- [ ] Hoàn thiện REFLECTION.md
- [ ] Kiểm tra lại CHANGELOG.md
- [ ] Chuẩn bị phần thuyết trình Admin module

## AI có hỗ trợ không?

- [ ] Có
- [ ] Không

---

# 4. Tổng kết thay đổi cuối project

## 4.1. Các chức năng đã hoàn thành

| STT | Chức năng | Trạng thái | Minh chứng | Ghi chú |
|---:|---|---|---|---|
| 1 | Admin Dashboard (thống kê tổng quan) | Completed | Screenshot | |
| 2 | Quản lý Lớp học (CRUD) | Completed | commit | |
| 3 | Quản lý Học sinh (xem theo lớp, chi tiết) | Completed | commit | |
| 4 | Tạo & Gán Phụ huynh từ trang chi tiết học sinh | Completed | commit | Tính năng chính |
| 5 | Cập nhật thông tin Học sinh | Completed | commit | |
| 6 | Quản lý Phụ huynh (danh sách, cập nhật) | Completed | commit | |
| 7 | Quản lý Tài xế (CRUD) | Completed | commit | |
| 8 | Quản lý Xe buýt (CRUD) | Completed | commit | |
| 9 | Quản lý Tuyến đường | Completed | commit | |
| 10 | Quản lý Chuyến đi | Completed | commit | |
| 11 | Xem Điểm danh theo chuyến | Completed | commit | |
| 12 | Gửi thông báo broadcast | Completed | commit | |
| 13 | Duyệt/Từ chối đơn xin nghỉ | Completed | commit | |
| 14 | Xem Phản hồi từ phụ huynh | Completed | commit | |

## 4.2. Các chức năng chưa hoàn thành

| STT | Chức năng | Lý do chưa hoàn thành | Hướng cải thiện |
|---:|---|---|---|
| 1 | Xuất báo cáo Excel (điểm danh, học sinh) | Chưa có thời gian, không có trong yêu cầu cốt lõi | Dùng Apache POI để export .xlsx |
| 2 | Phân quyền chi tiết theo role (ADMIN có nhiều cấp) | Scope hiện tại chỉ có 1 cấp admin | Bổ sung SuperAdmin nếu mở rộng |

## 4.3. Tổng hợp AI hỗ trợ

| Hạng mục | AI có hỗ trợ không? | Mức độ hỗ trợ | Ghi chú |
|---|---|---|---|
| Requirement | Có | Ít | Gợi ý danh sách chức năng |
| Design | Có | Trung bình | Layout dashboard, luồng xử lý |
| Database | Không | — | Tự thiết kế theo SRS |
| Coding | Có | Nhiều | Student-Parent linking, debug |
| Debug | Có | Nhiều | Xác định nguyên nhân bug p.phone |
| Testing | Có | Trung bình | Sinh test case, tự chạy thủ công |
| Report | Không | — | Tự viết |
| Presentation | Không | — | Tự chuẩn bị |

## 4.4. Bài học rút ra

```text
1. Cần đọc kỹ schema DB trước khi hỏi AI — nhiều lỗi phát sinh từ việc
   AI không biết cấu trúc bảng thực tế của mình.
2. Luôn review kết quả AI về mặt bảo mật (GET vs POST, CSRF, SQL Injection).
3. AI tốt nhất ở bước thiết kế luồng và debug — không nên dùng để viết
   toàn bộ code vì sẽ không hiểu và không giải thích được khi bảo vệ.
4. Test case AI sinh ra cần chạy lại thủ công — Expected Output thường
   không khớp với hành vi thực tế của code.
```

## 4.5. Hướng cải thiện tiếp theo

```text
- Thêm chức năng export báo cáo Excel cho Admin.
- Cải thiện UI Dashboard với biểu đồ thống kê (Chart.js).
- Thêm chức năng tìm kiếm và lọc nâng cao cho các trang quản lý.
- Bổ sung pagination cho các danh sách lớn.
```

---

# 5. Cam kết cập nhật Changelog

Sinh viên cam kết rằng nội dung changelog phản ánh đúng các thay đổi đã thực hiện.

| Đại diện sinh viên | Ngày xác nhận |
|---|---|
| Đào Hoàng Ân |  |
