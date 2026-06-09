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

---

### Lần sử dụng AI số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 24/5/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Xác định các method cần thiết cho interface DriverDAO |
| Phần việc liên quan | Backend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Hệ thống School Bus cần quản lý Driver gồm các chức năng: xem danh sách, xem chi tiết, thêm,
sửa, xoá, lấy driver theo userId, lấy driverId theo userId. Tôi nên thiết kế interface DriverDAO
với những method nào?
```

#### 4.2. Kết quả AI gợi ý

```text
AI liệt kê 8 method: getAllDrivers(), getDriverById(), getDriverByUserId(), insertDriver(),
updateDriver(), deleteDriver(), getDriverIdByUserId(), updateDriverProfile().
AI giải thích rõ vai trò từng method và gợi ý thêm searchDriverByName().
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Sử dụng 8 method cốt lõi làm nền tảng thiết kế interface DriverDAO.
Phân biệt rõ 2 trường hợp: Admin dùng getDriverById(driverId) tra theo PK,
Driver tự xem hồ sơ dùng getDriverByUserId(userId) vì Session chỉ lưu userId.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Loại bỏ searchDriverByName() vì thừa — Admin đã có thể lọc trực tiếp trong getAllDrivers()
bằng SQL WHERE hoặc Java Stream, không giải quyết use case thực tế nào trong hệ thống.

Thêm getDriverIdByUserId() như một lookup utility riêng biệt để Servlet dùng sau khi đọc
Session, thay vì phải gọi getDriverByUserId() rồi .getDriverId() — giảm một lần query
không cần thiết trong flow điểm danh.

Quyết định cuối: Giữ đúng 8 method, bỏ searchDriverByName().
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/Swp391_se20a04_group-07.git |
| File liên quan | DriverDAO.java |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác | |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được cách phân tích use case thực tế để lọc các method cần thiết. AI đề xuất nhiều hơn
mức cần — cần tự đánh giá từng method theo đúng use case của hệ thống, tránh phình code
với các hàm không có use case thực.
```

---
### Lần sử dụng AI số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 25/5/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Quyết định dùng INNER JOIN hay LEFT JOIN khi JOIN nhiều bảng |
| Phần việc liên quan | Database / Backend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Trong SQL Server, khi JOIN bảng drivers với bảng vehicles và parent_areas để lấy license_plate
và area_name, nếu một driver chưa được gán vehicle hoặc area, dùng INNER JOIN hay LEFT JOIN?
Ảnh hưởng gì đến kết quả?
```

#### 4.2. Kết quả AI gợi ý

```text
AI giải thích: INNER JOIN sẽ loại bỏ các Driver chưa có vehicle/area khỏi kết quả. LEFT JOIN
sẽ giữ lại tất cả Driver, những trường thiếu trả về NULL. AI khuyến nghị dùng LEFT JOIN cho
các trường hợp optional relationship.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Áp dụng LEFT JOIN cho cả 3 bảng join (parent_areas, vehicles, users) để đảm bảo trang danh
sách luôn hiển thị đầy đủ Driver kể cả driver mới chưa có thông tin.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
AI không đề cập đến việc xử lý NULL trong Java sau khi query — rs.getInt("vehicle_id") khi
NULL có thể gây vấn đề với int primitive. Tự bổ sung: dùng rs.getString() thay vì rs.getInt()
cho các optional field, thêm kiểm tra null trong setAreaNameDisplay() và setVehiclePlateDisplay().
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/Swp391_se20a04_group-07.git |
| File liên quan | DriverDAO.java |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác | |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được rằng AI trả lời đúng câu hỏi được hỏi nhưng không chủ động gợi ý các vấn đề liên
quan (xử lý NULL trong Java). Cần tự nghĩ đến downstream effects của mỗi quyết định kỹ thuật.
```

---

