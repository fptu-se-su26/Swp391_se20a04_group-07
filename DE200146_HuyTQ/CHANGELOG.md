# Changelog

## 1. Quy định ghi Changelog

File này dùng để ghi lại các thay đổi quan trọng trong quá trình thực hiện bài tập, lab, assignment hoặc project.

Nguyên tắc ghi changelog:

- Chỉ ghi những gì đã hoàn thành thật sự.
- Không ghi kế hoạch nếu chưa thực hiện.
- Mỗi thay đổi nên có ngày, nội dung, người thực hiện và minh chứng.
- Nếu có AI hỗ trợ, cần ghi rõ AI đã hỗ trợ phần nào.
- Nếu có commit GitHub, cần ghi link commit.
- Nếu có lỗi đã sửa, cần ghi rõ lỗi, nguyên nhân và cách xử lý.

---

## 2. Thông tin project

| Thông tin | Nội dung |
|---|---|
| Môn học |Software development project  |
| Mã môn học | SWP391 |
| Lớp | SE20A04 |
| Học kỳ | SU26  |
| Tên bài tập / Project | School Bus System |
| Tên sinh viên / Nhóm | Trần Quốc Huy/Group 7 |
| MSSV / Danh sách MSSV | DE200146 |
| Giảng viên hướng dẫn | Lê Thiện Nhật Quang |
| Repository URL |  |
| Ngày bắt đầu | 19/05/2026 |
| Ngày hoàn thành |  |

---

## 3. Tổng quan các phiên bản/giai đoạn

| Phiên bản/Giai đoạn | Thời gian | Nội dung chính | Trạng thái |
|---|---|---|---|
| Phase 01 | 19/05/2026 | Khởi tạo project | Not Started / In Progress / Completed |
| Phase 02 | 20/05/2026 | Phân tích yêu cầu | Not Started / In Progress / Completed |
| Phase 03 | 25/05/2026 | Thiết kế hệ thống | Not Started / In Progress / Completed |
| Phase 04 | 27/05/2026 | Implementation | Not Started / In Progress / Completed |
| Phase 05 | /0/2026 | Testing & Debug | Not Started / In Progress / Completed |
| Phase 06 | /0/2026 | Hoàn thiện báo cáo và demo | Not Started / In Progress / Completed |

---


## 3b. Nhật ký AI hỗ trợ kiến thức theo ngày

> Bên cạnh các lần AI hỗ trợ trực tiếp cho từng Phase (ghi trong mục "AI có hỗ trợ không?" của mỗi Phase), trong suốt project Huy còn thường xuyên hỏi AI để ôn/tra cứu kiến thức nền tảng (Backend, Frontend, Spring Boot, Database SQL) phục vụ việc hiểu và review lại source code, không gắn trực tiếp với một thay đổi/commit cụ thể nào. Bảng dưới đây tổng hợp lại theo ngày (dựa trên trí nhớ, không lưu nguyên văn hội thoại):

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

# [Phase 01] Khởi tạo project

## Ngày thực hiện

```text
DD/MM/YYYY
```

## Đã hoàn thành

- [x] Tạo repository
- [x] Tạo cấu trúc thư mục project
- [x] Tạo file README.md
- [x] Tạo thư mục `docs/`
- [x] Tạo file `AI_AUDIT_LOG.md`
- [x] Tạo file `PROMPTS.md`
- [x] Tạo file `REFLECTION.md`
- [x] Tạo file `CHANGELOG.md`
- [x] Khởi tạo source code ban đầu
- [x] Cài đặt thư viện/công cụ cần thiết
- [x] Cấu hình môi trường chạy project

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Viết tại đây...
```

## Commit/Screenshot minh chứng

```text
Dán link commit, screenshot hoặc mô tả minh chứng tại đây...
```

## Ghi chú

```text
Viết tại đây...
```

---

# [Phase 02] Phân tích yêu cầu

## Ngày thực hiện

```text
DD/MM/YYYY
```

## Đã hoàn thành

- [ ] Xác định problem statement
- [x] Xác định user roles
- [ ] Viết user stories
- [x] Viết use cases
- [x] Xác định functional requirements
- [x] Xác định non-functional requirements
- [x] Xác định business rules
- [x] Xác định acceptance criteria
- [ ] Review yêu cầu với giảng viên/nhóm
- [ ] Chỉnh sửa yêu cầu sau feedback

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Viết tại đây...
```

## Commit/Screenshot minh chứng

```text
Dán link commit, screenshot hoặc mô tả minh chứng tại đây...
```

## Ghi chú

```text
Viết tại đây...
```

---

# [Phase 03] Thiết kế hệ thống

## Ngày thực hiện

```text
DD/MM/YYYY
```

## Đã hoàn thành

- [ ] Thiết kế kiến trúc tổng quan
- [x] Thiết kế database/ERD
- [ ] Thiết kế API
- [x] Thiết kế giao diện/wireframe
- [x] Thiết kế flow xử lý
- [ ] Thiết kế class diagram
- [x] Thiết kế sequence diagram
- [ ] Thiết kế security/authorization flow
- [ ] Review thiết kế
- [ ] Chỉnh sửa thiết kế sau feedback

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## AI có hỗ trợ không?

