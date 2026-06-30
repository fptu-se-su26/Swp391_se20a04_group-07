# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software Development Project |
| Mã môn học | SWP391 |
| Lớp | SE20A04 |
| Học kỳ | SU26 |
| Tên bài tập / Project | School Bus System |
| Tên sinh viên / Nhóm | Đào Hoàng Ân / Group 7 |
| MSSV | DE191015 |
| Giảng viên hướng dẫn | Lê Thiện Nhật Quang |
| Ngày bắt đầu | 19/05/2026 |
| Ngày hoàn thành |  |

---

## 2. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng trong quá trình thực hiện bài tập/project.

- [x] ChatGPT
- [ ] Gemini
- [x] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Perplexity
- [ ] Microsoft Copilot
- [ ] Công cụ khác

---

## 3. Mục tiêu sử dụng AI

- Thiết kế giao diện Admin Dashboard
- Xây dựng luồng quản lý học sinh và gán phụ huynh
- Hỗ trợ debug lỗi phát sinh trong module Admin
- Tối ưu lại các trang JSP Admin
- Viết test case cho chức năng admin
- Kiểm tra logic phân quyền

### Mô tả mục tiêu sử dụng AI

```text
Trong suốt quá trình phát triển Admin Module, tôi sử dụng AI chủ yếu để
hỗ trợ thiết kế giao diện, xây dựng luồng nghiệp vụ phức tạp (như liên kết
học sinh - phụ huynh trực tiếp từ trang chi tiết), debug các lỗi về SQL và
cấu trúc DAO. AI giúp tôi nhanh chóng có định hướng ban đầu, nhưng phần lớn
logic nghiệp vụ thực tế vẫn do tôi tự phân tích và chỉnh sửa cho phù hợp
với database của nhóm.
```

---

## 4. Nhật ký sử dụng AI chi tiết

