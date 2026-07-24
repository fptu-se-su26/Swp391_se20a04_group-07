# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software development project |
| Mã môn học | SWP391 |
| Lớp | SE20A04 |
| Học kỳ | SU26 |
| Tên bài tập / Project | School Bus System |
| Tên sinh viên / Nhóm | Ngô Vương Tùng / Group 7 |
| MSSV / Danh sách MSSV | DE190390 |
| Giảng viên hướng dẫn | Lê Thiện Nhật Quang |
| Ngày bắt đầu | 19/05/2026 |
| Ngày hoàn thành |  |

---

## 2. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng trong quá trình thực hiện bài tập/project.

- [x] ChatGPT
- [x] Gemini
- [x] Claude
- [x] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Perplexity
- [ ] Microsoft Copilot
- [x] Công cụ khác: Canva

---

## 3. Mục tiêu sử dụng AI

- Phân tích yêu cầu nghiệp vụ
- Gợi ý luồng xử lý đăng nhập và đăng ký
- Hỗ trợ thiết kế lớp DAO và Servlet
- Debug lỗi liên quan đến JSP và JDBC
- Viết test case cơ bản
- Rà soát điểm yếu bảo mật
- Soạn báo cáo và slide trình bày

### Mô tả mục tiêu sử dụng AI

```text
AI được dùng như một công cụ hỗ trợ tư duy, giúp mình nhanh chóng hình dung hướng giải quyết cho các chức năng chính của hệ thống trước khi triển khai thật sự.
```

## 4. Nhật ký sử dụng AI chi tiết

> Mỗi lần sử dụng AI cho một phần quan trọng của bài tập/project, sinh viên cần ghi lại theo mẫu bên dưới.

