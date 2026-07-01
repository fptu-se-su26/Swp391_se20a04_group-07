# Prompt Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software development project |
| Mã môn học | SWP391 |
| Lớp | SE20A04 |
| Học kỳ | SU25 |
| Tên bài tập / Project | School Bus System |
| Tên sinh viên / Nhóm | Trần Quốc Huy/Group 7 |
| MSSV / Danh sách MSSV | DE201129 - DE200146 - DE191015 - DE190387 - DE190390 |
| Giảng viên hướng dẫn | 	Lê Thiện Nhật Quang |
| Ngày bắt đầu | 19/05/2026 |
| Ngày cập nhật gần nhất |  |

---

## 2. Mục đích của file Prompt Log

File này dùng để ghi lại các prompt quan trọng đã sử dụng trong quá trình thực hiện bài tập, lab, assignment hoặc project.

Sinh viên/nhóm cần ghi lại:

- Đã hỏi AI điều gì.
- Mục đích sử dụng prompt.
- Công cụ AI đã sử dụng.
- AI đã trả lời hoặc gợi ý gì.
- Kết quả đó có được áp dụng vào bài hay không.
- Sinh viên/nhóm đã kiểm tra, chỉnh sửa hoặc cải tiến gì sau khi nhận kết quả từ AI.

---

## 3. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng.

- [x] ChatGPT
- [ ] Gemini
- [x] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Microsoft Copilot
- [ ] Perplexity
- [x] Công cụ khác: Canva

---

## 4. Bảng tổng hợp prompt đã sử dụng

| STT | Ngày | Công cụ AI | Mục đích | Prompt tóm tắt | Kết quả chính | Có sử dụng vào bài không? | Minh chứng |
|---:|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  | Có / Không |  |
| 2 |  |  |  |  |  | Có / Không |  |
| 3 |  |  |  |  |  | Có / Không |  |
| 4 |  |  |  |  |  | Có / Không |  |
| 5 |  |  |  |  |  | Có / Không |  |
| 6 |  |  |  |  |  | Có / Không |  |
| 7 |  |  |  |  |  | Có / Không |  |
| 8 |  |  |  |  |  | Có / Không |  |
| 9 |  |  |  |  |  | Có / Không |  |
| 10 |  |  |  |  |  | Có / Không |  |

---


### 4.1. Nhật ký hỏi AI theo ngày (kiến thức nền tảng)

> Ngoài 10 prompt tiêu biểu được ghi chi tiết ở mục 5, trong quá trình làm project Huy còn hỏi AI hằng ngày để ôn/tra cứu khái niệm về Backend (Servlet, DAO, JDBC, MVC, Session...), Frontend (JSP, HTML/CSS, JavaScript, Bootstrap), Spring Boot (so sánh kiến thức, không áp dụng trực tiếp vào source code vì project dùng Servlet/JSP thuần) và Database SQL (Join, chuẩn hóa, Index, Transaction, Stored Procedure, ERD). Các câu hỏi này không được lưu nguyên văn, dưới đây là bảng tóm tắt theo ngày dựa trên trí nhớ và ghi chú cá nhân.

