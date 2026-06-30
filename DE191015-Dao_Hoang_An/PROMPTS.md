# Prompt Log

## 1. Thông tin chung

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
| Ngày bắt đầu | 19/05/2026 |
| Ngày cập nhật gần nhất |  |

---

## 2. Mục đích của file Prompt Log

File này dùng để ghi lại các prompt quan trọng đã sử dụng trong quá trình thực hiện phần Admin Module của project School Bus System.

---

## 3. Công cụ AI đã sử dụng

- [x] ChatGPT
- [ ] Gemini
- [x] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Microsoft Copilot
- [ ] Perplexity
- [ ] Công cụ khác

---

## 4. Bảng tổng hợp prompt đã sử dụng

| STT | Ngày | Công cụ AI | Mục đích | Prompt tóm tắt | Kết quả chính | Có sử dụng vào bài không? | Minh chứng |
|---:|---|---|---|---|---|---|---|
| 1 | 25/05/2026 | ChatGPT | Thiết kế UI Admin Dashboard | Đề xuất layout Dashboard với stat card và sidebar | Layout sidebar + topbar + 4 stat card | Có | admin-dashboard.jsp |
| 2 | 27/05/2026 | Claude | Thiết kế luồng Student-Parent linking | Thiết kế luồng 3-servlet gán phụ huynh từ trang chi tiết | StudentDetailServlet, AddParentFromStudentServlet | Có | commit |
| 3 | 28/05/2026 | Claude | Debug lỗi error=notfound | Phân tích nguyên nhân SQLException trong getStudentById | Xác định cột p.phone không tồn tại | Có | patch_add_phone.sql |
| 4 | 01/06/2026 | Claude | Tối ưu UI manage-students.jsp | Thêm nút Chi tiết, badge PH, modal info | Code JSP cải tiến | Có | manage-students.jsp |
| 5 | 03/06/2026 | ChatGPT | Thiết kế chức năng broadcast notification | Luồng gửi thông báo đến tất cả user | NotificationServlet + DAO | Có | commit |
| 6 | 05/06/2026 | Claude | Xây dựng chức năng duyệt đơn xin nghỉ | Luồng approve/reject + tự động gửi notification | ManageLeaveRequestServlet | Có | commit |
| 7 | 08/06/2026 | ChatGPT | Viết test case Admin module | Bộ test case cho quản lý học sinh | 15 test case | Có | TestCases.xlsx |
| 8 | 10/06/2026 | Claude | Thiết kế kiến trúc Spring Boot + React | Đề xuất kiến trúc migrate từ JSP/Servlet | Sơ đồ 5-layer architecture | Có | Tài liệu thiết kế |
| 9 | 12/06/2026 | Claude | Hỏi cách chạy project Spring Boot + React | Hướng dẫn chạy backend/frontend, debug lỗi schema validation | Hướng dẫn chạy mvn + npm | Có | Console log |
| 10 | 15/06/2026 | Claude | Bổ sung GPS tracking cho tài xế | Thiết kế luồng update vị trí realtime cho parent theo dõi | TripLocationServlet + Leaflet map | Có | dashboard.jsp |

---

## 5. Prompt chi tiết

---

### Prompt số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 25/05/2026 |
| Công cụ AI | ChatGPT |
| Mục đích | Thiết kế giao diện Admin Dashboard |
| Phần việc liên quan | Design |
| Mức độ sử dụng | Hỏi ý tưởng |

#### 5.1. Prompt nguyên văn

```text
Hãy đề xuất giao diện Admin Dashboard cho hệ thống quản lý xe đưa đón học sinh
trường học. Dashboard cần hiển thị: tổng số học sinh, phụ huynh, tài xế,
các chuyến đi trong ngày, thông báo chưa đọc và đơn xin nghỉ chờ duyệt.
Giao diện dùng Bootstrap 5, thiết kế hiện đại, sidebar cố định bên trái.
```

#### 5.2. Bối cảnh khi viết prompt

```text
Tôi cần xây dựng trang Dashboard đầu tiên cho Admin Module, chưa có ý tưởng
cụ thể về cách bố trí các thành phần thống kê và menu điều hướng.
```

#### 5.3. Kết quả AI trả về

```text
AI đề xuất layout sidebar bên trái + topbar + main content với 4 stat card
chính (học sinh, tài xế, phụ huynh, chuyến đi hôm nay), bảng danh sách
chuyến đi và panel thông báo gần đây.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng cấu trúc layout tổng thể (sidebar + topbar + main content + 4 stat card)
làm khung cho trang admin-dashboard.jsp.
```

#### 5.5. Phần sinh viên đã chỉnh sửa hoặc cải tiến