---

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 22/05/2026 |
| Công cụ AI | ChatGPT |
| Mục đích sử dụng | Hỗ trợ phân tích luồng chức năng đăng nhập, đăng ký và đổi mật khẩu |
| Phần việc liên quan | Requirement |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng
```text
Hãy phân tích hệ thống quản lý xe buýt trường học theo góc nhìn người phát triển web Java, và gợi ý các chức năng đầu vào cần có cho module đăng nhập, đăng ký và thay đổi mật khẩu.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất các bước xử lý chính như kiểm tra dữ liệu đầu vào, xác thực tài khoản, lưu mật khẩu an toàn và thông báo lỗi rõ ràng cho người dùng.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Nhóm dùng các ý tưởng về luồng xác thực và cách tổ chức thông báo lỗi làm nền cho các Servlet và giao diện đăng nhập.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Mình điều chỉnh lại các điều kiện kiểm tra sao cho phù hợp với cấu trúc project hiện có và thay thế một số đề xuất chung bằng logic riêng dành cho hệ thống của nhóm.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit khởi tạo module xác thực |
| File liên quan | LoginServlet.java, RegisterServlet.java, ForgotPasswordServlet.java |
| Screenshot |  |
| Kết quả chạy/test | Chức năng đăng nhập và đăng ký chạy đúng với dữ liệu mẫu |
| Link video demo | Không áp dụng |
| Ghi chú khác | Requirement và Authentication Flow |

#### 4.6. Nhận xét cá nhân/nhóm

```text
AI giúp mình hiểu rõ hơn cách đặt cấu trúc logic cho các chức năng ban đầu, đặc biệt là phần xác thực người dùng.
```

---

### Lần sử dụng AI số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 24/05/2026 |
| Công cụ AI | GitHub Copilot |
| Mục đích sử dụng | Gợi ý cách xây dựng lớp DAO và cấu trúc kết nối cơ sở dữ liệu |
| Phần việc liên quan | Design |
| Mức độ sử dụng | Hỗ trợ một phần |

#### 4.1. Prompt đã sử dụng

```text
Hãy đề xuất cách tổ chức lớp DBContext, DAO và model cho một ứng dụng Java web có kết nối SQL Server, với các lớp User, Student và Role.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất cách chia lớp theo trách nhiệm rõ ràng: DBContext chịu trách nhiệm kết nối, DAO chứa truy vấn, model chứa dữ liệu.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Mình dùng gợi ý về cách phân lớp và tên phương thức để tạo nền tảng cho các DAO đầu tiên.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Sau đó mình chỉnh sửa lại cách xử lý exception, thêm các phương thức cần thiết và đổi tên biến cho phù hợp với phong cách code của nhóm.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit tạo cấu trúc DAO |
| File liên quan | DBContext.java, UserDAO.java, StudentDAO.java |
| Screenshot |  |
| Kết quả chạy/test | Kết nối cơ sở dữ liệu thành công trên môi trường phát triển |
| Link video demo | Không áp dụng |
| Ghi chú khác | Backend design |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Việc có AI gợi ý cấu trúc ban đầu giúp mình ít bị lạc hướng khi bắt đầu viết code backend.
```

---

### Lần sử dụng AI số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 26/05/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Đề xuất cách thiết kế cơ sở dữ liệu cho vai trò người dùng và học sinh |
| Phần việc liên quan | Database |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
Hãy thiết kế một mô hình dữ liệu cho hệ thống School Bus bao gồm bảng người dùng, vai trò, học sinh, lớp học và quan hệ giữa chúng.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đưa ra các bảng chính như Users, Roles, Students, Classes và gợi ý quan hệ giữa chúng.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Nhóm sử dụng danh sách bảng và mối quan hệ làm cơ sở để ráp ERD ban đầu.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Sau khi xem xét quy trình thực tế, mình bổ sung thêm các trường cần thiết cho việc quản lý học sinh và điều chỉnh một số quan hệ để phù hợp hơn với dữ liệu thực tế.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit cập nhật cấu trúc database |
| File liên quan | SchoolBusSystem.sql |
| Screenshot |  |
| Kết quả chạy/test | Cơ sở dữ liệu tạo và import dữ liệu mẫu thành công |
| Link video demo | Không áp dụng |
| Ghi chú khác | Database Design |

#### 4.6. Nhận xét cá nhân/nhóm

```text
AI giúp mình có nhanh một khung dữ liệu ban đầu, nhưng phải tự điều chỉnh lại vì hệ thống thực tế có nhiều nuance riêng.
```

---

### Lần sử dụng AI số 4

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 27/05/2026 |
| Công cụ AI | ChatGPT |
| Mục đích sử dụng | Hỗ trợ viết mã cho các servlet xử lý đăng ký và đổi mật khẩu |
| Phần việc liên quan | Implementation |
| Mức độ sử dụng | Hỗ trợ một phần |

#### 4.1. Prompt đã sử dụng

```text
Viết đoạn code Java Servlet cho chức năng đổi mật khẩu với kiểm tra mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu mới.
```

#### 4.2. Kết quả AI gợi ý

```text
AI cung cấp logic cơ bản gồm kiểm tra đầu vào, gọi DAO, cập nhật mật khẩu và trả về thông báo phù hợp cho người dùng.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Mình dùng phần logic kiểm tra và xử lý exception như một mẫu ban đầu để triển khai vào dự án.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Mình đổi lại cách hiển thị thông báo, thêm điều kiện kiểm tra dữ liệu và tích hợp với giao diện hiện có để tránh lỗi UX.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit thêm chức năng đổi mật khẩu |
| File liên quan | ChangePasswordServlet.java, change-password.jsp |
| Screenshot |  |
| Kết quả chạy/test | Chức năng đổi mật khẩu hoạt động đúng trong các trường hợp hợp lệ và không hợp lệ |
| Link video demo | Không áp dụng |
| Ghi chú khác | Backend + UI Integration |

#### 4.6. Nhận xét cá nhân/nhóm

```text
AI giúp mình tiết kiệm thời gian khi viết cấu trúc hàm, nhưng phần cuối vẫn phải tự sửa để khớp đúng với hệ thống.
```

---

### Lần sử dụng AI số 5

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 29/05/2026 |
| Công cụ AI | Gemini |
| Mục đích sử dụng | Đề xuất bố cục giao diện cho trang login và dashboard người dùng |
| Phần việc liên quan | Frontend |
| Mức độ sử dụng | Hỗ trợ ý tưởng |

#### 4.1. Prompt đã sử dụng