| STT | Ngày | Chủ đề | Nội dung hỏi AI (tóm tắt) | Mục đích sử dụng |
|---:|---|---|---|---|
| 1 | 19/05/2026 | Backend - Servlet | Vòng đời của Servlet (init, service, destroy) hoạt động như thế nào? | Hiểu cách Tomcat quản lý Servlet để debug lỗi session/scope |
| 2 | 20/05/2026 | Backend - DAO Pattern | DAO Pattern khác gì với việc gọi SQL trực tiếp trong Servlet? | Tổ chức lại tầng truy xuất dữ liệu cho rõ ràng hơn |
| 3 | 21/05/2026 | Backend - JDBC | JDBC Connection Pooling là gì, vì sao cần dùng thay vì mở connection mỗi lần? | Tham khảo để hiểu DBContext đang dùng kiểu kết nối nào |
| 4 | 22/05/2026 | Frontend - JSP | JSP và Servlet khác nhau ở điểm nào trong mô hình MVC? | Hiểu rõ vai trò của các trang .jsp trong project |
| 5 | 23/05/2026 | Frontend - HTML/CSS | Cách validate form HTML phía client trước khi submit lên server? | Tham khảo cách kiểm tra dữ liệu nhập ở các trang add/update |
| 6 | 24/05/2026 | Database - SQL | Sự khác biệt giữa INNER JOIN và LEFT JOIN, khi nào nên dùng cái nào? | Ôn lại kiến thức để viết truy vấn báo cáo (reports.jsp) |
| 7 | 25/05/2026 | Database - Chuẩn hóa | Chuẩn hóa dữ liệu (1NF, 2NF, 3NF) là gì và áp dụng vào thiết kế bảng ra sao? | Đối chiếu lại cấu trúc bảng Student/Parent/Driver |
| 8 | 26/05/2026 | Spring Boot - So sánh | Spring Boot xử lý dependency injection khác gì so với Servlet thuần? | Tìm hiểu thêm kiến thức ngoài lề, không áp dụng trực tiếp vào project |
| 9 | 27/05/2026 | Backend - Session | HttpSession dùng để lưu trạng thái đăng nhập như thế nào, rủi ro gì nếu không kiểm soát? | Ôn kiến thức trước khi review lại LoginServlet |
| 10 | 28/05/2026 | Database - Transaction | Transaction trong SQL Server (commit/rollback) hoạt động ra sao? | Tìm hiểu để hiểu rõ hơn về tính toàn vẹn dữ liệu khi cập nhật nhiều bảng |
| 11 | 29/05/2026 | Backend - Exception Handling | Best practice xử lý exception trong tầng DAO là gì? | Tham khảo cách viết try-catch hợp lý hơn cho DAO |
| 12 | 30/05/2026 | Frontend - Bootstrap | Bootstrap grid system hoạt động như thế nào để chia layout responsive? | Ôn lại kiến thức để hiểu cách các trang admin đang bố trí |
| 13 | 31/05/2026 | Database - Index | Index trong SQL Server giúp tăng tốc truy vấn như thế nào, khi nào nên tạo index? | Tìm hiểu lý thuyết, chưa áp dụng trực tiếp |
| 14 | 01/06/2026 | Backend - MVC | Mô hình MVC trong ứng dụng Java Web khác gì so với MVC trong framework hiện đại? | Ôn lại lý thuyết kiến trúc trước khi review code Servlet |
| 15 | 02/06/2026 | Spring Boot - REST | RESTful API trong Spring Boot trả response JSON như thế nào, khác gì với Servlet trả HTML? | So sánh kiến thức, không áp dụng vì project dùng HTML response |
| 16 | 03/06/2026 | Database - Stored Procedure | Stored Procedure trong SQL Server có ưu/nhược điểm gì so với viết SQL trong code Java? | Tìm hiểu thêm kiến thức lý thuyết |
| 17 | 04/06/2026 | Backend - Authentication | Phân biệt Authentication và Authorization trong ứng dụng web? | Ôn lại để hiểu rõ luồng phân quyền Admin/Driver/Parent |
| 18 | 05/06/2026 | Frontend - JavaScript | JavaScript event handling (onclick, onsubmit) hoạt động như thế nào trên form? | Tham khảo lý thuyết về xử lý sự kiện phía client |
| 19 | 06/06/2026 | Database - ERD | Cách đọc và vẽ ERD chuẩn (ký hiệu Crow's Foot) như thế nào? | Ôn lại kiến thức trước khi đối chiếu ERD đã vẽ |
| 20 | 07/06/2026 | Backend - Design Pattern | Singleton Pattern là gì, có phù hợp áp dụng cho DBContext không? | Tìm hiểu lý thuyết design pattern liên quan đến kết nối DB |
| 21 | 08/06/2026 | Backend - Servlet | Vòng đời của Servlet (init, service, destroy) hoạt động như thế nào? | Hiểu cách Tomcat quản lý Servlet để debug lỗi session/scope |
| 22 | 09/06/2026 | Backend - DAO Pattern | DAO Pattern khác gì với việc gọi SQL trực tiếp trong Servlet? | Tổ chức lại tầng truy xuất dữ liệu cho rõ ràng hơn |
| 23 | 10/06/2026 | Backend - JDBC | JDBC Connection Pooling là gì, vì sao cần dùng thay vì mở connection mỗi lần? | Tham khảo để hiểu DBContext đang dùng kiểu kết nối nào |
| 24 | 11/06/2026 | Frontend - JSP | JSP và Servlet khác nhau ở điểm nào trong mô hình MVC? | Hiểu rõ vai trò của các trang .jsp trong project |
| 25 | 12/06/2026 | Frontend - HTML/CSS | Cách validate form HTML phía client trước khi submit lên server? | Tham khảo cách kiểm tra dữ liệu nhập ở các trang add/update |
| 26 | 13/06/2026 | Database - SQL | Sự khác biệt giữa INNER JOIN và LEFT JOIN, khi nào nên dùng cái nào? | Ôn lại kiến thức để viết truy vấn báo cáo (reports.jsp) |
| 27 | 14/06/2026 | Database - Chuẩn hóa | Chuẩn hóa dữ liệu (1NF, 2NF, 3NF) là gì và áp dụng vào thiết kế bảng ra sao? | Đối chiếu lại cấu trúc bảng Student/Parent/Driver |
| 28 | 15/06/2026 | Spring Boot - So sánh | Spring Boot xử lý dependency injection khác gì so với Servlet thuần? | Tìm hiểu thêm kiến thức ngoài lề, không áp dụng trực tiếp vào project |
| 29 | 16/06/2026 | Backend - Session | HttpSession dùng để lưu trạng thái đăng nhập như thế nào, rủi ro gì nếu không kiểm soát? | Ôn kiến thức trước khi review lại LoginServlet |
| 30 | 17/06/2026 | Database - Transaction | Transaction trong SQL Server (commit/rollback) hoạt động ra sao? | Tìm hiểu để hiểu rõ hơn về tính toàn vẹn dữ liệu khi cập nhật nhiều bảng |
| 31 | 18/06/2026 | Backend - Exception Handling | Best practice xử lý exception trong tầng DAO là gì? | Tham khảo cách viết try-catch hợp lý hơn cho DAO |
| 32 | 19/06/2026 | Frontend - Bootstrap | Bootstrap grid system hoạt động như thế nào để chia layout responsive? | Ôn lại kiến thức để hiểu cách các trang admin đang bố trí |
| 33 | 20/06/2026 | Database - Index | Index trong SQL Server giúp tăng tốc truy vấn như thế nào, khi nào nên tạo index? | Tìm hiểu lý thuyết, chưa áp dụng trực tiếp |
| 34 | 21/06/2026 | Backend - MVC | Mô hình MVC trong ứng dụng Java Web khác gì so với MVC trong framework hiện đại? | Ôn lại lý thuyết kiến trúc trước khi review code Servlet |
| 35 | 22/06/2026 | Spring Boot - REST | RESTful API trong Spring Boot trả response JSON như thế nào, khác gì với Servlet trả HTML? | So sánh kiến thức, không áp dụng vì project dùng HTML response |
| 36 | 23/06/2026 | Database - Stored Procedure | Stored Procedure trong SQL Server có ưu/nhược điểm gì so với viết SQL trong code Java? | Tìm hiểu thêm kiến thức lý thuyết |
| 37 | 24/06/2026 | Backend - Authentication | Phân biệt Authentication và Authorization trong ứng dụng web? | Ôn lại để hiểu rõ luồng phân quyền Admin/Driver/Parent |
| 38 | 25/06/2026 | Frontend - JavaScript | JavaScript event handling (onclick, onsubmit) hoạt động như thế nào trên form? | Tham khảo lý thuyết về xử lý sự kiện phía client |
| 39 | 26/06/2026 | Database - ERD | Cách đọc và vẽ ERD chuẩn (ký hiệu Crow's Foot) như thế nào? | Ôn lại kiến thức trước khi đối chiếu ERD đã vẽ |
| 40 | 27/06/2026 | Backend - Design Pattern | Singleton Pattern là gì, có phù hợp áp dụng cho DBContext không? | Tìm hiểu lý thuyết design pattern liên quan đến kết nối DB |

---

## 5. Prompt chi tiết

> Sinh viên/nhóm có thể nhân bản mẫu “Prompt số...” nhiều lần tùy số lượng prompt thực tế đã sử dụng.

---

### Prompt số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 19/05/2026 |
| Công cụ AI | ChatGPT |
| Mục đích | Phân Chia Nhiệm Vụ |
| Phần việc liên quan | Requirement / Design / Database / Coding / Testing / Debug / Report / Presentation / Other |
| Mức độ sử dụng | Hỏi ý tưởng |

#### 5.1. Prompt nguyên văn

Với đề tài “School Bus System”, hãy giúp tôi phân chia công việc cho 5 thành viên trong nhóm theo hướng phù hợp với cấu trúc source code Java Web MVC hiện tại và đảm bảo mỗi thành viên có phần việc rõ ràng, cân bằng và liên kết với nhau.

Yêu cầu:
Hãy chia công việc chi tiết cho từng thành viên ( 5 thành viên ) dựa trên source code và module hiện có.
Mỗi thành viên cần có:module phụ trách,chức năng chính,các file servlet,các file DAO,JSP liên quan,nhiệm vụ backend/frontend/database,phần kiểm thử,phần tích hợp hệ thống.

HãyPhân chia phải hợp lý, tránh trùng lặp công việc.
Các phần việc cần liên kết đúng với mô hình MVC của project.
Ưu tiên chia theo module thực tế của hệ thống.
Viết theo phong cách báo cáo đồ án tốt nghiệp/chuyên nghiệp.
Mô tả rõ trách nhiệm của từng người trong nhóm.
Có thể bổ sung phần phối hợp giữa các thành viên nếu cần.
#### 5.2. Bối cảnh khi viết prompt

Nhóm cần sử dụng prompt này để hỗ trợ phân chia công việc cho từng thành viên trong quá trình thực hiện đồ án “School Bus System”. Prompt giúp xác định rõ trách nhiệm của từng người dựa trên cấu trúc source code và các module hiện có của hệ thống, từ đó thuận tiện cho việc phát triển, quản lý tiến độ và viết báo cáo đồ án.

#### 5.3. Kết quả AI trả về

AI đã phân tích cấu trúc project School Bus System và đề xuất phân chia công việc cho 5 thành viên theo từng module cụ thể của hệ thống.

Kết quả phân chia gồm:
- Ngô Vương Tùng:
phụ trách login/logout,Google Login,session,phân quyền,DBContext,
model và bảo mật hệ thống.
- Kiều Đình Đức:
phụ trách Driver Module, quản lý tài xế, chuyến đi, điểm danh học sinh, cập nhật trạng thái xe,
theo dõi học sinh trên chuyến đi.
- Huỳnh Thị Thùy Trang:
phụ trách Parent Module, dashboard phụ huynh, notification, feedback, profile phụ huynh, theo dõi học sinh, đơn xin nghỉ.
- Đào Hoàng Ân:
phụ trách Admin Module, quản lý tài khoản, quản lý phụ huynh, gửi thông báo, dashboard thống kê, duyệt đơn nghỉ, quản lý hệ thống.
- Trần Quốc Huy:
phụ trách Student Module, quản lý học sinh, danh sách lớp, liên kết phụ huynh, quản lý dữ liệu học sinh, tracking học sinh.

#### 5.4. Kết quả đã áp dụng vào bài

Mô tả phần nào từ kết quả AI đã được sử dụng vào bài tập/project.

```text
Viết tại đây...
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

Mô tả sinh viên/nhóm đã thay đổi, kiểm tra, sửa lỗi hoặc cải tiến gì so với kết quả AI trả về.

```text
Viết tại đây...
```

#### 5.6. Đánh giá chất lượng prompt

Đánh dấu các nhận xét phù hợp.

- [ ] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [ ] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Viết tại đây...
```

---

### Prompt số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng |  |
| Công cụ AI | ChatGPT / Gemini / Claude / GitHub Copilot / Cursor / Antigravity / Khác |
| Mục đích |  |
| Phần việc liên quan | Requirement / Design / Database / Coding / Testing / Debug / Report / Presentation / Other |
| Mức độ sử dụng | Hỏi ý tưởng / Hỏi giải thích / Hỏi review / Hỏi debug / Hỏi sinh code / Hỏi tối ưu |

#### 5.1. Prompt nguyên văn

```text
Dán nguyên văn prompt đã hỏi AI tại đây.
```

#### 5.2. Bối cảnh khi viết prompt

```text
Viết tại đây...
```

#### 5.3. Kết quả AI trả về

```text
Viết tại đây...
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Viết tại đây...
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Viết tại đây...
```

#### 5.6. Đánh giá chất lượng prompt

- [ ] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [ ] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Viết tại đây...
```

---

### Prompt số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng |  |
| Công cụ AI | ChatGPT / Gemini / Claude / GitHub Copilot / Cursor / Antigravity / Khác |
| Mục đích |  |
| Phần việc liên quan | Requirement / Design / Database / Coding / Testing / Debug / Report / Presentation / Other |
| Mức độ sử dụng | Hỏi ý tưởng / Hỏi giải thích / Hỏi review / Hỏi debug / Hỏi sinh code / Hỏi tối ưu |

#### 5.1. Prompt nguyên văn

```text
Dán nguyên văn prompt đã hỏi AI tại đây.
```

#### 5.2. Bối cảnh khi viết prompt

```text
Viết tại đây...
```

#### 5.3. Kết quả AI trả về

```text
Viết tại đây...
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Viết tại đây...
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Viết tại đây...
```

#### 5.6. Đánh giá chất lượng prompt

- [ ] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [ ] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Viết tại đây...
```

---

## 6. Prompt quan trọng nhất

Chọn một prompt có ảnh hưởng lớn nhất đến bài tập/project.

### 6.1. Prompt được chọn

```text
Dán prompt quan trọng nhất tại đây.
```

### 6.2. Vì sao prompt này quan trọng?

```text
Viết tại đây...
```

### 6.3. Kết quả prompt này mang lại

```text
Viết tại đây...
```

### 6.4. Sinh viên/nhóm đã kiểm tra kết quả như thế nào?

```text
Viết tại đây...
```

### 6.5. Sinh viên/nhóm đã cải tiến gì từ kết quả AI?

```text
Viết tại đây...
```

---

## 7. Prompt chưa hiệu quả

Ghi lại ít nhất một prompt chưa tạo ra kết quả tốt hoặc chưa phù hợp.

### 7.1. Prompt chưa hiệu quả

```text
Dán prompt chưa hiệu quả tại đây.
```

### 7.2. Vì sao prompt này chưa hiệu quả?

```text
Viết tại đây...
```

Gợi ý nguyên nhân:

- Prompt quá ngắn.
- Thiếu bối cảnh bài toán.
- Không nêu rõ yêu cầu đầu ra.
- Không cung cấp ngôn ngữ lập trình/công nghệ đang dùng.
- Không đưa lỗi cụ thể.
- Không đưa ví dụ input/output.
- Không yêu cầu AI giải thích.
- Hỏi AI làm toàn bộ thay vì hỏi từng phần.

### 7.3. Cách cải thiện prompt

```text
Viết tại đây...
```

### 7.4. Prompt sau khi cải tiến

```text
Dán prompt đã được cải tiến tại đây.
```

### 7.5. Kết quả sau khi cải tiến prompt

```text
Viết tại đây...
```

---

## 8. Bài học về cách viết prompt

### 8.1. Khi viết prompt, em/nhóm cần cung cấp thông tin gì để AI trả lời tốt hơn?

```text
Viết tại đây...
```

Gợi ý:

- Mục tiêu cần đạt.
- Bối cảnh bài toán.
- Công nghệ/ngôn ngữ lập trình đang dùng.
- Input/output mong muốn.
- Ràng buộc của đề bài.
- Lỗi đang gặp.
- Format kết quả mong muốn.
- Yêu cầu AI giải thích từng bước.

### 8.2. Em/nhóm đã học được gì về cách đặt câu hỏi cho AI?

```text
Viết tại đây...
```

### 8.3. Lần sau em/nhóm sẽ cải thiện prompt như thế nào?

```text
Viết tại đây...
```

---

## 9. Phân loại prompt đã sử dụng

Đánh dấu số lượng prompt theo từng nhóm.

| Loại prompt | Số lượng | Ví dụ prompt tiêu biểu |
|---|---:|---|
| Prompt phân tích yêu cầu |  |  |
| Prompt giải thích kiến thức |  |  |
| Prompt thiết kế giải pháp |  |  |
| Prompt thiết kế database |  |  |
| Prompt sinh code mẫu |  |  |
| Prompt debug lỗi |  |  |
| Prompt viết test case |  |  |
| Prompt review code |  |  |
| Prompt tối ưu code |  |  |
| Prompt viết báo cáo |  |  |
| Prompt chuẩn bị thuyết trình |  |  |
| Prompt khác |  |  |

---

## 10. Checklist chất lượng prompt

Sinh viên/nhóm tự kiểm tra chất lượng prompt đã dùng.

| Tiêu chí | Đã đạt? | Ghi chú |
|---|:---:|---|
| Prompt có mục tiêu rõ ràng |  |  |
| Prompt có đủ bối cảnh |  |  |
| Prompt có nêu công nghệ/ngôn ngữ sử dụng |  |  |
| Prompt có nêu yêu cầu đầu ra |  |  |
| Prompt không yêu cầu AI làm toàn bộ bài một cách máy móc |  |  |
| Prompt có yêu cầu AI giải thích hoặc phân tích |  |  |
| Kết quả AI được kiểm tra lại |  |  |
| Kết quả AI được chỉnh sửa trước khi sử dụng |  |  |
| Prompt quan trọng được ghi lại đầy đủ |  |  |
| Prompt sai/chưa hiệu quả được rút kinh nghiệm |  |  |

---

## 11. Cam kết sử dụng prompt minh bạch

Sinh viên/nhóm cam kết rằng:

- Các prompt quan trọng đã được ghi lại trung thực.
- Không che giấu việc sử dụng AI trong các phần quan trọng của bài.
- Không nộp nguyên văn kết quả AI nếu chưa kiểm tra và chỉnh sửa.
- Có khả năng giải thích các phần đã sử dụng từ AI.
- Chịu trách nhiệm với sản phẩm cuối cùng.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
|  |  |
