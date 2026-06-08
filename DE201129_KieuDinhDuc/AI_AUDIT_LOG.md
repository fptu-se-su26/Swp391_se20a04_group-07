# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software development project |
| Mã môn học | SWP391 |
| Lớp | SE20A04 |
| Học kỳ | SU26 |
| Tên bài tập / Project | School Bus System |
| Tên sinh viên / Nhóm | Kiều Đình Đức |
| MSSV / Danh sách MSSV | DE201129 |
| Giảng viên hướng dẫn | Lê Thiện Nhật Quang |
| Ngày bắt đầu | 19/05/2026 |
| Ngày hoàn thành | |

---

## 2. Công cụ AI đã sử dụng

- [x] Claude
- [x] ChatGPT
- [x] Gemini
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Perplexity
- [ ] Microsoft Copilot
- [ ] Công cụ khác: ....................................

---

## 3. Mục tiêu sử dụng AI

### Mô tả mục tiêu sử dụng AI

```text
- Thiết kế kiến trúc hệ thống (quyết định tổ chức DAO layer)
- Gợi ý ý tưởng giải pháp (thiết kế interface DriverDAO)
- Thiết kế database (quyết định JOIN type, xử lý NULL)
- Debug lỗi (sửa JOIN chain sai bảng trung gian)
- Viết code mẫu (transaction/rollback trong JDBC)
- Kiểm tra bảo mật (PreparedStatement vs Statement)
- Tối ưu code (soft delete, dynamic SQL)
```

---

## 4. Nhật ký sử dụng AI chi tiết

---

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 20/5/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Quyết định tổ chức DAO layer cho module Driver |
| Phần việc liên quan | Backend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Trong Java Web project dùng JDBC thuần (không dùng ORM), nên tổ chức DAO layer cho Driver như thế nào?
Gộp hết vào một DriverDAO hay tách ra DriverProfileDAO, DriverTripDAO riêng biệt?
```

#### 4.2. Kết quả AI gợi ý

```text
AI gợi ý tách ra thành nhiều lớp nhỏ theo Single Responsibility Principle (SRP) để dễ maintain.
AI đưa ra ví dụ kiến trúc với DriverDAO chỉ làm CRUD cơ bản, còn DriverTripDAO lo phần chuyến đi.
AI nói đây là "best practice" trong enterprise Java.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Tham khảo nguyên tắc SRP và ý tưởng phân tách trách nhiệm giữa các lớp DAO.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
AI đúng về lý thuyết SRP nhưng không tính đến quy mô thực tế của project Lab (1 developer,
không có DI container như Spring, Tomcat + JDBC thuần). Tách nhiều lớp sẽ gây overhead không
cần thiết: phải inject nhiều DAO vào Servlet thủ công, dễ circular dependency.

Quyết định: Gộp lại một DriverDAO duy nhất kế thừa DBContext, chỉ tách biệt nếu hàm thuộc
về entity khác (Trip → TripDAO). Phù hợp quy mô Lab, dễ debug, dễ test.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/Swp391_se20a04_group-07.git |
| File liên quan | DriverDAO.java |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link video demo | |
| Ghi chú khác | Module: Driver Management – School Bus System |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được rằng AI thường đưa ra gợi ý theo "best practice" enterprise mà không tính đến context
thực tế (quy mô project, số lượng thành viên, công nghệ đang dùng). Cần tự đánh giá lại gợi
ý của AI trước khi áp dụng. Quyết định kiến trúc phải phù hợp với quy mô, không chỉ đúng về lý thuyết.
```



#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được rằng AI trả lời đúng câu hỏi được hỏi nhưng không chủ động gợi ý các vấn đề liên
quan (xử lý NULL trong Java). Cần tự nghĩ đến downstream effects của mỗi quyết định kỹ thuật.
```





#### 4.6. Nhận xét cá nhân/nhóm

```text

```

---

## 5. Bảng tổng hợp mức độ sử dụng AI

| Hạng mục | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú |
|---|:---:|:---:|:---:|:---:|---|
| Phân tích yêu cầu | | ✓ | | | Tự phân tích use case từ schema thực |
| Viết user story/use case | ✓ | | | | |
| Thiết kế database | | ✓ | | | AI gợi ý JOIN type, tự quyết định schema |
| Thiết kế kiến trúc hệ thống | | ✓ | | | AI gợi ý pattern, tự quyết định theo quy mô |
| Thiết kế giao diện | ✓ | | | | |
| Code frontend | ✓ | | | | |
| Code backend | | ✓ | | | AI gợi ý, tự viết và điều chỉnh toàn bộ code |
| Debug lỗi | | | ✓ | | AI xác định root cause JOIN sai (Entry #007) |
| Viết test case | ✓ | | | | |
| Kiểm thử sản phẩm | ✓ | | | | |
| Tối ưu code | | ✓ | | | AI gợi ý pattern, tự đánh giá và chọn |
| Viết báo cáo | ✓ | | | | |
| Làm slide thuyết trình | ✓ | | | | |

---

## 6. Các lỗi hoặc hạn chế từ AI

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 | **Oversimplification** – `wasNull()` tồn tại nhưng AI bỏ qua edge case thứ tự gọi getter (Entry #004) | Đọc Java SE Documentation gốc tại docs.oracle.com | Thay bằng `rs.getObject("vehicle_id") != null` để tránh phụ thuộc thứ tự |
| 2 | **Logic Error** – AI ban đầu gợi ý `Statement` nhanh hơn `PreparedStatement`, bỏ qua SQL Injection risk (Entry #006) | Kiến thức nền về SQL Injection, sau đó hỏi lại AI để cross-check | Giữ `PreparedStatement` 100% trong toàn bộ DriverDAO |
| 3 | **Context mismatch** – AI thường gợi ý enterprise pattern (DTO, tách DAO, JDBC transaction) không phù hợp với quy mô Lab Servlet/JSP thuần | So sánh gợi ý với thực tế project (không có Spring, 1 developer, deadline ngắn) | Luôn filter gợi ý AI theo quy mô thực tế trước khi áp dụng |

---

## 7. Kiểm chứng kết quả AI

### Nội dung kiểm chứng

```text

```

---

## 8. Đóng góp cá nhân hoặc đóng góp nhóm

### 8.1. Đối với bài cá nhân

```text

```

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text

```

### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?

```text

```

### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text

```

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text

```

### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?

```text

```

### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?

```text

```

---

## 10. Cam kết học thuật

Sinh viên/nhóm cam kết rằng:

- Nội dung AI hỗ trợ đã được ghi nhận trung thực.
- Không nộp nguyên văn kết quả AI mà không kiểm tra.
- Có khả năng giải thích các phần đã nộp.
- Chịu trách nhiệm về tính đúng đắn của sản phẩm cuối cùng.
- Hiểu rằng việc sử dụng AI không khai báo có thể ảnh hưởng đến kết quả đánh giá.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
|  |  |