```text
Hãy đề xuất layout cho trang đăng nhập và dashboard của hệ thống School Bus với phong cách đơn giản, dễ sử dụng và phù hợp cho người dùng học sinh, phụ huynh và tài xế.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất bố cục gồm header, sidebar, nội dung chính và các thẻ chức năng nổi bật cho dashboard.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Mình sử dụng ý tưởng về cách sắp xếp khu vực điều hướng và các card chức năng để xây dựng giao diện ban đầu.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Mình đổi màu sắc, điều chỉnh nội dung và thay thế một số thành phần để phù hợp hơn với yêu cầu thực tế của dự án.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Không áp dụng |
| File liên quan | login.jsp, dashboard.jsp |
| Screenshot |  |
| Kết quả chạy/test | Giao diện hiển thị đúng và có thể tương tác cơ bản |
| Link video demo | Không áp dụng |
| Ghi chú khác | UI Design |

#### 4.6. Nhận xét cá nhân/nhóm

```text
AI giúp mình nhanh chóng có một bố cục ban đầu để bắt đầu làm giao diện, nhưng vẫn cần chỉnh lại theo đúng nhu cầu người dùng.
```

---

### Lần sử dụng AI số 6

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 30/05/2026 |
| Công cụ AI | ChatGPT |
| Mục đích sử dụng | Hỗ trợ debug các lỗi JSP và Servlet liên quan đến session và redirect |
| Phần việc liên quan | Debug |
| Mức độ sử dụng | Hỗ trợ một phần |

#### 4.1. Prompt đã sử dụng

```text
Tôi đang gặp lỗi khi redirect sau khi đăng nhập và session không giữ được giá trị. Hãy giúp tôi kiểm tra nguyên nhân và đề xuất cách sửa.
```

#### 4.2. Kết quả AI gợi ý

```text
AI gợi ý kiểm tra vòng đời session, đường dẫn redirect và cách đặt attribute trước khi chuyển trang.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Mình dùng hướng dẫn này để rà soát lại luồng xử lý giữa servlet và JSP.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Sau khi đối chiếu với code thực, mình xác định lỗi là do cách truyền dữ liệu giữa các trang và chỉnh lại bằng cách dùng session và redirect phù hợp.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit sửa lỗi session và chuyển hướng |
| File liên quan | LoginServlet.java, dashboard.jsp |
| Screenshot |  |
| Kết quả chạy/test | Sau khi sửa, đăng nhập và điều hướng hoạt động ổn định |
| Link video demo | Không áp dụng |
| Ghi chú khác | Debugging |

#### 4.6. Nhận xét cá nhân/nhóm

```text
AI giúp mình giảm thời gian dò lỗi, nhưng vẫn cần tự kiểm tra lại logic để tránh sửa sai nguyên nhân.
```

---

### Lần sử dụng AI số 7

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 31/05/2026 |
| Công cụ AI | Claude |
| Mục đích sử dụng | Rà soát các rủi ro bảo mật liên quan đến xác thực và lưu trữ thông tin người dùng |
| Phần việc liên quan | Security |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
Hãy phân tích các nguy cơ bảo mật phổ biến trong một hệ thống web Java liên quan đến đăng nhập, session và dữ liệu người dùng.
```

#### 4.2. Kết quả AI gợi ý

```text
AI nêu ra các điểm cần chú ý như SQL Injection, XSS, session fixation, và việc lưu mật khẩu dưới dạng text thuần.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Mình dùng danh sách này làm checklist để rà soát lại hệ thống trước khi hoàn thiện.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Mình bổ sung kiểm tra dữ liệu đầu vào, mã hóa mật khẩu và giảm việc lộ thông tin trong các trang lỗi.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit tăng cường bảo mật cho authentication |
| File liên quan | UserDAO.java, User.java, LoginServlet.java |
| Screenshot |  |
| Kết quả chạy/test | Một số điểm bảo mật cơ bản được cải thiện và kiểm tra lại |
| Link video demo | Không áp dụng |
| Ghi chú khác | Security Review |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Nhờ AI, mình nhận ra được nhiều điểm yếu mà ban đầu không để ý đến, đặc biệt là trong phần bảo mật.
```

---

### Lần sử dụng AI số 8

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 02/06/2026 |
| Công cụ AI | ChatGPT |
| Mục đích sử dụng | Viết test case cho các chức năng đăng nhập, đổi mật khẩu và quản lý học sinh |
| Phần việc liên quan | Testing |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
Hãy tạo bộ test case cho chức năng đăng nhập và thay đổi mật khẩu của hệ thống School Bus Management System.
```

#### 4.2. Kết quả AI gợi ý

