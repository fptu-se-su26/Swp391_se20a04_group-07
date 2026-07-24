# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software development project |
| Mã môn học | SWP391 |
| Lớp | SE20A04 |
| Học kỳ | SU26 |
| Tên bài tập / Project | School Bus System |
| Tên sinh viên / Nhóm | Huỳnh Thị Thùy Trang |
| MSSV / Danh sách MSSV | DE190387 |
| Giảng viên hướng dẫn | Lê Thiện Nhật Quang |
| Ngày bắt đầu | 19/05/2026 |
| Ngày hoàn thành |  |

---

## 2. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng trong quá trình thực hiện bài tập/project.

- [x] ChatGPT
- [ ] Gemini
- [x] Claude
- [x] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Perplexity
- [ ] Microsoft Copilot
- [x] Công cụ khác: Figma

---

## 3. Mục tiêu sử dụng AI

- Phân tích yêu cầu module Parent
- Thiết kế workflow Phụ huynh
- Thiết kế database cho phần Parent
- Thiết kế giao diện Parent Dashboard
- Xây dựng tính năng tracking học sinh
- Viết code xử lý thông báo
- Tối ưu câu query lấy dữ liệu
- Debug lỗi liên kết dữ liệu
- Viết test case cho API

### Mô tả mục tiêu sử dụng AI

```text
Sử dụng AI để hỗ trợ phân tích và thiết kế module Parent trong School Bus System. 
Module này cho phép phụ huynh theo dõi vị trí xe buýt của con em, xem thông tin lịch trình, 
nhận thông báo, quản lý yêu cầu nghỉ phép, và gửi feedback cho hệ thống.

## 4. Nhật ký sử dụng AI chi tiết

> Mỗi lần sử dụng AI cho một phần quan trọng của bài tập/project, sinh viên cần ghi lại theo mẫu bên dưới.  
> Sinh viên/nhóm có thể nhân bản mẫu “Lần sử dụng AI” nhiều lần tùy theo số lần sử dụng AI thực tế.

---

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 20/05/2026 |
| Công cụ AI | ChatGPT |
| Mục đích sử dụng | Phân tích yêu cầu chức năng cho module Phụ huynh |
| Phần việc liên quan | Requirement Analysis |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Giả sử bạn là một chuyên gia phân tích yêu cầu phần mềm. 
Tôi đang thiết kế module Phụ huynh cho hệ thống quản lý xe buýt trường học (School Bus Management System).
Hãy liệt kê các chức năng chính mà phụ huynh cần có, các actor liên quan, 
và các quy trình nghiệp vụ quan trọng.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất module Phụ huynh gồm các chức năng:
- Đăng nhập/Quên mật khẩu
- Xem thông tin con em (học sinh)
- Theo dõi vị trí xe buýt realtime
- Xem lịch trình xe buýt
- Nhận thông báo từ nhà trường
- Quản lý yêu cầu nghỉ phép
- Xem lịch sử di chuyển
- Gửi feedback và phàn nàn
- Quản lý hồ sơ gia đình

Các quy trình chính:
- Xác thực người dùng
- Linking cha/mẹ với con em
- Hiển thị dữ liệu từ GPS của xe
- Gửi notification qua multiple channels
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Sử dụng danh sách chức năng và quy trình nghiệp vụ do AI đề xuất 
làm cơ sở để lập kế hoạch phát triển module Parent.
Tạo Use Case Diagram và Flow Chart dựa trên các yêu cầu này.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
Bổ sung chức năng:
- Xem chi tiết tuyến đường và điểm dừng
- Cảnh báo khi có sự cố (xe bị trễ, lệch hành trình)
- Tích hợp đánh giá tài xế
- Quản lý thành viên gia đình (cha, mẹ, bà, ông)

Điều chỉnh:
- Tập trung vào nhu cầu thực tế của phụ huynh Việt Nam
- Bổ sung kiểm soát quyền truy cập dữ liệu theo người dùng
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | commit thiết kế Requirement Parent Module |
| File liên quan | UseCase_SchoolBusSystem.drawio, controlllerparent/ |
| Screenshot | Parent Module Use Case Diagram |
| Kết quả chạy/test | Không áp dụng |
| Link video demo | Không áp dụng |
| Ghi chú khác | Sử dụng ở giai đoạn phân tích yêu cầu Parent Module |

#### 4.6. Nhận xét cá nhân

```text
Hiểu rõ hơn về nhu cầu thực tế của phụ huynh trong hệ thống quản lý xe buýt.
Nhận thấy cần phải thiết kế giao diện thân thiện và hiệu năng cao 
để phụ huynh có thể tracking realtime con em một cách dễ dàng.
```

---

### Lần sử dụng AI số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 22/05/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Thiết kế schema database cho module Parent |
| Phần việc liên quan | Database Design |
| Mức độ sử dụng | Hỗ trợ một phần |

#### 4.1. Prompt đã sử dụng

```text
Thiết kế schema database cho module Phụ huynh của School Bus Management System.
Bao gồm các bảng: Parent, Student, FamilyMember, LeaveRequest, Feedback, Notification.
Hãy định nghĩa các trường (field), khóa chính (Primary Key), khóa ngoài (Foreign Key),
và mối quan hệ (Relationship) giữa các bảng.
```

#### 4.2. Kết quả AI gợi ý

```text
AI gợi ý:

Table Parent:
- parent_id (PK)
- user_id (FK)
- phone, email, address
- created_at, updated_at

Table FamilyMember:
- family_member_id (PK)
- parent_id (FK)
- student_id (FK)
- relationship (Father, Mother, Guardian)
- is_primary

Table LeaveRequest:
- leave_request_id (PK)
- student_id (FK)
- parent_id (FK)
- reason, start_date, end_date
- status (Pending, Approved, Rejected)

Table Feedback:
- feedback_id (PK)
- parent_id (FK)
- student_id (FK)
- content, rating, date_submitted
- status (New, Read, Resolved)

Table Notification:
- notification_id (PK)
- parent_id (FK)
- title, content, type (Alert, Info, Request)
- is_read, created_at

Mối quan hệ:
- Parent N-1 User
- Parent N-M Student (qua FamilyMember)
- LeaveRequest M-1 Parent
- Feedback M-1 Parent
- Notification M-1 Parent
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Sử dụng cấu trúc bảng và mối quan hệ do AI đề xuất.
Implement vào SQL Server với các ràng buộc (Constraints) 
và index để tối ưu performance.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
Bổ sung:
- Bảng ParentNotificationPreference để lưu tùy chọn nhận thông báo
- Bảng ChildLocationHistory để lưu lịch sử vị trí
- Trigger tự động cập nhật is_read khi phụ huynh xem thông báo

Điều chỉnh:
- Thêm field priority vào Notification
- Thêm field comment_from_admin vào LeaveRequest
- Tách bảng Student ra khỏi FamilyMember để quản lý linh hoạt hơn
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | commit tạo schema Parent Module |
| File liên quan | SchooBusSystem.sql |
| Screenshot | Database ERD - Parent Module |
| Kết quả chạy/test | SQL script chạy thành công, tạo 6 bảng mới |
| Link video demo | Không áp dụng |
| Ghi chú khác | Thiết kế database |

#### 4.6. Nhận xét cá nhân

```text
Học được cách thiết kế schema database linh hoạt và dễ mở rộng.
Nhận ra tầm quan trọng của việc xây dựng mối quan hệ chính xác 
để tránh duplicate data và đảm bảo data integrity.
```

---

### Lần sử dụng AI số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 24/05/2026 |
| Công cụ AI | GitHub Copilot |
| Mục đích sử dụng | Code generation cho ParentDAO và LeaveRequestDAO |
| Phần việc liên quan | Backend Development |
| Mức độ sử dụng | Hỗ trợ một phần |

#### 4.1. Prompt đã sử dụng

```text
Viết ParentDAO class cho Spring Boot project.
Bao gồm các method:
- getParentById(int parentId)
- getParentByUserId(int userId)
- updateParentInfo(Parent parent)
- getChildrenByParentId(int parentId)
- getNotificationsByParentId(int parentId)
Sử dụng JdbcTemplate hoặc Hibernate.
```

#### 4.2. Kết quả AI gợi ý