```text
Đổi màu sidebar sang gradient tối, bổ sung thêm 2 stat card (đơn xin nghỉ chờ duyệt,
phụ huynh chưa có học sinh), tách sidebar ra file riêng admin-sidebar.jsp để dùng chung.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [x] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit tạo admin-dashboard.jsp |
| File liên quan | admin-dashboard.jsp, admin-sidebar.jsp |
| Screenshot | Giao diện dashboard |
| Kết quả chạy/test | Hiển thị đúng dữ liệu thống kê |
| Link tài liệu/báo cáo | Không áp dụng |
| Ghi chú khác | Giai đoạn UI Design |

#### 5.8. Ghi chú thêm

```text
Prompt khá rõ ràng nhưng tôi cần cung cấp thêm chi tiết về stack công nghệ
(JSP/Servlet, không phải React) để tránh AI gợi ý code không phù hợp.
```

---

### Prompt số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 27/05/2026 |
| Công cụ AI | Claude |
| Mục đích | Thiết kế luồng liên kết Học sinh - Phụ huynh |
| Phần việc liên quan | Design / Coding |
| Mức độ sử dụng | Hỏi sinh code |

#### 5.1. Prompt nguyên văn

```text
Trong hệ thống School Bus, tôi muốn trang quản lý học sinh có nút "Xem chi tiết"
ở cuối mỗi dòng. Khi bấm vào, mở trang student-detail hiển thị thông tin học sinh
và phần phụ huynh. Nếu học sinh chưa có phụ huynh thì hiện nút "Tạo & Gán Phụ huynh",
click vào sẽ mở form thêm phụ huynh ngay tại trang đó. Sau khi submit, tự động
gán parent_id vào student. Hãy thiết kế luồng này cho Java Servlet + JSP + SQL Server.
```

#### 5.2. Bối cảnh khi viết prompt

```text
Đây là yêu cầu cụ thể từ người dùng (qua trao đổi nhóm) về cách tổ chức
chức năng quản lý phụ huynh — không muốn có trang Add Parent riêng biệt
mà phải gắn liền với student, đảm bảo logic gán đúng học sinh.
```

#### 5.3. Kết quả AI trả về

```text
AI đề xuất 3 servlet: StudentDetailServlet (GET), AddParentFromStudentServlet (POST),
và bổ sung hàm updateParentId() vào StudentDAO. Form Add Parent dùng Bootstrap
Collapse để ẩn/hiện ngay trong trang.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ cấu trúc 3-servlet và cơ chế Collapse form vào project thực tế.
```

#### 5.5. Phần sinh viên đã chỉnh sửa hoặc cải tiến

```text
Bổ sung kiểm tra email trùng trước khi tạo User mới, xử lý NULL parent_id
đúng chuẩn SQL Server, viết các thông báo lỗi chi tiết (email_exists,
parent_failed, invalid_data) xử lý bằng JSTL trong JSP.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [x] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit tạo StudentDetailServlet, AddParentFromStudentServlet |
| File liên quan | StudentDetailServlet.java, AddParentFromStudentServlet.java |
| Screenshot | Giao diện trang chi tiết học sinh |
| Kết quả chạy/test | Gán phụ huynh thành công |
| Link tài liệu/báo cáo | Không áp dụng |
| Ghi chú khác | Tính năng cốt lõi của phần tôi |

#### 5.8. Ghi chú thêm

```text
Đây là prompt hiệu quả nhất trong toàn bộ quá trình — vì tôi đã mô tả rất
cụ thể hành vi UX mong muốn (nút ở đâu, điều kiện hiện/ẩn, kết quả sau submit).
```

---

### Prompt số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 28/05/2026 |
| Công cụ AI | Claude |
| Mục đích | Debug lỗi error=notfound khi vào trang update-student |
| Phần việc liên quan | Debug |
| Mức độ sử dụng | Hỏi debug |

#### 5.1. Prompt nguyên văn

```text
Tôi đang bị lỗi: vào trang update-student thì bị redirect về
manage-students?classId=3&error=notfound. Đây là UpdateStudentServlet.java
[paste code] và StudentDAO.getStudentById() [paste code]. DB của tôi có bảng
parents gồm các cột: parent_id, user_id, address, emergency_phone, area_id.
Tại sao getStudentById() luôn trả null?
```

#### 5.2. Bối cảnh khi viết prompt

```text
Trang Update Student bị lỗi không vào được dù dữ liệu trong DB hợp lệ.
Đã thử kiểm tra studentId nhiều lần nhưng vẫn không tìm ra nguyên nhân.
```

#### 5.3. Kết quả AI trả về