```text
AI tạo các trường hợp như đăng nhập thành công, sai mật khẩu, tài khoản không tồn tại, nhập trống và đổi mật khẩu không khớp.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Mình dùng bộ test case làm khung để thực hiện kiểm thử thủ công.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Mình bổ sung thêm trường hợp lỗi do session hết hạn và tình huống người dùng nhập dữ liệu không hợp lệ.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Không áp dụng |
| File liên quan | TestCases.xlsx |
| Screenshot |  |
| Kết quả chạy/test | Các test case được thực hiện và ghi nhận kết quả Pass/Fail |
| Link video demo | Không áp dụng |
| Ghi chú khác | Testing Phase |

#### 4.6. Nhận xét cá nhân/nhóm

```text
AI giúp mình có bộ kiểm thử nền tảng nhanh hơn, nhưng vẫn cần tự điều chỉnh để sát với tình huống thật.
```

---

### Lần sử dụng AI số 9

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 04/06/2026 |
| Công cụ AI | GitHub Copilot |
| Mục đích sử dụng | Hỗ trợ kiểm tra chất lượng code và đề xuất cách refactor một số đoạn lặp trong DAO |
| Phần việc liên quan | Code Review |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
Hãy phân tích đoạn code Java trong DAO và đề xuất cách tối ưu các phương thức lặp lại mà không làm thay đổi logic nghiệp vụ.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất tách logic lặp thành các hàm nhỏ hơn, gom các câu truy vấn tương đồng và làm rõ xử lý lỗi.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Mình dùng gợi ý này để cải thiện readability của một số lớp DAO trước khi nộp bài.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Mình quyết định chỉ áp dụng phần phù hợp với dự án và giữ lại những đoạn có ý nghĩa nghiệp vụ riêng để tránh làm mất đi sự rõ ràng của code.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Commit refactor DAO |
| File liên quan | UserDAO.java, StudentDAO.java |
| Screenshot |  |
| Kết quả chạy/test | Code chạy ổn định sau khi chỉnh sửa |
| Link video demo | Không áp dụng |
| Ghi chú khác | Refactoring |

#### 4.6. Nhận xét cá nhân/nhóm

```text
AI hỗ trợ tốt cho việc làm code sạch hơn, nhất là khi mình đã có một cấu trúc ban đầu nhưng chưa tối ưu.
```

---

### Lần sử dụng AI số 10

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 05/06/2026 |
| Công cụ AI | ChatGPT / Canva |
| Mục đích sử dụng | Hỗ trợ viết báo cáo, sắp xếp nội dung slide và chuẩn bị kịch bản trình bày |
| Phần việc liên quan | Report / Presentation |
| Mức độ sử dụng | Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
Hãy giúp tôi xây dựng cấu trúc báo cáo dự án School Bus System, phân chia nội dung cho từng thành viên và đề xuất slide thuyết trình ngắn gọn nhưng đủ ý.
```

#### 4.2. Kết quả AI gợi ý