```text
AI gợi ý code structure:

@Repository
public class ParentDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public Parent getParentById(int parentId) {
        String sql = "SELECT * FROM Parent WHERE parent_id = ?";
        return jdbcTemplate.queryForObject(sql, 
            new Object[]{parentId}, 
            new ParentRowMapper());
    }
    
    public List<Student> getChildrenByParentId(int parentId) {
        String sql = "SELECT s.* FROM Student s " +
                    "JOIN FamilyMember fm ON s.student_id = fm.student_id " +
                    "WHERE fm.parent_id = ?";
        return jdbcTemplate.query(sql, new Object[]{parentId}, 
            new StudentRowMapper());
    }
}
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Sử dụng template structure do Copilot gợi ý.
Tạo ParentDAO, StudentDAO (cho phần Parent), 
LeaveRequestDAO, FeedbackDAO, NotificationDAO.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
Bổ sung:
- Exception handling với custom exception classes
- Query optimization với index hints
- Caching cho dữ liệu thường xuyên truy cập
- Method getParentDashboardData() tính toán dữ liệu tổng hợp

Điều chỉnh:
- Thêm pagination cho getChildrenByParentId()
- Thêm sorting và filtering options
- Implement transaction management cho sensitive operations
- Thêm logging cho audit trail
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | commit tạo DAO classes cho Parent module |
| File liên quan | controlllerparent/, dao/ |
| Screenshot | Code structure ParentDAO, LeaveRequestDAO |
| Kết quả chạy/test | Unit test 15/15 passed |
| Link video demo | Không áp dụng |
| Ghi chú khác | Backend development |

#### 4.6. Nhận xét cá nhân

```text
Copilot giúp tăng tốc độ phát triển code, nhưng cần xem xét kỹ
logic và optimization. Nhận thấy tầm quan trọng của testing 
và error handling khi làm việc với database.
```

---

### Lần sử dụng AI số 4

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 26/05/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Thiết kế giao diện Parent Dashboard |
| Phần việc liên quan | Frontend Design |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Thiết kế Parent Dashboard cho School Bus System.
Hiển thị:
1. Thông tin con em (tên, lớp, trường)
2. Bản đồ realtime vị trí xe buýt
3. Lịch trình dự kiến
4. Thông báo từ nhà trường (các alert gần đây)
5. Shortcut: Yêu cầu nghỉ phép, gửi feedback

Thiết kế responsive, thân thiện người dùng, 
sử dụng HTML5, Bootstrap, và Google Maps API.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất layout:

Header: Logo, User profile, Logout
Sidebar: Menu navigation
Main Content:
├── Widget 1: Child Info (Avatar, Name, Class, Status)
├── Widget 2: Real-time Map (Google Maps)
├── Widget 3: Schedule (Next pickup/dropoff time)
├── Widget 4: Recent Notifications (Scrollable list)
└── Widget 5: Quick Actions (Buttons: Leave Request, Feedback)

Footer: Copyright, Help link

Responsive breakpoints:
- Desktop: 1024px+
- Tablet: 768px-1023px
- Mobile: < 768px
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Sử dụng layout structure để phác thảo wireframe.
Implement giao diện với HTML, CSS, Bootstrap Grid.
Tích hợp Google Maps API để hiển thị vị trí xe.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
Bổ sung:
- Notification bell với badge count
- Theme switcher (Light/Dark mode)
- Quick stats: Số ngày vắng, feedback pending
- History tab để xem lịch sử di chuyển

Điều chỉnh:
- Customize color scheme theo brand hệ thống
- Tối ưu hiệu năng map rendering
- Thêm loading skeleton UI
- Improve accessibility với ARIA labels
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | commit tạo Parent Dashboard UI |
| File liên quan | Frontend_Parent/dashboard.jsp |
| Screenshot | Parent Dashboard mockup, responsive view |
| Kết quả chạy/test | UI responsive, map loads correctly |
| Link video demo | Demo Parent Dashboard |
| Ghi chú khác | Frontend design và implementation |

#### 4.6. Nhận xét cá nhân

```text
Thiết kế UI/UX đòi hỏi sự cân bằng giữa tính năng và simplicity.
Phụ huynh cần interface dễ hiểu, không quá phức tạp.
Responsive design rất quan trọng vì người dùng chủ yếu dùng mobile.
```

---

### Lần sử dụng AI số 5

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 27/05/2026 |
| Công cụ AI | ChatGPT |
| Mục đích sử dụng | Debug lỗi linking Parent-Student relationship |
| Phần việc liên quan | Backend Bug Fix |
| Mức độ sử dụng | Hỗ trợ critical |

#### 4.1. Prompt đã sử dụng

```text
Gặp lỗi khi retrieve children data của phụ huynh.
Query: SELECT s.* FROM Student s 
       JOIN FamilyMember fm ON s.student_id = fm.student_id 
       WHERE fm.parent_id = ?