```text
AI phân tích nhanh: câu SQL trong getStudentById() có "p.phone AS parent_phone"
nhưng bảng parents (theo schema tôi cung cấp) không có cột phone, chỉ có
emergency_phone → SQLException → catch → trả null → servlet redirect error.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Xác nhận đúng nguyên nhân, áp dụng cách sửa: thêm cột phone vào bảng parents
bằng ALTER TABLE.
```

#### 5.5. Phần sinh viên đã chỉnh sửa hoặc cải tiến

```text
Tự kiểm tra thêm toàn bộ ParentDAO để phát hiện updateParentPhones() cũng
bị lỗi tương tự, viết file SQL patch riêng để chạy 1 lần.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit fix StudentDAO.java, ParentDAO.java |
| File liên quan | StudentDAO.java, ParentDAO.java, patch_add_phone_to_parents.sql |
| Screenshot | Console log lỗi trước khi sửa |
| Kết quả chạy/test | Trang update-student hoạt động bình thường |
| Link tài liệu/báo cáo | Không áp dụng |
| Ghi chú khác | Bug nghiêm trọng, ảnh hưởng nhiều chức năng |

#### 5.8. Ghi chú thêm

```text
Bài học quan trọng: khi hỏi AI debug, PHẢI cung cấp schema DB thật, không
chỉ code. Việc cung cấp đủ context giúp AI tìm ra nguyên nhân ngay lần đầu.
```

---

## 6. Prompt quan trọng nhất

### 6.1. Prompt được chọn

```text
Trong hệ thống School Bus, tôi muốn trang quản lý học sinh có nút "Xem chi tiết"
ở cuối mỗi dòng. Khi bấm vào, mở trang student-detail hiển thị thông tin học sinh
và phần phụ huynh. Nếu học sinh chưa có phụ huynh thì hiện nút "Tạo & Gán Phụ huynh",
click vào sẽ mở form thêm phụ huynh ngay tại trang đó. Sau khi submit, tự động
gán parent_id vào student. Hãy thiết kế luồng này cho Java Servlet + JSP + SQL Server.
```

### 6.2. Vì sao prompt này quan trọng?

```text
Đây là tính năng cốt lõi và phức tạp nhất trong phần Admin Module của tôi —
liên quan đến 3 servlet, 2 DAO, và logic UX đặc biệt (gán phụ huynh ngay tại
trang chi tiết thay vì trang riêng). Nếu không có AI hỗ trợ định hướng ban đầu,
tôi sẽ mất rất nhiều thời gian để tự thiết kế luồng này từ đầu.
```

### 6.3. Kết quả prompt này mang lại

```text
Có được cấu trúc 3-servlet rõ ràng (StudentDetailServlet, AddParentFromStudentServlet,
StudentDAO.updateParentId()) và cơ chế Bootstrap Collapse để hiển thị form ngay
trong trang, không cần điều hướng sang trang khác.
```

### 6.4. Sinh viên đã kiểm tra kết quả như thế nào?

```text
Chạy thử trực tiếp trên Tomcat: tạo học sinh mới chưa có phụ huynh, vào trang
chi tiết, bấm nút tạo & gán, điền form, submit, kiểm tra DB xem parent_id
của student đã được update đúng chưa.
```

### 6.5. Sinh viên đã cải tiến gì từ kết quả AI?

```text
Bổ sung kiểm tra email trùng (AI không đề cập), xử lý đúng kiểu NULL cho
parent_id trong SQL Server (cần ALTER TABLE trước), và viết các thông báo
lỗi chi tiết hiển thị lại cho người dùng.
```

---

## 7. Prompt chưa hiệu quả

### 7.1. Prompt chưa hiệu quả

```text
Hãy đề xuất giao diện Admin Dashboard cho hệ thống quản lý xe đưa đón học sinh
trường học.
```

### 7.2. Vì sao prompt này chưa hiệu quả?

```text
Đây là phiên bản đầu tiên (trước khi tôi viết lại đầy đủ ở Prompt số 1).
Prompt quá ngắn, không nêu rõ công nghệ đang dùng (JSP/Bootstrap, không phải React),
không nêu các thành phần dữ liệu cụ thể cần hiển thị → AI trả về gợi ý chung,
dùng React component và Tailwind class không áp dụng được trực tiếp vào JSP.
```

Nguyên nhân:
- Prompt quá ngắn.
- Thiếu bối cảnh bài toán.
- Không cung cấp ngôn ngữ lập trình/công nghệ đang dùng.

### 7.3. Cách cải thiện prompt

```text
Bổ sung: công nghệ cụ thể (JSP + Bootstrap 5), các thành phần dữ liệu cần
hiển thị cụ thể (số học sinh, phụ huynh, tài xế...), và format code mong muốn.
```

### 7.4. Prompt sau khi cải tiến

```text
Hãy đề xuất giao diện Admin Dashboard cho hệ thống quản lý xe đưa đón học sinh
trường học. Dashboard cần hiển thị: tổng số học sinh, phụ huynh, tài xế,
các chuyến đi trong ngày, thông báo chưa đọc và đơn xin nghỉ chờ duyệt.
Giao diện dùng Bootstrap 5, thiết kế hiện đại, sidebar cố định bên trái.
```

### 7.5. Kết quả sau khi cải tiến prompt

```text
AI trả về code JSP/Bootstrap đúng định dạng có thể áp dụng trực tiếp, layout
sidebar + topbar + stat card rõ ràng và phù hợp với codebase hiện tại.
```

---

## 8. Bài học về cách viết prompt

### 8.1. Khi viết prompt, cần cung cấp thông tin gì để AI trả lời tốt hơn?

```text
- Công nghệ/ngôn ngữ đang dùng cụ thể (Java Servlet, JSP, SQL Server — không
  phải framework hiện đại như Spring Boot/React nếu chưa migrate).