```text
AI đề xuất cấu trúc báo cáo gồm giới thiệu, phân tích yêu cầu, thiết kế, triển khai, kiểm thử và kết luận, đồng thời gợi ý các câu chữ cho từng phần trình bày.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Mình dùng bố cục và cách diễn đạt làm nền để viết lại báo cáo cho đúng với sản phẩm mà nhóm đã làm.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Nhóm thay đổi nội dung cho sát với thực tế, bổ sung ảnh giao diện và kết quả kiểm thử thật, đồng thời chỉnh lại ngôn ngữ cho tự nhiên hơn.
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Không áp dụng |
| File liên quan | Presentation.pptx, Báo cáo dự án |
| Screenshot |  |
| Kết quả chạy/test | Báo cáo và slide hoàn thiện và có thể dùng cho buổi trình bày |
| Link video demo | Không áp dụng |
| Ghi chú khác | Documentation and Presentation |

#### 4.6. Nhận xét cá nhân/nhóm

```text
AI rút ngắn thời gian chuẩn bị tài liệu, nhưng phần cuối vẫn cần mình tự chỉnh sửa để đảm bảo nội dung phản ánh đúng quá trình làm việc thực tế.
```

---

## 5. Bảng tổng hợp mức độ sử dụng AI

Đánh dấu mức độ AI hỗ trợ ở từng hạng mục.

| Hạng mục | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú |
|---|:---:|:---:|:---:|:---:|---|
| Phân tích yêu cầu |  |  | x |  |  |
| Viết user story/use case |  | x |  |  |  |
| Thiết kế database |  |  | x |  |  |
| Thiết kế kiến trúc hệ thống |  |  | x |  |  |
| Thiết kế giao diện |  | x |  |  |  |
| Code frontend | x |  |  |  |  |
| Code backend |  | x |  |  |  |
| Debug lỗi |  |  | x |  |  |
| Viết test case |  |  |  | x |  |
| Kiểm thử sản phẩm |  | x |  |  |  |
| Tối ưu code |  | x |  |  |  |
| Viết báo cáo |  |  | x |  |  |
| Làm slide thuyết trình |  |  |  | x |  |

---

## 6. Các lỗi hoặc hạn chế từ AI

Ghi lại các trường hợp AI trả lời sai, thiếu, chưa phù hợp hoặc sinh code không chạy.

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 | AI đề xuất cấu trúc DAO khá chung và chưa phản ánh đúng toàn bộ các truy vấn của hệ thống. | Khi áp dụng vào thực tế, một số phương thức không phù hợp với chức năng đang triển khai. | Mình chỉnh lại tên hàm, thêm logic xử lý riêng và kiểm tra kỹ trước khi dùng. |
| 2 | Một số gợi ý giao diện quá chung và chưa phù hợp với mục tiêu của hệ thống quản trị. | Sau khi xem lại, các component chưa tối ưu cho việc điều hướng và hiển thị dữ liệu. | Mình thay đổi bố cục, giảm các mục thừa và điều chỉnh theo ý đồ của project. |
| 3 | AI đôi lúc đưa ra cách debug chưa đủ chi tiết để xác định nguyên nhân thật sự. | Khi thử theo hướng dẫn, lỗi vẫn tồn tại nên cần tự kiểm tra lại log và cấu trúc code. | Mình dùng AI như bước đầu để hướng suy nghĩ rồi tự phân tích sâu hơn. |

---

## 7. Kiểm chứng kết quả AI

- Chạy thử chương trình
- Kiểm tra dữ liệu đầu vào
- So sánh với yêu cầu đề bài
- Đọc lại log lỗi và console
- Review cùng thành viên nhóm
- Thực hiện test case bằng dữ liệu mẫu
- Đối chiếu với quy trình nghiệp vụ

### Nội dung kiểm chứng

```text
Mình kiểm chứng các kết quả từ AI bằng cách chạy lại chức năng, thử trên dữ liệu mẫu, đối chiếu với yêu cầu của đề tài và trao đổi cùng các thành viên trong nhóm trước khi chấp nhận kết quả.
```

---

## 8. Đóng góp cá nhân hoặc đóng góp nhóm

### 8.1. Đối với bài cá nhân

```text
Mình chủ yếu thực hiện các phần liên quan đến backend, kết nối cơ sở dữ liệu và kiểm thử chức năng đăng nhập, đổi mật khẩu và quản lý người dùng.
```

### 8.2. Đối với bài nhóm

| Thành viên | MSSV | Nhiệm vụ chính | Có sử dụng AI không? | Minh chứng đóng góp |
|---|---|---|---|---|
| Ngô Vương Tùng | DE190390 | Backend developer, authentication module, testing | Có | commit |
| Trần Quốc Huy | DE200146 | Database designer, documentation | Có | commit |
| Kiều Đình Đức | DE201129 | Full-stack developer | Có | commit |
| Đào Hoàng Ân | DE191015 | Full-stack developer | Có | commit |
| Huỳnh Thị Thuỳ Trang | DE190387 | Full-stack developer | Có | commit |

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text
AI giúp mình rút ngắn thời gian trong việc hình dung giải pháp, viết code mẫu và kiểm tra sơ bộ các vấn đề thường gặp. Điều đó giúp mình tập trung nhiều hơn vào việc chỉnh sửa và kết nối các phần với nhau.
```

### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?

```text
Một số đề xuất của AI khá chung nên mình không dùng nguyên bản mà chỉ chọn phần phù hợp. Những phần liên quan đến nghiệp vụ thực tế và cấu trúc hệ thống của nhóm thì mình tự quyết định lại.
```

### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text
Mình kiểm tra bằng cách chạy thử chức năng, thử các trường hợp đầu vào, đối chiếu với yêu cầu bài tập và trao đổi với các thành viên khác trước khi dùng kết quả đó vào sản phẩm.
```

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text
Nếu không có AI, phần khó khăn nhất là bắt đầu từ con số 0 với các module mới và tìm hướng giải quyết cho các lỗi ban đầu. AI giúp mình có một điểm xuất phát nhanh hơn.
```

### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?

```text
Mình hiểu rõ hơn về quy trình phát triển phần mềm từ phân tích, thiết kế, triển khai đến kiểm thử. Đồng thời cũng thấy được tầm quan trọng của việc kết hợp kiến thức chuyên môn với kỹ năng tự kiểm tra.
```

### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?

```text
AI rất hữu ích khi dùng đúng mục đích, nhưng không nên coi đó là thay thế cho tư duy và trách nhiệm của người phát triển. Mình học được cách dùng AI để tham khảo, hỗ trợ và kiểm tra, nhưng vẫn phải chịu trách nhiệm về sản phẩm cuối cùng.
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
| Ngô Vương Tùng | 06/09/2026 |