### Lần sử dụng AI số 4

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 28/5/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Kiểm chứng API rs.wasNull() trong JDBC |
| Phần việc liên quan | Backend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Trong JDBC Java, sau khi gọi rs.getInt('vehicle_id') mà giá trị trong DB là NULL, có cách nào
detect được không? AI trước đó gợi ý dùng rs.wasNull() – method này có thực sự tồn tại trong
ResultSet interface không?
```

#### 4.2. Kết quả AI gợi ý

```text
AI xác nhận ResultSet.wasNull() tồn tại trong JDBC API từ Java 1.1, trả về true nếu lần gọi
getXxx() gần nhất đọc giá trị NULL từ DB. AI đưa ví dụ code và khẳng định đây là cách "chuẩn"
để xử lý nullable INT trong JDBC.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Xác nhận API wasNull() tồn tại thông qua kiểm tra Java SE Documentation tại
docs.oracle.com/javase/8/docs/api/java/sql/ResultSet.html.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
⚠️ Phát hiện Oversimplification (Hallucination #1): wasNull() chỉ đáng tin cậy ngay sau lần
gọi getter liền trước — nếu có bất kỳ getter nào khác gọi xen vào giữa, kết quả wasNull() sẽ
bị overwrite. AI không đề cập đến edge case quan trọng này.

Trong DriverDAO, code đọc nhiều cột liên tiếp — nguy cơ bug âm thầm do sai thứ tự gọi getter.

Quyết định: Không dùng wasNull(). Thay bằng cách an toàn hơn: rs.getObject("vehicle_id") != null
để kiểm tra trước, rồi mới gọi rs.getInt("vehicle_id"). Cách này không phụ thuộc thứ tự gọi getter.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/Swp391_se20a04_group-07.git |
| File liên quan | DriverDAO.java |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link video demo | |
| Ghi chú khác | Kiểm chứng: docs.oracle.com/javase/8/docs/api/java/sql/ResultSet.html |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được cách kiểm chứng API qua tài liệu chính thức. AI có thể nói đúng về sự tồn tại của
API nhưng bỏ qua edge case quan trọng. Luôn cần đọc thêm documentation gốc để phát hiện
các gotcha mà AI không đề cập.
```

---

### Lần sử dụng AI số 5

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 28/5/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Quyết định thiết kế model class Driver (thêm field join hay tạo DTO) |
| Phần việc liên quan | Backend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Trong Java, khi design model class Driver mapping với bảng drivers trong DB, nhưng cần hiển thị
thêm area_name (từ bảng parent_areas) và license_plate (từ bảng vehicles), tôi nên thêm những
field đó vào model Driver không? Hay tạo DriverDTO riêng?
```

#### 4.2. Kết quả AI gợi ý

```text
AI gợi ý tạo DriverDTO riêng để tách biệt DB model và View model theo nguyên tắc separation of
concerns. AI giải thích DTO giúp tránh "dirty model" và là pattern phổ biến trong Spring MVC.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Hiểu rõ trade-off giữa clean architecture (DTO) và pragmatic simplicity (thêm field vào model).
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
AI đúng về lý thuyết DTO trong Spring MVC nhưng project dùng Servlet + JSP thuần, không có
Spring. Tạo thêm DTO layer = thêm class, thêm conversion code, thêm điểm lỗi — trong khi Lab
chỉ cần đọc đúng dữ liệu lên JSP. DriverDAO đã đảm nhận map ResultSet → Driver, thêm DTO chỉ
duplicate logic.

Quyết định: Thêm 2 transient field areaNameDisplay và vehiclePlateDisplay trực tiếp vào model
Driver với comment rõ ràng "display only – not persisted". DriverDAO tự set 2 field này sau
khi query JOIN. JSP đọc trực tiếp từ model.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/Swp391_se20a04_group-07.git |
| File liên quan | Driver.java, DriverDAO.java |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác | |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được cách cân nhắc trade-off giữa clean architecture và thực tế dự án. Không phải lúc
nào pattern tốt nhất về lý thuyết cũng phù hợp với context thực tế. Quyết định phải tính
đến quy mô, deadline và công nghệ đang dùng.
```

---

### Lần sử dụng AI số 6

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 30/5/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Kiểm chứng Statement vs PreparedStatement trong JDBC |
| Phần việc liên quan | Backend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Trong JDBC, với câu query SELECT driver_id FROM drivers WHERE user_id = ?, AI gợi ý dùng
Statement thay vì PreparedStatement vì "nhanh hơn cho query đơn giản". Điều này có đúng không?
```

#### 4.2. Kết quả AI gợi ý

```text
AI (lần này) phản bác lại gợi ý trước, xác nhận PreparedStatement luôn an toàn hơn vì tránh
SQL Injection. AI nói Statement chỉ nhanh hơn một chút trong lý thuyết nhưng trên thực tế
hiện đại sự khác biệt không đáng kể. AI khuyến nghị luôn dùng PreparedStatement.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Xác nhận PreparedStatement là lựa chọn đúng về bảo mật, áp dụng thống nhất cho toàn bộ DriverDAO.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
 Phát hiện Logic Error (Hallucination #2): Gợi ý AI lần đầu nói Statement nhanh hơn là SAI
trong bối cảnh có user input — tạo SQL Injection vulnerability nghiêm trọng. AI lần sau đã tự
sửa, nhưng việc AI lần đầu đưa ra gợi ý sai về security là hallucination đáng ghi nhận.

Quyết định: 100% dùng PreparedStatement trong DriverDAO cho mọi query có tham số, kể cả khi
tham số đến từ Session. Đây là quyết định về coding standard và security culture của project.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/Swp391_se20a04_group-07.git |
| File liên quan | DriverDAO.java |
| Screenshot | |
| Kết quả chạy/test | |
| Link video demo |  |
| Ghi chú khác | |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được rằng AI có thể đưa ra gợi ý sai về security, đặc biệt khi gợi ý liên quan đến
performance vs security trade-off. Luôn cần verify các gợi ý liên quan đến bảo mật, không
tin tưởng mù quáng ngay cả khi AI nghe có vẻ tự tin.
```

---

### Lần sử dụng AI số 7

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 1/6/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Debug lỗi JOIN chain sai bảng trung gian trong getAllDrivers() |
| Phần việc liên quan | Database / Backend / Debug |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
SQL của tôi bị sai kết quả khi JOIN: SELECT d.*, u.full_name FROM drivers d LEFT JOIN
parent_areas a ON d.area_id = a.area_id LEFT JOIN users u ON a.user_id = u.user_id. Tại sao
full_name bị NULL hết dù bảng users có dữ liệu?
```

#### 4.2. Kết quả AI gợi ý

```text
AI phát hiện ngay lỗi: users đang được JOIN qua parent_areas.user_id thay vì drivers.user_id.
Đây là lỗi JOIN chain sai bảng trung gian. AI đưa ra câu SQL đúng:
LEFT JOIN users u ON d.user_id = u.user_id.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Root cause được xác định đúng. Áp dụng fix: LEFT JOIN users u ON d.user_id = u.user_id.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
AI chỉ sửa cho trường hợp getAllDrivers() mà không gợi ý kiểm tra các hàm khác có cùng
pattern JOIN. Tự chủ động kiểm tra lại toàn bộ 3 hàm: getAllDrivers(), getDriverById(),
getDriverByUserId() — cả 3 đều mắc lỗi tương tự. Sửa cùng lúc.

Thêm comment trong code ghi rõ sơ đồ quan hệ: drivers.user_id → users.user_id,
drivers.area_id → parent_areas.area_id để ngăn tái phát lỗi.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/Swp391_se20a04_group-07.git|
| File liên quan | DriverDAO.java |
| Screenshot |  |
| Kết quả chạy/test | full_name = NULL cho 5/5 driver trước khi sửa → hiển thị đúng sau khi sửa |
| Link video demo | |
| Ghi chú khác | SQL sai: `LEFT JOIN users u ON a.user_id = u.user_id` → SQL đúng: `LEFT JOIN users u ON d.user_id = u.user_id` |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được rằng khi AI fix một bug, cần tự kiểm tra xem pattern lỗi đó có lặp lại ở chỗ khác
không. AI giải quyết vấn đề được hỏi nhưng không scan toàn bộ codebase — đó là trách nhiệm
của developer.
```

---

### Lần sử dụng AI số 8

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 2/6/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Thiết kế rollback thủ công cho insertDriver() 2 bước |
| Phần việc liên quan | Backend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Trong Java JDBC không dùng Spring, tôi cần insert vào bảng users trước, lấy generated key,
rồi insert vào bảng drivers. Nếu insert drivers thất bại thì phải xóa users vừa tạo. Làm
thế nào để implement rollback thủ công này?
```

#### 4.2. Kết quả AI gợi ý

```text
AI gợi ý 2 cách: (1) Dùng connection.setAutoCommit(false) để bật manual transaction, rollback
nếu lỗi. (2) Rollback thủ công bằng cách gọi DELETE FROM users WHERE user_id = ? nếu bước 2
thất bại. AI ưu tiên cách 1 vì "cleaner".
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Tham khảo cả 2 approach và hiểu rõ trade-off giữa JDBC transaction và manual rollback.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
AI không đề cập đến side effect của cách 1 trong project: DBContext dùng shared connection
field — nếu set autoCommit(false) mà quên reset về true sau đó, toàn bộ các query sau trong
session đó sẽ bị affected. Với kiến trúc shared connection, đây là rủi ro cao.

Quyết định: Chọn cách 2 (manual rollback) vì an toàn hơn với kiến trúc hiện tại. Implement
pattern: int userId = userDAO.insertUserAndReturnId(...); if(userId == -1) return false;
boolean ok = driverDAO.insertDriver(...); if(!ok) { userDAO.deleteUser(userId); return false; }
Wrap trong try-catch-finally để cleanup luôn được gọi. Ghi chú lý do không dùng transaction.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/Swp391_se20a04_group-07.git |
| File liên quan | DriverDAO.java, UserDAO.java |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác | Code pattern: `int userId = userDAO.insertUserAndReturnId(...); if(!ok) { userDAO.deleteUser(userId); }` |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được rằng AI gợi ý pattern tốt về lý thuyết nhưng không biết kiến trúc cụ thể của project.
Cần tự phân tích compatibility của mỗi giải pháp với kiến trúc hiện có trước khi áp dụng.
```

---


## 5. Bảng tổng hợp mức độ sử dụng AI



---

## 6. Các lỗi hoặc hạn chế từ AI


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