- Schema DB thật (tên bảng, tên cột) khi hỏi về code liên quan đến DB.
- Hành vi UX mong muốn cụ thể (nút ở đâu, điều kiện hiện/ẩn, kết quả sau khi submit).
- Code hiện tại nếu đang hỏi debug, không chỉ mô tả lỗi bằng lời.
```

### 8.2. Đã học được gì về cách đặt câu hỏi cho AI?

```text
Prompt cụ thể và có context đầy đủ luôn cho kết quả tốt hơn prompt ngắn.
Đặc biệt khi hỏi debug, cung cấp schema DB thật giúp AI tìm đúng nguyên nhân
ngay lần đầu thay vì phải hỏi lại nhiều lần.
```

### 8.3. Lần sau sẽ cải thiện prompt như thế nào?

```text
Luôn nêu rõ stack công nghệ ngay từ câu đầu tiên, đính kèm code/schema thật
khi cần debug, và mô tả rõ kết quả mong muốn (input/output cụ thể) thay vì
chỉ nói chung "hãy làm cho tôi".
```

---

## 9. Phân loại prompt đã sử dụng

| Loại prompt | Số lượng | Ví dụ prompt tiêu biểu |
|---|---:|---|
| Prompt phân tích yêu cầu | 1 | Đề xuất chức năng Admin module |
| Prompt giải thích kiến thức | 0 | — |
| Prompt thiết kế giải pháp | 2 | Thiết kế luồng Student-Parent linking |
| Prompt thiết kế database | 0 | — |
| Prompt sinh code mẫu | 3 | StudentDetailServlet, NotificationServlet, LeaveRequestServlet |
| Prompt debug lỗi | 2 | Lỗi error=notfound, lỗi schema validation route_stops |
| Prompt viết test case | 1 | Test case quản lý học sinh |
| Prompt review code | 1 | Tối ưu UI manage-students.jsp |
| Prompt tối ưu code | 1 | Tối ưu INSERT notification |
| Prompt viết báo cáo | 0 | — |
| Prompt khác | 1 | Hướng dẫn migrate Spring Boot + React |

---

## 10. Checklist chất lượng prompt

| Tiêu chí | Đã đạt? | Ghi chú |
|---|:---:|---|
| Prompt có mục tiêu rõ ràng | x | |
| Prompt có đủ bối cảnh | x | Sau khi cải tiến |
| Prompt có nêu công nghệ/ngôn ngữ sử dụng | x | Java Servlet/JSP/SQL Server |
| Prompt có nêu yêu cầu đầu ra | x | |
| Prompt không yêu cầu AI làm toàn bộ bài một cách máy móc | x | |
| Prompt có yêu cầu AI giải thích hoặc phân tích | x | Đặc biệt khi debug |
| Kết quả AI được kiểm tra lại | x | Luôn chạy thử trên Tomcat |
| Kết quả AI được chỉnh sửa trước khi sử dụng | x | |
| Prompt quan trọng được ghi lại đầy đủ | x | |
| Prompt sai/chưa hiệu quả được rút kinh nghiệm | x | |

---

## 11. Cam kết sử dụng prompt minh bạch

Sinh viên cam kết rằng:
- Các prompt quan trọng đã được ghi lại trung thực.
- Không che giấu việc sử dụng AI trong các phần quan trọng của bài.
- Không nộp nguyên văn kết quả AI nếu chưa kiểm tra và chỉnh sửa.
- Có khả năng giải thích các phần đã sử dụng từ AI.
- Chịu trách nhiệm với sản phẩm cuối cùng.

| Đại diện sinh viên | Ngày xác nhận |
|---|---|
| Đào Hoàng Ân |  |