- [ ] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Viết tại đây...
```

## Commit/Screenshot minh chứng

```text
Dán link commit, screenshot hoặc mô tả minh chứng tại đây...
```

## Ghi chú

```text
Viết tại đây...
```

---

# [Phase 04] Implementation

## Ngày thực hiện

```text
DD/MM/YYYY
```

## Đã hoàn thành

- [x] Tạo project structure
- [x] Cài đặt database connection
- [x] Xây dựng backend
- [x] Xây dựng frontend
- [x] Xây dựng authentication/authorization
- [x] Xử lý CRUD
- [x] Xử lý validation
- [ ] Tích hợp API
- [ ] Xử lý upload/download file
- [ ] Xử lý lỗi
- [x] Tối ưu giao diện
- [ ] Cập nhật README hướng dẫn chạy

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |
| 4 |  |  |  |  |
| 5 |  |  |  |  |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Viết tại đây...
```

## Commit/Screenshot minh chứng

```text
Dán link commit, screenshot hoặc mô tả minh chứng tại đây...
```

## Ghi chú

```text
Viết tại đây...
```

---

# [Phase 05] Testing & Debug

## Ngày thực hiện

```text
DD/MM/YYYY
```

## Đã hoàn thành

- [ ] Viết test case
- [ ] Chạy test chức năng chính
- [ ] Kiểm tra output
- [ ] Kiểm tra validation
- [ ] Kiểm tra lỗi giao diện
- [ ] Kiểm tra lỗi database
- [ ] Kiểm tra phân quyền
- [ ] Kiểm tra bảo mật cơ bản
- [ ] Fix bug
- [ ] Chạy lại sau khi fix bug
- [ ] Ghi nhận kết quả test

## Danh sách lỗi đã xử lý

| STT | Lỗi phát hiện | Nguyên nhân | Cách xử lý | Trạng thái |
|---:|---|---|---|---|
| 1 |  |  |  | Open / Fixed / Pending |
| 2 |  |  |  | Open / Fixed / Pending |
| 3 |  |  |  | Open / Fixed / Pending |
| 4 |  |  |  | Open / Fixed / Pending |
| 5 |  |  |  | Open / Fixed / Pending |

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## AI có hỗ trợ không?

- [ ] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Viết tại đây...
```

## Commit/Screenshot minh chứng

```text
Dán link commit, screenshot hoặc mô tả minh chứng tại đây...
```

## Ghi chú

```text
Viết tại đây...
```

---

# [Phase 06] Hoàn thiện báo cáo và demo

## Ngày thực hiện

```text
DD/MM/YYYY
```

## Đã hoàn thành

- [ ] Hoàn thiện source code
- [ ] Hoàn thiện README.md
- [ ] Hoàn thiện report
- [ ] Hoàn thiện slide
- [ ] Hoàn thiện video demo
- [ ] Kiểm tra lại `AI_AUDIT_LOG.md`
- [ ] Kiểm tra lại `PROMPTS.md`
- [ ] Hoàn thiện `REFLECTION.md`
- [ ] Kiểm tra lại `CHANGELOG.md`
- [ ] Đóng gói bài nộp

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## AI có hỗ trợ không?

- [ ] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Viết tại đây...
```

## Commit/Screenshot minh chứng

```text
Dán link commit, screenshot hoặc mô tả minh chứng tại đây...
```

## Ghi chú

```text
Viết tại đây...
```

---

# 4. Tổng kết thay đổi cuối project

## 4.1. Các chức năng đã hoàn thành

| STT | Chức năng | Trạng thái | Minh chứng | Ghi chú |
|---:|---|---|---|---|
| 1 |  | Completed / Partial / Not Completed |  |  |
| 2 |  | Completed / Partial / Not Completed |  |  |
| 3 |  | Completed / Partial / Not Completed |  |  |
| 4 |  | Completed / Partial / Not Completed |  |  |
| 5 |  | Completed / Partial / Not Completed |  |  |

---

## 4.2. Các chức năng chưa hoàn thành

| STT | Chức năng | Lý do chưa hoàn thành | Hướng cải thiện |
|---:|---|---|---|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |

---

## 4.3. Tổng hợp AI hỗ trợ trong project

| Hạng mục | AI có hỗ trợ không? | Mức độ hỗ trợ | Ghi chú |
|---|---|---|---|
| Requirement | Có / Không | Ít / Trung bình / Nhiều |  |
| Design | Có / Không | Ít / Trung bình / Nhiều |  |
| Database | Có / Không | Ít / Trung bình / Nhiều |  |
| Coding | Có / Không | Ít / Trung bình / Nhiều |  |
| Debug | Có / Không | Ít / Trung bình / Nhiều |  |
| Testing | Có / Không | Ít / Trung bình / Nhiều |  |
| Report | Có / Không | Ít / Trung bình / Nhiều |  |
| Presentation | Có / Không | Ít / Trung bình / Nhiều |  |

---

## 4.4. Bài học rút ra

```text
Viết tại đây...
```

---

## 4.5. Hướng cải thiện tiếp theo

```text
Viết tại đây...
```

---

# 5. Cam kết cập nhật Changelog

Sinh viên/nhóm cam kết rằng nội dung changelog phản ánh đúng các thay đổi đã thực hiện trong quá trình làm bài tập/project.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
|  |  |
