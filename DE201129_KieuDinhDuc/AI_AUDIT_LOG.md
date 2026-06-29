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
 Phát hiện Oversimplification (Hallucination #1): wasNull() chỉ đáng tin cậy ngay sau lần
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


### Lần sử dụng AI số 9

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 6/6/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Quyết định 1 hay 2 hàm update cho Admin và Driver |
| Phần việc liên quan | Backend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Tôi có 2 use case: Admin sửa tất cả thông tin Driver (full_name, birth_year, area_id, vehicle_id,
license_number, experience_years), Driver chỉ tự sửa license_number và experience_years. Nên
viết 1 hàm updateDriver(Driver d) chung hay 2 hàm riêng biệt?
```

#### 4.2. Kết quả AI gợi ý

```text
AI gợi ý dùng 1 hàm updateDriver(Driver d, String[] allowedFields) với danh sách field được
phép sửa, build dynamic SQL từ đó. AI nói đây là pattern "flexible và reusable".
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Hiểu rõ vấn đề cần giải quyết (permission boundary giữa Admin và Driver update).
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Gợi ý AI về dynamic SQL với allowedFields array NGUY HIỂM về security — build SQL động từ
tên cột có nguy cơ SQL Injection nếu không whitelist kỹ. Lại là pattern phức tạp hơn mức
cần cho 2 use case cố định đơn giản.

Quyết định: 2 hàm riêng biệt: updateDriver(Driver d) cho Admin (sửa toàn bộ) và
updateDriverProfile(int driverId, String licenseNumber, int experienceYears) cho Driver.
SQL cố định, không dynamic. Authorization check ở Servlet layer (kiểm tra role trong
Session trước khi gọi đúng hàm DAO). An toàn hơn, dễ đọc hơn, dễ test hơn.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/Swp391_se20a04_group-07.git|
| File liên quan | DriverDAO.java |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác | |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được rằng "flexible và reusable" không phải lúc nào cũng tốt hơn "simple và safe". Với
requirement cố định và rõ ràng, simplicity > flexibility. Dynamic SQL là red flag về bảo mật
cần cân nhắc kỹ.
```

---

### Lần sử dụng AI số 10

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 10/6/2026|
| Công cụ AI | Claude |
| Mục đích sử dụng | Quyết định hard delete hay soft delete cho deleteDriver() |
| Phần việc liên quan | Database / Backend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Trong hệ thống School Bus, nếu xóa một Driver bằng DELETE SQL, các bản ghi trips và attendance
liên quan đến driver đó sẽ bị ảnh hưởng thế nào? Nên dùng hard delete hay soft delete?
```

#### 4.2. Kết quả AI gợi ý

```text
AI giải thích: Hard delete sẽ gây lỗi Foreign Key Constraint nếu bảng trips có FOREIGN KEY
(driver_id) REFERENCES drivers. Soft delete (thêm cột status = 0) được khuyến nghị để giữ
lịch sử. AI gợi ý thêm cột is_deleted vào bảng drivers.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Xác nhận nguy cơ FK Constraint violation khi hard delete. Đồng ý cần soft delete để giữ
lịch sử chuyến đi.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
AI không tính đến chi phí thay đổi khi thêm cột is_deleted: phải ALTER TABLE, update tất cả
query getAllDrivers(), getDriverById() để lọc WHERE is_deleted = 0 — thay đổi lan rộng ảnh
hưởng toàn bộ DAO.

Giải pháp sáng tạo hơn: Soft delete qua User status thay vì thêm column. Disable account User
tương ứng (UPDATE users SET status = 0) thay vì xóa Driver record. Driver bị disable sẽ không
login được, trips history vẫn còn nguyên. Zero schema change, bảo toàn data integrity.

So sánh: Hard DELETE → FK violation. Soft delete (is_deleted) → cần ALTER TABLE + update nhiều
query. Soft delete qua users.status → zero schema change, FK không vi phạm.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | https://github.com/fptu-se-su26/Swp391_se20a04_group-07.git |
| File liên quan | DriverDAO.java, UserDAO.java |
| Screenshot |  |
| Kết quả chạy/test | |
| Link video demo |  |
| Ghi chú khác | Hard DELETE → FK violation; soft delete qua users.status → trips history nguyên vẹn |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Học được cách đánh giá cost of implementation của mỗi giải pháp, không chỉ correctness. AI
đề xuất giải pháp chuẩn nhưng không biết schema hiện tại — developer cần tự tìm giải pháp
phù hợp với context thực tế.
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
Các phương pháp kiểm chứng đã sử dụng trong module Driver:

1. Chạy thử chương trình: Kiểm tra kết quả query trực tiếp trên DB test (5 driver records),
   xác nhận fix JOIN chain (Entry #007) — full_name không còn NULL.

2. So sánh với tài liệu chính thức: Kiểm tra wasNull() API tại Java SE Documentation
   (docs.oracle.com/javase/8/docs/api/java/sql/ResultSet.html) — Entry #004.

3. Kiểm tra output: So sánh danh sách Driver trước/sau khi chuyển từ INNER JOIN sang
   LEFT JOIN — xác nhận Driver mới chưa có vehicle/area vẫn hiển thị đúng.

4. Review code: Tự kiểm tra toàn bộ hàm có JOIN sau khi fix Entry #007 để phát hiện
   lỗi pattern lặp lại trong getDriverById() và getDriverByUserId().

5. Kiểm tra bảo mật: Cross-check gợi ý Statement vs PreparedStatement (Entry #006)
   bằng kiến thức SQL Injection, sau đó hỏi lại AI để xác nhận.

6. So sánh với schema thực: Kiểm tra schema bảng trước khi áp dụng gợi ý soft delete
   của AI (Entry #010) — phát hiện không có cột status trong bảng drivers.
```

---

## 8. Đóng góp cá nhân hoặc đóng góp nhóm

### 8.1. Đối với bài cá nhân

```text
Phần tự làm:
- Phân tích use case thực tế của module Driver từ schema database
- Viết toàn bộ code DriverDAO.java (8 methods), Driver.java model
- Debug và fix lỗi JOIN chain trong cả 3 hàm có JOIN
- Quyết định kiến trúc (1 DriverDAO, không tách, không DTO)
- Implement soft delete qua users.status (giải pháp sáng tạo không theo AI)
- Thêm comment schema mapping trong DriverDAO.java

Phần AI hỗ trợ:
- Gợi ý ban đầu về cấu trúc DAO, method list, JOIN type, transaction pattern
- Debug root cause lỗi JOIN sai bảng trung gian (Entry #007)

Phần tự cải tiến:
- Filter bỏ enterprise pattern không phù hợp quy mô Lab (Entry #001, #005)
- Phát hiện và xử lý 2 hallucination (Entry #004, #006)
- Mở rộng scope fix từ 1 hàm → 3 hàm sau khi AI chỉ fix getAllDrivers() (Entry #007)
- Tìm giải pháp soft delete không cần ALTER TABLE (Entry #010)
```

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text
AI hỗ trợ hiệu quả nhất ở việc: (1) Gợi ý nhanh các pattern và trade-off kiến trúc để tôi
có điểm xuất phát cho quyết định, (2) Debug root cause lỗi JOIN chain sai bảng — AI xác định
vấn đề nhanh hơn tôi tự debug, (3) Liệt kê các phương án giải quyết (transaction vs manual
rollback, DTO vs display field) giúp tôi tư duy có hệ thống hơn.
```

### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?

```text
- Không tách DAO theo SRP (Entry #001): AI không biết project dùng Tomcat + JDBC thuần,
  không có DI container. Tách nhiều lớp gây overhead không cần thiết.
- Không tạo DriverDTO (Entry #005): Over-engineering cho quy mô Lab Servlet/JSP thuần.
- Không dùng JDBC transaction (Entry #008): Kiến trúc shared connection trong DBContext
  khiến setAutoCommit(false) có side effect nguy hiểm.
- Không dùng dynamic SQL với allowedFields (Entry #009): Nguy cơ SQL Injection, phức tạp
  hơn mức cần cho 2 use case cố định.
- Không thêm cột is_deleted (Entry #010): Chi phí ALTER TABLE và update nhiều query quá cao
  so với giải pháp soft delete qua users.status.
```

### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text
Chạy thử trực tiếp trên DB test, đối chiếu với Java SE Documentation gốc (Entry #004),
cross-check bằng kiến thức bảo mật (Entry #006), review code sau khi apply fix để phát hiện
lỗi pattern lặp lại (Entry #007), và so sánh gợi ý AI với schema thực tế của project trước
khi áp dụng (Entry #010).
```

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text
Phần khó nhất sẽ là debug lỗi JOIN chain sai bảng trung gian (Entry #007) — lỗi không gây
exception, chỉ trả về NULL data nên rất khó phát hiện nguyên nhân gốc rễ nếu không có AI
phân tích cấu trúc JOIN. Ngoài ra, việc liệt kê đầy đủ các approach cho transaction/rollback
(Entry #008) cũng sẽ mất nhiều thời gian nghiên cứu tài liệu hơn.
```

### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?

```text
Học được rằng thiết kế DAO layer không chỉ là viết SQL đúng mà còn cần tính đến: quy mô
project, kiến trúc hiện có (DBContext, shared connection), data integrity (FK constraint,
atomic operations), và security (PreparedStatement, authorization). Mỗi quyết định kiến
trúc đều có trade-off cần cân nhắc theo context thực tế, không theo lý thuyết đơn thuần.
```

### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?

```text
AI luôn đưa ra gợi ý dựa trên "best practice" chung mà không biết context cụ thể của project.
Trách nhiệm của developer là: (1) Filter gợi ý theo quy mô và công nghệ thực tế, (2) Verify
các API quan trọng qua documentation gốc, (3) Đặc biệt thận trọng với gợi ý liên quan đến
bảo mật — AI có thể sai về security (Hallucination #2), (4) Khi AI fix một bug, tự scan toàn
bộ codebase để tìm lỗi pattern tương tự thay vì chỉ áp dụng fix được cung cấp.
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