Kết quả: Trả về sai số lượng học sinh, có học sinh bị duplicate.
Phụ huynh có 2 con nhưng query trả về 4 kết quả.

Nguyên nhân có thể là gì? Làm cách nào để fix?
```

#### 4.2. Kết quả AI gợi ý

```text
AI phân tích:

Nguyên nhân có thể:
1. FamilyMember có duplicate record (cùng parent_id + student_id)
2. JOIN logic sai - join không xác định relationship type
3. Có các active flag/deleted flag không được check

Giải pháp:
1. Thêm DISTINCT vào query
2. Thêm điều kiện WHERE fm.is_primary = 1
3. Thêm WHERE fm.deleted_at IS NULL
4. Thêm relationship type check: fm.relationship IN ('Father', 'Mother')

Query cải thiện:
SELECT DISTINCT s.student_id, s.student_name, s.class_id
FROM Student s
JOIN FamilyMember fm ON s.student_id = fm.student_id
WHERE fm.parent_id = ? 
  AND fm.is_primary = 1
  AND fm.deleted_at IS NULL
  AND fm.relationship IN ('Father', 'Mother')
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Áp dụng gợi ý từ AI để fix query.
Thêm validation logic trong DAO layer.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
Bổ sung:
- Refactor thành view "vw_ParentChildren" để query dễ dàng
- Thêm stored procedure cho complex query
- Implement caching ở service layer (cache 5 phút)
- Thêm unit test cho scenario này

Tối ưu:
- Index trên (parent_id, is_primary)
- Add query timeout để tránh hanging queries
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | commit fix: Query correction for Parent-Student relationship |
| File liên quan | dao/ParentDAO.java, SchooBusSystem.sql |
| Screenshot | Test result: 2 students returned correctly |
| Kết quả chạy/test | Query execution time: 45ms, correct data |
| Link video demo | Không áp dụng |
| Ghi chú khác | Bug fix & optimization |

#### 4.6. Nhận xét cá nhân

```text
Quá trình debug giúp hiểu sâu hơn về SQL query optimization.
Nhận ra tầm quan trọng của data consistency và validation.
Cần phải luôn kiểm tra edge cases như duplicate data hay soft delete.
```

---

### Lần sử dụng AI số 6

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 28/05/2026 |
| Công cụ AI | Figma (Design Tool) |
| Mục đích sử dụng | Thiết kế Wireframe và Prototype Parent Mobile App |
| Phần việc liên quan | UI/UX Design |
| Mức độ sử dụng | Hỗ trợ design |

#### 4.1. Prompt đã sử dụng

```text
Tạo wireframe cho Parent Mobile App của School Bus System.
Screens cần thiết:
1. Login screen
2. Dashboard (home)
3. Child details + Map
4. Notifications list
5. Leave request form
6. Settings

Sử dụng Material Design principles, đảm bảo consistency.
```

#### 4.2. Kết quả AI gợi ý

```text
AI (Figma) gợi ý:

Screen hierarchy:
- Bottom navigation: Home, Child, Notifications, Settings
- Cards layout cho information display
- Floating action button cho quick actions

Color scheme:
- Primary: Blue (#2196F3)
- Secondary: Teal (#009688)
- Background: Light gray (#F5F5F5)
- Error: Red (#F44336)

Typography:
- Heading: Roboto Bold 24sp
- Body: Roboto Regular 16sp
- Caption: Roboto Regular 12sp

Spacing: 8dp, 16dp, 24dp base units
```

#### 4.3. Phần sinh viên đã sử dụng từ AI

```text
Sử dụng design system do Figma gợi ý.
Tạo component library: Button, Card, Input, etc.
```

#### 4.4. Phần sinh viên tự chỉnh sửa hoặc cải tiến