---

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 25/05/2026 |
| Công cụ AI | ChatGPT |
| Mục đích sử dụng | Lên ý tưởng thiết kế giao diện Admin Dashboard tổng quan |
| Phần việc liên quan | Design / Frontend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Hãy đề xuất giao diện Admin Dashboard cho hệ thống quản lý xe đưa đón học sinh
trường học. Dashboard cần hiển thị: tổng số học sinh, phụ huynh, tài xế,
các chuyến đi trong ngày, thông báo chưa đọc và đơn xin nghỉ chờ duyệt.
Giao diện dùng Bootstrap 5, thiết kế hiện đại, sidebar cố định bên trái.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất layout gồm:
- Sidebar cố định bên trái với menu điều hướng theo nhóm chức năng
- Header topbar với nút thông báo và thông tin user đăng nhập
- Khu vực main content với grid 4 stat card (học sinh, tài xế, phụ huynh, chuyến đi hôm nay)
- Bảng danh sách chuyến đi trong ngày
- Panel thông báo gần đây bên phải
AI cũng gợi ý dùng màu xanh lá (#16a34a) làm màu chủ đạo cho sidebar và các nút hành động.
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Tôi sử dụng cấu trúc layout tổng thể (sidebar + topbar + main content) và ý tưởng
4 stat card làm điểm khởi đầu để xây dựng trang admin-dashboard.jsp.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
- Thay đổi màu sắc sidebar sang gradient tối (#1e293b → #0f172a) cho phù hợp
  với phong cách thiết kế của nhóm.
- Bổ sung thêm stat card "Đơn xin nghỉ chờ duyệt" và "Phụ huynh chưa có học sinh".
- Tách sidebar thành file admin-sidebar.jsp riêng để dùng chung toàn Admin module.
- Tự viết lại toàn bộ CSS inline sang class Tailwind-like phù hợp với codebase.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit tạo admin-dashboard.jsp, admin-sidebar.jsp |
| File liên quan | admin-dashboard.jsp, admin-sidebar.jsp, admin-header.jsp |
| Screenshot | Screenshot giao diện dashboard sau khi hoàn chỉnh |
| Kết quả chạy/test | Dashboard hiển thị đúng dữ liệu từ DB |
| Link video demo | Không áp dụng |
| Ghi chú khác | Giai đoạn UI Design - Admin Module |

#### 4.6. Nhận xét cá nhân

```text
AI giúp tôi nhanh chóng hình dung layout tổng thể thay vì mất nhiều thời gian
phác thảo từ đầu. Tuy nhiên, phần thiết kế chi tiết và viết code thực tế
vẫn phải tự làm để phù hợp với cấu trúc JSP/Servlet của project.
```

---

### Lần sử dụng AI số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 27/05/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Thiết kế luồng liên kết học sinh - phụ huynh trực tiếp từ trang chi tiết |
| Phần việc liên quan | Design / Backend |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
Trong hệ thống School Bus, tôi muốn trang quản lý học sinh có nút "Xem chi tiết"
ở cuối mỗi dòng. Khi bấm vào, mở trang student-detail hiển thị thông tin học sinh
và phần phụ huynh. Nếu học sinh chưa có phụ huynh thì hiện nút "Tạo & Gán Phụ huynh",
click vào sẽ mở form thêm phụ huynh ngay tại trang đó. Sau khi submit, tự động
gán parent_id vào student. Hãy thiết kế luồng này cho Java Servlet + JSP + SQL Server.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất luồng:
1. ManageStudentServlet (GET) → hiển thị danh sách với nút Chi tiết
2. StudentDetailServlet (GET ?id=X) → load student + parent info → forward student-detail.jsp
3. AddParentFromStudentServlet (POST) → tạo user → tạo parent → updateParentId(studentId, parentId) → redirect student-detail?msg=success
AI cũng gợi ý dùng Bootstrap Collapse để form Add Parent ẩn/hiện ngay trong trang,
không cần mở modal riêng, và cần thêm hàm updateParentId() vào StudentDAO.
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Tôi áp dụng toàn bộ luồng 3 servlet mà AI đề xuất: StudentDetailServlet,
AddParentFromStudentServlet, và hàm updateParentId() trong StudentDAO.
Cấu trúc form collapse trong student-detail.jsp cũng dựa trên gợi ý của AI.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
- Phát hiện AI bỏ sót bước xử lý khi email phụ huynh đã tồn tại trong DB:
  cần check trước khi insert User, tôi tự thêm logic kiểm tra trùng email.
- Bổ sung logic khi parent = null thì truyền NULL thay vì 0 vào SQL để tránh lỗi
  FK constraint (parent_id NOT NULL → phải chạy SQL patch trước).
- Tự viết thêm các thông báo lỗi chi tiết (email_exists, parent_failed, invalid_data)
  và xử lý chúng trong JSP bằng JSTL c:if.
- Điều chỉnh CSS modal/collapse cho phù hợp với design chung của Admin module.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit tạo StudentDetailServlet.java, AddParentFromStudentServlet.java |
| File liên quan | StudentDetailServlet.java, AddParentFromStudentServlet.java, student-detail.jsp, StudentDAO.java |
| Screenshot | Giao diện trang student-detail khi có/chưa có phụ huynh |
| Kết quả chạy/test | Tạo phụ huynh và gán vào học sinh thành công |
| Link video demo | Không áp dụng |
| Ghi chú khác | Tính năng quan trọng nhất trong Admin module của tôi |

#### 4.6. Nhận xét cá nhân

```text
Đây là lần AI hỗ trợ hiệu quả nhất trong project. Luồng 3-servlet do AI đề xuất
rõ ràng và đúng hướng. Tuy nhiên tôi phải tự phát hiện và xử lý các edge case
mà AI không đề cập (trùng email, FK constraint, NULL parent_id).
```

---

### Lần sử dụng AI số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 28/05/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Debug lỗi "error=notfound" khi vào trang update-student |
| Phần việc liên quan | Debug |
| Mức độ sử dụng | Hỗ trợ một phần |

#### 4.1. Prompt đã sử dụng

```text
Tôi đang bị lỗi: vào trang update-student thì bị redirect về
manage-students?classId=3&error=notfound. Đây là UpdateStudentServlet.java [paste code]
và StudentDAO.getStudentById() [paste code]. DB của tôi có bảng parents
gồm các cột: parent_id, user_id, address, emergency_phone, area_id.
Tại sao getStudentById() luôn trả null?
```

#### 4.2. Kết quả AI gợi ý

```text
AI phân tích ngay nguyên nhân:
- Trong getStudentById(), câu SQL JOIN có "p.phone AS parent_phone"
  nhưng bảng parents không có cột phone (chỉ có emergency_phone).
- SQL Server ném SQLException → hàm catch exception → trả về null.
- Servlet nhận null → redirect error=notfound.
AI đề xuất 2 cách sửa:
  Cách 1: Thêm cột phone vào bảng parents bằng ALTER TABLE.
  Cách 2: Đổi p.phone thành u.phone (lấy từ bảng users).
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Tôi xác nhận nguyên nhân đúng như AI chỉ ra. Chọn Cách 1 (thêm cột phone
vào parents) vì đơn giản hơn và đồng nhất với logic updateParentPhones()
đã có trong ParentDAO.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
- Tự viết SQL patch: ALTER TABLE parents ADD phone NVARCHAR(20) NULL;
- Đồng thời phát hiện updateParentPhones() trong ParentDAO cũng cần sửa
  (cũng đang UPDATE parents SET phone = ? nhưng cột chưa tồn tại).
- Tự kiểm tra thêm toàn bộ file ParentDAO để tìm các chỗ khác có thể
  bị lỗi tương tự trước khi chạy lại.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit sửa StudentDAO.java, ParentDAO.java |
| File liên quan | StudentDAO.java, ParentDAO.java, patch_add_phone_to_parents.sql |
| Screenshot | Console log trước và sau khi sửa |
| Kết quả chạy/test | Vào trang update-student thành công sau khi chạy SQL patch |
| Link video demo | Không áp dụng |
| Ghi chú khác | Bug quan trọng ảnh hưởng toàn bộ chức năng sửa học sinh |

#### 4.6. Nhận xét cá nhân

```text
AI xác định đúng nguyên nhân gốc rễ nhanh hơn tôi tự debug rất nhiều.
Nhưng việc quyết định sửa theo cách nào và kiểm tra các chỗ liên quan khác
vẫn phải tự làm. Bài học: khi debug, cần cung cấp đầy đủ schema DB cho AI.
```

---

### Lần sử dụng AI số 4

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 01/06/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Tối ưu lại giao diện trang manage-students.jsp |
| Phần việc liên quan | Frontend |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
Tôi có file manage-students.jsp [đính kèm file]. Hãy tối ưu lại giao diện:
- Thêm nút "Chi tiết" ở mỗi dòng học sinh
- Cột Phụ huynh hiển thị badge "Đã có PH" (xanh) / "Chưa có PH" (đỏ) thay vì ID số
- Modal xem chi tiết phụ huynh hiển thị thêm số điện thoại và SĐT khẩn cấp
- Giữ nguyên Bootstrap 5, không thay đổi Servlet
```

#### 4.2. Kết quả AI gợi ý

```text
AI trả về code JSP đã chỉnh sửa với:
- Badge green/red cho cột phụ huynh dùng JSTL c:choose kiểm tra s.parentId > 0
- Nút Chi tiết dùng <a href="student-detail?id=${s.studentId}"> style xanh nhạt
- Modal popup hiển thị thông tin phụ huynh kèm phone và emergencyPhone
- Avatar học sinh dùng div hình tròn hiển thị chữ cái đầu tên
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Sử dụng badge logic (c:choose kiểm tra parentId > 0), nút Chi tiết và cấu trúc
modal popup hiển thị thông tin phụ huynh từ code AI gợi ý.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
- Thêm taglib <%@taglib prefix="fn" uri="jakarta.tags.functions"%> vào đầu file
  để dùng fn:substring() cho avatar (AI quên thêm dòng này).
- Điều chỉnh màu sắc badge và nút cho đồng nhất với admin-sidebar.
- Phát hiện model Student chưa có field parentPhone và emergencyPhone →
  tự thêm 2 field này vào Student.java và cập nhật mapStudent() trong StudentDAO.
- Cập nhật getStudentsByClassId() và getAllStudents() để JOIN lấy phone từ parents.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit cập nhật manage-students.jsp, Student.java, StudentDAO.java |
| File liên quan | manage-students.jsp, Student.java, StudentDAO.java |
| Screenshot | Giao diện manage-students sau khi tối ưu |
| Kết quả chạy/test | Hiển thị đúng badge PH, modal hiển thị đúng SĐT |
| Link video demo | Không áp dụng |
| Ghi chú khác | Cải tiến UX quan trọng cho Admin |

#### 4.6. Nhận xét cá nhân

```text
AI tạo ra code khá tốt nhưng hay bỏ sót các chi tiết nhỏ như import taglib,
hoặc không biết model hiện tại chưa có field nào. Cần tự kiểm tra kỹ trước
khi áp dụng để tránh compile error.
```

---

### Lần sử dụng AI số 5

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 03/06/2026 |
| Công cụ AI | ChatGPT |
| Mục đích sử dụng | Thiết kế chức năng broadcast thông báo đến tất cả user |
| Phần việc liên quan | Backend / Coding |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Trong Admin module của School Bus System (Java Servlet + SQL Server),
tôi cần chức năng Admin gửi thông báo đến tất cả user trong hệ thống.
Hãy thiết kế luồng xử lý từ form gửi → Servlet → DAO → DB.
Bảng notifications: notification_id, user_id, title, message, is_read,
notification_type, created_at.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất:
1. Form POST tại manage-notifications.jsp với title, message, notificationType
2. NotificationServlet (POST /admin/send-notification):
   - Lấy danh sách tất cả userId từ UserDAO.getAllUserIds()
   - Vòng lặp for mỗi userId: gọi NotificationDAO.insert(userId, title, message, type)
3. NotificationDAO.insert() dùng INSERT INTO notifications...
4. Redirect về manage-notifications?msg=sent_success
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Áp dụng luồng tổng thể: form → servlet lấy danh sách user → loop insert.
Cấu trúc NotificationDAO.insertNotification() dựa theo gợi ý của AI.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
- Tối ưu thay vì loop N lần INSERT, tôi tự viết câu SQL dùng
  INSERT INTO notifications SELECT user_id, ?, ?, ?, 0, GETDATE() FROM users
  WHERE status = 1 để chèn 1 lần duy nhất, hiệu quả hơn nhiều.
- Thêm validation: title và message không được rỗng.
- Bổ sung filter chỉ gửi cho user đang active (status = 1).
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit tạo ManageNotificationServlet.java, NotificationDAO.java |
| File liên quan | ManageNotificationServlet.java, NotificationDAO.java, manage-notifications.jsp |
| Screenshot | Giao diện gửi thông báo và danh sách thông báo đã gửi |
| Kết quả chạy/test | Gửi thông báo broadcast thành công đến tất cả user |
| Link video demo | Không áp dụng |
| Ghi chú khác | Tính năng Admin quan trọng |

#### 4.6. Nhận xét cá nhân

```text
AI đưa ra cách làm đúng về mặt logic nhưng không tối ưu về mặt hiệu năng (N lần INSERT).
Việc tự nghĩ ra cách dùng INSERT-SELECT giúp tôi hiểu sâu hơn về SQL.
```

---

### Lần sử dụng AI số 6

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 05/06/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Xây dựng chức năng duyệt/từ chối đơn xin nghỉ |
| Phần việc liên quan | Backend / Coding |
| Mức độ sử dụng | Hỗ trợ một phần |

#### 4.1. Prompt đã sử dụng

```text
Admin cần duyệt đơn xin nghỉ của phụ huynh. Bảng leave_requests có:
leave_request_id, student_id, parent_id, leave_date, reason, status (PENDING/APPROVED/REJECTED), created_at.
Hãy viết Servlet xử lý approve và reject, sau đó tự động gửi notification
cho phụ huynh liên quan về kết quả duyệt.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất ManageLeaveRequestServlet với 2 action:
- action=approve: UPDATE leave_requests SET status='APPROVED' + INSERT notification cho parent
- action=reject:  UPDATE leave_requests SET status='REJECTED' + INSERT notification cho parent
Gợi ý dùng parameter ?action=approve&id=X qua GET request.
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Áp dụng logic 2 action approve/reject và việc tự động gửi notification sau khi duyệt.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
- Đổi từ GET sang POST để tránh CSRF (AI dùng GET không an toàn).
- Bổ sung kiểm tra: chỉ được approve/reject đơn đang ở trạng thái PENDING.
- Tự viết nội dung notification cụ thể hơn, kèm tên học sinh và ngày nghỉ.
- Thêm redirect kèm thông báo thành công/thất bại ra màn hình.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit tạo ManageLeaveRequestServlet.java, LeaveRequestDAO.java |
| File liên quan | ManageLeaveRequestServlet.java, LeaveRequestDAO.java, manage-leave-requests.jsp |
| Screenshot | Trang danh sách đơn xin nghỉ với nút Duyệt/Từ chối |
| Kết quả chạy/test | Duyệt đơn thành công, notification được gửi cho phụ huynh |
| Link video demo | Không áp dụng |
| Ghi chú khác | Tích hợp giữa Leave Request và Notification module |

#### 4.6. Nhận xét cá nhân

```text
AI không nghĩ đến vấn đề bảo mật (dùng GET thay vì POST) — điều này
quan trọng trong môi trường thực tế. Tôi cần luôn review kết quả AI
dưới góc độ bảo mật trước khi áp dụng.
```

---

### Lần sử dụng AI số 7

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 08/06/2026 |
| Công cụ AI | ChatGPT |
| Mục đích sử dụng | Viết test case cho chức năng quản lý học sinh (Admin) |
| Phần việc liên quan | Testing |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
Hãy viết test case cho các chức năng Admin trong hệ thống School Bus:
1. Xem danh sách học sinh theo lớp
2. Xem chi tiết học sinh
3. Tạo và gán phụ huynh cho học sinh
4. Cập nhật thông tin học sinh
Format: TC ID, Chức năng, Mô tả, Input, Expected Output, Actual, Pass/Fail.
```

#### 4.2. Kết quả AI gợi ý

```text
AI tạo bộ 15 test case bao gồm:
- Xem danh sách: lọc đúng classId, không có học sinh, classId không tồn tại
- Xem chi tiết: studentId hợp lệ, không hợp lệ, đã có/chưa có phụ huynh
- Tạo phụ huynh: email mới, email trùng, thiếu trường bắt buộc
- Cập nhật: dữ liệu hợp lệ, dữ liệu rỗng, studentId không tồn tại
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Sử dụng bộ test case của AI làm nền tảng, bổ sung vào file TestCases.xlsx của nhóm.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
- Điều chỉnh Expected Output cho phù hợp với hành vi thực tế của servlet
  (AI một số chỗ mô tả output không đúng với code đã viết).
- Bổ sung thêm 5 test case cho edge case: parent_id = null sau SQL patch,
  email phụ huynh chứa ký tự đặc biệt, tên học sinh rất dài.
- Tự chạy thủ công từng test case và ghi nhận Actual Result.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Không áp dụng |
| File liên quan | SchoolBus_TestCases_Summary.xlsx |
| Screenshot | Screenshot kết quả chạy test case thủ công |
| Kết quả chạy/test | 18/20 test case PASS, 2 FAIL (đã ghi nhận để fix) |
| Link video demo | Không áp dụng |
| Ghi chú khác | Testing Phase - Admin Module |

#### 4.6. Nhận xét cá nhân

```text
AI tạo test case nhanh nhưng không biết chi tiết logic hiện tại của code,
nên Expected Output cần kiểm tra lại cẩn thận. Quan trọng là phải tự chạy
thủ công từng test case thay vì tin vào Expected Output của AI.
```

---

## 5. Bảng tổng hợp mức độ sử dụng AI

| Hạng mục | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú |
|---|:---:|:---:|:---:|:---:|---|
| Phân tích yêu cầu Admin module |  | x |  |  |  |
| Thiết kế giao diện Dashboard |  |  | x |  |  |
| Thiết kế luồng Student-Parent linking |  |  | x |  |  |
| Code StudentDetailServlet |  | x |  |  | Tự viết chính, AI góp ý |
| Code AddParentFromStudentServlet |  |  | x |  |  |
| Code manage-students.jsp |  |  | x |  |  |
| Debug lỗi p.phone |  |  | x |  | AI xác định nguyên nhân |
| Code NotificationServlet |  | x |  |  | Tối ưu SQL tự làm |
| Code LeaveRequestServlet |  | x |  |  |  |
| Viết test case |  |  |  | x | Tự điều chỉnh Expected |
| Tối ưu giao diện manage-students |  |  | x |  |  |
| Viết báo cáo phần Admin |  | x |  |  |  |

---

## 6. Các lỗi hoặc hạn chế từ AI

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 | AI gợi ý dùng GET request cho chức năng duyệt đơn xin nghỉ — không an toàn (CSRF risk) | Tự review code từ góc độ bảo mật | Đổi thành POST với CSRF check |
| 2 | AI quên thêm taglib fn vào JSP khi dùng fn:substring() | Compile error khi chạy trên Tomcat | Tự thêm <%@taglib prefix="fn"%> |
| 3 | AI gợi ý INSERT notification bằng loop N lần — không tối ưu | Review code thấy O(n) queries | Tự viết lại bằng INSERT-SELECT một câu |
| 4 | AI không biết bảng parents thiếu cột phone — gợi ý code sai schema | Chạy lên SQL Server báo "Invalid column name 'phone'" | Tự thêm ALTER TABLE patch |
| 5 | Expected Output trong test case một số chỗ không khớp hành vi servlet thực tế | Chạy thủ công và so sánh | Tự cập nhật lại Expected Output trong TestCases.xlsx |

---

## 7. Kiểm chứng kết quả AI

- Chạy thử chương trình trên Tomcat 10 + SQL Server
- Kiểm tra output trực tiếp trên browser
- Đối chiếu với yêu cầu từ SRS và phân công nhóm
- Review code cùng thành viên nhóm
- Kiểm tra bằng dữ liệu mẫu trong DB
- Hỏi lại giảng viên về logic nghiệp vụ

### Nội dung kiểm chứng

```text
Sau mỗi lần nhận kết quả từ AI, tôi thực hiện:
1. Đọc kỹ code AI trả về trước khi copy — không copy-paste mù quáng.
2. Đối chiếu với schema DB thực tế (tên bảng, tên cột) để phát hiện mismatch.
3. Chạy thử trên localhost:8080 và kiểm tra từng trường hợp.
4. Nếu có lỗi, tự debug trước, nếu không tìm ra mới hỏi AI thêm.
5. Với test case: tự chạy thủ công và ghi nhận Actual Result thay vì tin Expected của AI.
```

---

## 8. Đóng góp cá nhân trong nhóm

| Thành viên | MSSV | Nhiệm vụ chính | Có sử dụng AI không? | Minh chứng đóng góp |
|---|---|---|---|---|
| Trần Quốc Huy | DE200146 | Database Designer, Business Analyst, Tester | Có | commit |
| Kiều Đình Đức | DE201129 | Driver Module, Attendance | Có | commit |
| Đào Hoàng Ân | DE191015 | **Admin Module** (manage student, parent, notification, leave request) | Có | commit |
| Ngô Vương Tùng | DE190390 | Auth Module (login, session, security) | Có | commit |
| Huỳnh Thị Thuỳ Trang | DE190387 | Parent Module (dashboard, tracking, feedback) | Có | commit |

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ tôi ở điểm nào?

```text
AI hỗ trợ tôi hiệu quả nhất ở 2 điểm:
1. Thiết kế luồng nghiệp vụ phức tạp (liên kết học sinh-phụ huynh) — AI cho tôi
   cấu trúc tổng thể để bắt đầu, tiết kiệm rất nhiều thời gian phác thảo.
2. Debug lỗi — khi cung cấp đầy đủ schema DB và code, AI tìm ra nguyên nhân
   nhanh hơn tôi tự mò log nhiều lần.
```

### 9.2. Phần nào tôi không sử dụng theo gợi ý của AI? Vì sao?

```text
- Không dùng cách INSERT notification bằng vòng lặp (dùng INSERT-SELECT thay vì)
  vì kém hiệu quả khi số user lớn.
- Không dùng GET request cho chức năng duyệt đơn vì không an toàn.
- Không áp dụng nguyên xi CSS AI gợi ý vì không đồng nhất với design nhóm.
```

### 9.3. Tôi đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text
Kiểm tra bằng cách chạy thực tế trên Tomcat, đối chiếu schema DB thực tế,
và review code trước khi commit. Với test case, tự chạy thủ công từng case.
```

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text
Khó nhất là thiết kế luồng liên kết học sinh-phụ huynh từ trang chi tiết —
đây là tính năng không có trong các tutorial thông thường và cần suy nghĩ
nhiều về UX flow. AI giúp tôi nhanh chóng có blueprint để bắt đầu.
```

### 9.5. Sau project này, tôi học được gì về môn học?

```text
Hiểu rõ hơn về mô hình MVC trong Java Servlet, cách thiết kế DAO layer,
xử lý FK constraint trong SQL, và tầm quan trọng của việc validate dữ liệu
ở cả phía server trước khi insert vào DB.
```

### 9.6. Sau project này, tôi học được gì về cách sử dụng AI có trách nhiệm?

```text
AI là công cụ mạnh nhưng không thay thế được việc hiểu bài. Tôi học được rằng:
- Phải cung cấp đủ context (schema, code hiện tại) thì AI mới cho kết quả đúng.
- Luôn review kết quả AI về bảo mật và hiệu năng — AI thường ưu tiên đơn giản
  hơn đúng đắn.
- Không nộp nguyên văn code AI — phải hiểu từng dòng để giải thích được khi
  bảo vệ đồ án.
```

---

## 10. Cam kết học thuật

Sinh viên cam kết rằng:

- Nội dung AI hỗ trợ đã được ghi nhận trung thực.
- Không nộp nguyên văn kết quả AI mà không kiểm tra.
- Có khả năng giải thích các phần đã nộp.
- Chịu trách nhiệm về tính đúng đắn của sản phẩm cuối cùng.
- Hiểu rằng việc sử dụng AI không khai báo có thể ảnh hưởng đến kết quả đánh giá.

| Đại diện sinh viên | Ngày xác nhận |
|---|---|
| Đào Hoàng Ân |  |