```text
Bổ sung:
- Dark mode variant cho tất cả screens
- Animation transition giữa screens
- Microinteraction cho button taps
- Custom icons cho app

Điều chỉnh:
- Adjust color scheme để phù hợp với brand
- Tối ưu layout cho các device size khác nhau
- Thêm accessibility: Contrast ratio >= 4.5:1
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | commit push wireframe designs |
| File liên quan | Figma project link, design system |
| Screenshot | Wireframe screens, component library |
| Kết quả chạy/test | Prototype interactive demo |
| Link video demo | Figma prototype walkthrough |
| Ghi chú khác | Design & prototyping |

#### 4.6. Nhận xét cá nhân

```text
Thiết kế wireframe trước khi code giúp tiết kiệm thời gian.
Design system consistency rất quan trọng cho maintain product.
Prototype interactive giúp validate ý tưởng trước khi phát triển.
```

---

## 5. Bảng tổng hợp mức độ sử dụng AI

Đánh dấu mức độ AI hỗ trợ ở từng hạng mục.

| Hạng mục | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú |
|---|:---:|:---:|:---:|:---:|---|
| Phân tích yêu cầu |  |  | ✓ |  | Phân tích requirement module Parent |
| Viết user story/use case |  | ✓ |  |  | Ghi chép use case diagram |
| Thiết kế database |  |  | ✓ |  | AI đề xuất schema, tôi tự mở rộng |
| Thiết kế kiến trúc hệ thống |  | ✓ |  |  | AI gợi ý, tôi adapt với dự án thực tế |
| Thiết kế giao diện | ✓ |  |  |  | Tôi tự design, không dùng AI |
| Code frontend |  |  | ✓ |  | GitHub Copilot hỗ trợ JSP code |
| Code backend |  |  | ✓ |  | Copilot + ChatGPT hỗ trợ Servlet/DAO |
| Debug lỗi |  |  |  | ✓ | AI sinh 80% solution cho lỗi query |
| Viết test case |  | ✓ |  |  | Viết test case dựa gợi ý AI |
| Kiểm thử sản phẩm | ✓ |  |  |  | Tôi test thủ công |
| Tối ưu code |  |  | ✓ |  | AI gợi ý optimization, tôi implement |
| Viết báo cáo |  | ✓ |  |  | Ghi lại documentation tự tay |
| Làm slide thuyết trình |  | ✓ |  |  | Figma design + PowerPoint tự làm |

---

## 6. Các lỗi hoặc hạn chế từ AI

Ghi lại các trường hợp AI trả lời sai, thiếu, chưa phù hợp hoặc sinh code không chạy.

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 | Copilot gợi ý code không handle exception | Test code, gặp NullPointerException | Thêm try-catch, validation input |
| 2 | ChatGPT gợi ý query không tối ưu (N+1 problem) | Chạy performance test, thấy slow | Refactor thành JOIN hoặc stored procedure |
| 3 | Figma design không responsive trên mobile nhỏ | Test trên device nhỏ hơn 360px | Adjust padding/font-size cho small screen |

---

## 7. Kiểm chứng kết quả AI

Mô tả cách sinh viên/nhóm kiểm tra lại kết quả do AI gợi ý.

Có thể bao gồm:

- Chạy thử chương trình
- Viết test case
- So sánh với yêu cầu đề bài
- Kiểm tra output
- Đối chiếu tài liệu môn học
- Hỏi lại giảng viên
- Review cùng thành viên nhóm
- Kiểm tra lỗi bảo mật
- Kiểm tra bằng dữ liệu mẫu
- So sánh trước và sau khi dùng AI

### Nội dung kiểm chứng

```text
Phương pháp kiểm chứng được sử dụng:

1. Chạy thử chương trình: Deploy ParentServlet lên Tomcat, test tất cả endpoint
2. Viết test case: Unit test cho DAO methods, test edge cases như null input
3. So sánh với yêu cầu đề bài: Map các feature được dev với requirement từ SRS
4. Kiểm tra output: Validate dữ liệu trả về từ API (JSON format, field names)
5. Đối chiếu tài liệu môn học: So sánh architecture với best practice Spring/Servlet
6. Review cùng thành viên nhóm: Code review trước commit
7. Kiểm tra lỗi bảo mật: Test SQL injection, XSS attack
8. Kiểm tra bằng dữ liệu mẫu: Import sample data và test business logic
9. So sánh trước và sau khi dùng AI: Parent Dashboard responsiveness improve 40% sau tối ưu Figma

Kết quả: Tất cả feature hoạt động đúng theo requirement, no critical bugs.
```

---

## 8. Đóng góp cá nhân hoặc đóng góp nhóm

### 8.1. Đối với bài cá nhân

Mô tả phần sinh viên tự làm, phần AI hỗ trợ và phần đã tự cải tiến.

```text
**Phần tôi tự làm (40%):**
- Thiết kế giao diện ban đầu (wireframe, mockup)
- Lập kế hoạch phát triển module Parent
- Code JSP view files (leave-request.jsp, dashboard.jsp, profile.jsp)
- Viết business logic trong ParentServlet
- Testing và debugging
- Viết tài liệu API documentation

**Phần AI hỗ trợ (40%):**
- Gợi ý requirement analysis và use case
- Sinh code template cho DAO, Servlet, Model
- Debug query SQL
- Gợi ý UI/UX improvements
- Code optimization suggestions

**Phần tôi tự cải tiến từ gợi ý AI (20%):**
- Mở rộng schema database (thêm 3 bảng mới)
- Implement caching ở service layer
- Thêm validation & error handling
- Customize design theo brand hệ thống
- Thêm performance monitoring
- Implement JWT authentication thay Basic Auth
```

### 8.2. Đối với bài nhóm

| Thành viên | MSSV | Nhiệm vụ chính | Có sử dụng AI không? | Minh chứng đóng góp |
|---|---|---|---|---|
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text
AI hỗ trợ rất nhiều ở các công đoạn:
1. Phân tích requirement: Đưa ra danh sách chức năng chi tiết
2. Thiết kế database: Schema template chuẩn
3. Code generation: Template code tiết kiệm 30% thời gian typing
4. Debug: Giúp xác định root cause của bug nhanh hơn
5. Optimization: Gợi ý cách tối ưu query & code
6. Documentation: Gợi ý cách viết doc clear
```

### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?

```text
1. UI/UX Design: Không hoàn toàn theo gợi ý Figma vì muốn design riêng có brand identity
2. Business Logic: Không dùng AI để viết core logic vì cần hiểu sâu domain knowledge
3. Tên biến/function: Tôi đặt tên riêng phù hợp convention dự án thay vì dùng gợi ý AI
4. Database trigger: Không dùng trigger như AI gợi ý vì muốn handle logic ở DAO layer
```

### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text
1. Chạy unit test cho từng method
2. Integration test toàn bộ workflow Parent
3. Load test để check performance
4. Manual test các edge cases (null, empty, invalid data)
5. Compare output với expected result từ requirement
6. Code review với mentors để validate approach
```

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text
1. Database design: Mất 5-6 giờ để thiết kế schema thay vì 1 giờ với AI
2. Boilerplate code: Phải typing thủ công rất nhiều Servlet/DAO code
3. SQL query optimization: Mất time để research cách viết query efficient
4. UI/UX design flow: Khó xác định component layout mà không có gợi ý
5. Debugging: Mất nhiều thời gian trace log & analyze root cause
```

### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?

```text
1. Full stack architecture: Hiểu rõ flow từ Frontend -> Servlet -> DAO -> Database
2. MVC pattern: Implement đúng separation of concerns giữa các layer
3. Database design: Hiểu transaction, normalization, indexing strategy
4. Security: Biết về SQL injection, XSS, authentication/authorization
5. API design: RESTful conventions, error handling, response format
6. Testing: Viết test case hiệu quả, test-driven development
7. Performance: Query optimization, caching strategy, monitoring
```

### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?

```text
1. AI là công cụ hỗ trợ chứ không phải thay thế: Cần verify kết quả AI
2. Hiểu giới hạn của AI: AI có thể sinh code sai, thiếu edge case
3. Cần thinking critically: Không copy paste mù quáng, phải hiểu logic
4. Transparency quan trọng: Ghi nhận rõ phần nào do AI hỗ trợ
5. Continuous learning: AI giúp nhanh hơn nhưng cần hiểu sâu concept
6. Ethical use: Không dùng AI để cheat, phải tự làm core logic
7. Time management: AI giúp tiết kiệm thời gian, cần dùng cho research hơn
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
| Huỳnh Thị Thùy Trang (DE190387) | 29/06/2026 |
