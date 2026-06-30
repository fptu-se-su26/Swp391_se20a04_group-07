# AI Learning Reflection

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
| Ngày hoàn thành reflection |  |

---

## 2. Mục đích Reflection

File này dùng để tôi tự đánh giá quá trình sử dụng AI trong việc xây dựng phần Admin Module của project School Bus System.

---

## 3. Tóm tắt quá trình sử dụng AI

```text
Tôi sử dụng AI xuyên suốt các giai đoạn thiết kế, coding và debug của Admin Module.
Ở giai đoạn đầu, tôi dùng ChatGPT để lên ý tưởng layout Dashboard. Sang giai đoạn
implementation, tôi chuyển sang Claude vì cần phân tích code và schema DB chi tiết
hơn — đặc biệt khi thiết kế luồng liên kết Student-Parent và debug các lỗi SQL.
AI giúp tôi rút ngắn thời gian phác thảo ban đầu, nhưng phần lớn việc kiểm tra,
sửa lỗi và tối ưu thực tế vẫn do tôi tự làm.
```

---

## 4. Công cụ AI đã sử dụng

- [x] ChatGPT
- [ ] Gemini
- [x] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Microsoft Copilot
- [ ] Perplexity
- [ ] Công cụ khác

### Công cụ được sử dụng nhiều nhất

```text
Claude
```

### Lý do sử dụng công cụ đó

```text
Claude phân tích code và schema database chi tiết hơn, đặc biệt hữu ích khi
debug lỗi liên quan đến SQL và cấu trúc DAO — vì Claude có thể đọc nguyên file
Java dài và chỉ ra chính xác dòng nào gây lỗi, kèm giải thích nguyên nhân.
```

---

## 5. AI đã hỗ trợ tôi ở điểm nào?

- [x] Hiểu yêu cầu đề bài
- [x] Phân tích bài toán
- [ ] Tìm ý tưởng giải pháp
- [ ] Thiết kế database
- [x] Thiết kế giao diện
- [x] Thiết kế kiến trúc hệ thống
- [x] Viết code mẫu
- [x] Debug lỗi
- [x] Viết test case
- [x] Review code
- [x] Tối ưu code
- [ ] Kiểm tra bảo mật
- [ ] Viết báo cáo
- [ ] Chuẩn bị thuyết trình
- [ ] Tìm hiểu công nghệ mới

### Mô tả chi tiết

```text
AI hỗ trợ nhiều nhất ở 3 việc cụ thể:
1. Thiết kế luồng nghiệp vụ Student-Parent linking — đề xuất cấu trúc 3-servlet
   để tôi có điểm bắt đầu rõ ràng.
2. Debug lỗi SQL — khi tôi cung cấp đầy đủ code và schema DB, AI xác định đúng
   nguyên nhân (cột p.phone không tồn tại) nhanh hơn nhiều so với tôi tự dò log.
3. Review và tối ưu UI — gợi ý cách hiển thị badge trạng thái phụ huynh, modal
   thông tin chi tiết, giúp giao diện chuyên nghiệp hơn.
```

---

## 6. AI có giúp tôi học tốt hơn không?

### 6.1. Những điểm AI giúp tôi học tốt hơn

```text
- Hiểu bài nhanh hơn: AI giải thích rõ tại sao một lỗi SQL xảy ra (constraint,
  schema mismatch) giúp tôi hiểu sâu hơn về JDBC và SQL Server thay vì chỉ
  copy giải pháp.
- Có thêm ví dụ minh họa: cấu trúc 3-servlet cho luồng Student-Parent là một
  pattern tôi chưa từng nghĩ tới, giúp tôi học được cách tổ chức code rõ ràng hơn.
- Biết cách debug lỗi: học được phương pháp đọc stack trace và đối chiếu với
  schema DB một cách hệ thống.
```

### 6.2. Những điểm AI chưa giúp tốt hoặc gây khó khăn

```text
- AI một vài lần gợi ý code không khớp với schema DB thật của nhóm (vì AI không
  tự biết cấu trúc bảng, phải tôi cung cấp).
- AI gợi ý giải pháp đơn giản nhưng chưa tối ưu về bảo mật (dùng GET cho hành
  động thay đổi dữ liệu) hoặc hiệu năng (loop INSERT thay vì 1 câu SQL).
- Test case AI sinh ra có Expected Output đôi khi không khớp hành vi thực tế
  của servlet, phải tự kiểm tra và sửa lại.
```

### 6.3. Tôi có bị phụ thuộc vào AI không?

- [ ] Không phụ thuộc
- [x] Phụ thuộc ít
- [ ] Phụ thuộc trung bình
- [ ] Phụ thuộc nhiều

Giải thích:

```text
Tôi dùng AI chủ yếu để định hướng ban đầu (luồng xử lý, layout UI) và xác định
nguyên nhân lỗi nhanh hơn. Toàn bộ việc viết code chi tiết, xử lý edge case,
kiểm tra bảo mật và tối ưu hiệu năng tôi đều tự làm. Nếu không có AI, tôi vẫn
có thể hoàn thành Admin Module nhưng sẽ mất nhiều thời gian hơn ở giai đoạn
thiết kế luồng và debug.
```

---

## 7. Tôi đã kiểm tra kết quả AI như thế nào?

- [x] Chạy thử chương trình
- [x] Kiểm tra output
- [x] Viết test case
- [x] So sánh với yêu cầu đề bài
- [ ] Đối chiếu với tài liệu môn học
- [x] Review code
- [ ] Hỏi lại giảng viên
- [ ] Tra cứu tài liệu chính thống
- [x] Thảo luận với thành viên nhóm
- [x] Kiểm tra bằng dữ liệu mẫu
- [ ] So sánh trước và sau khi dùng AI

### Mô tả quá trình kiểm chứng

```text
Sau mỗi lần nhận code/giải pháp từ AI, tôi luôn:
1. Đọc kỹ từng dòng code trước khi copy vào project — không paste mù quáng.
2. Chạy trực tiếp trên Tomcat 10 + SQL Server thực tế để xác nhận hoạt động đúng.
3. Đối chiếu với schema DB thật (kiểm tra tên bảng, tên cột bằng SSMS).
4. Test các trường hợp edge case mà AI không đề cập (email trùng, parentId = 0,
   dữ liệu rỗng).
5. Trao đổi với nhóm khi tính năng liên quan đến module khác (ví dụ: Notification
   liên kết với Parent module).
```

### Ví dụ cụ thể về một lần kiểm chứng

| Nội dung | Mô tả |
|---|---|
| AI đã gợi ý gì? | Câu SQL trong getStudentById() dùng "p.phone AS parent_phone" để lấy SĐT phụ huynh |
| Tôi đã kiểm tra bằng cách nào? | Chạy thử trang update-student trên Tomcat, thấy redirect lỗi error=notfound |
| Kết quả kiểm tra | Sai — cột phone không tồn tại trong bảng parents thực tế |
| Tôi đã xử lý tiếp như thế nào? | Hỏi lại AI kèm schema DB thật, AI xác định đúng nguyên nhân, tôi viết SQL patch ALTER TABLE để thêm cột |

---

## 8. Ví dụ AI gợi ý sai hoặc chưa phù hợp

| Nội dung | Mô tả |
|---|---|
| AI đã gợi ý gì? | Dùng GET request (?action=approve&id=X) cho chức năng duyệt đơn xin nghỉ |
| Vì sao gợi ý đó sai/chưa phù hợp? | GET request không an toàn cho hành động làm thay đổi dữ liệu (CSRF risk), vi phạm nguyên tắc REST cơ bản |
| Tôi phát hiện bằng cách nào? | Tự review code dưới góc độ bảo mật trước khi áp dụng, nhớ lại kiến thức đã học về HTTP method |
| Tôi đã sửa như thế nào? | Đổi toàn bộ action approve/reject sang POST request, dùng form ẩn với button submit |
| Bài học rút ra | AI ưu tiên giải pháp đơn giản, nhanh — không tự động áp dụng best practice về bảo mật nếu không được yêu cầu rõ |

---

## 9. Phần đóng góp thật sự của tôi

```text
- Tự phát hiện và sửa các bug không có trong gợi ý AI: lỗi email trùng khi tạo
  phụ huynh, lỗi NULL parent_id với FK constraint, thiếu taglib fn trong JSP.
- Tự tối ưu lại hiệu năng (đổi loop INSERT thành 1 câu INSERT-SELECT).
- Tự sửa lỗi bảo mật (GET → POST) cho chức năng duyệt đơn.
- Tự thiết kế các trường hợp lỗi và thông báo cụ thể (email_exists, parent_failed...)
  để UX rõ ràng hơn cho người dùng Admin.
- Tự chạy thử và ghi nhận kết quả từng test case thay vì tin vào Expected Output
  do AI sinh ra.
- Tự viết toàn bộ phần báo cáo, AI_AUDIT_LOG, Changelog dựa trên công việc thực tế.
```

---

## 10. So sánh trước và sau khi dùng AI

| Nội dung | Trước khi dùng AI | Sau khi dùng AI | Cải thiện đạt được |
|---|---|---|---|
| Hiểu yêu cầu | Chỉ dựa vào SRS, còn mơ hồ về cách triển khai chi tiết | Có hình dung rõ hơn về luồng cụ thể | Tiết kiệm thời gian phân tích |
| Phân tích bài toán | Tự suy nghĩ chậm, hay bỏ sót case | AI gợi ý nhiều hướng để so sánh | Phân tích đầy đủ hơn |
| Thiết kế giải pháp | Mất nhiều thời gian phác thảo từ đầu | Có blueprint nhanh để chỉnh sửa | Nhanh hơn đáng kể |
| Code/Implementation | Viết chậm, hay phải sửa nhiều lần | Có mẫu code tham khảo, tự chỉnh sửa | Code chất lượng hơn |
| Debug/Testing | Dò log thủ công, mất nhiều thời gian | AI giúp định hướng nguyên nhân nhanh | Debug hiệu quả hơn |
| Báo cáo/Thuyết trình | Tự viết hoàn toàn | Tự viết hoàn toàn | Không thay đổi |
| Làm việc nhóm | Trao đổi trực tiếp | Trao đổi trực tiếp + chia sẻ kết quả AI tham khảo | Có thêm tài liệu tham khảo chung |

---

## 11. Bài học về môn học

```text
Qua việc xây dựng Admin Module, tôi hiểu rõ hơn:
- Cách tổ chức code theo mô hình MVC trong Java Servlet/JSP.
- Tầm quan trọng của việc validate dữ liệu ở phía server trước khi insert vào DB.
- Cách xử lý các ràng buộc FK trong SQL Server (NOT NULL, ALTER TABLE).
- Cách thiết kế UX cho các luồng nghiệp vụ phức tạp (liên kết dữ liệu giữa
  nhiều bảng trong một thao tác người dùng).
- Kỹ năng debug có hệ thống: đọc log, đối chiếu schema, kiểm tra từng lớp
  (Servlet → DAO → DB).
```

---

## 12. Bài học về sử dụng AI có trách nhiệm

```text
- Cần kiểm tra lại mọi kết quả AI trước khi áp dụng — đặc biệt là về bảo mật
  và hiệu năng, vì AI thường ưu tiên giải pháp đơn giản, dễ hiểu hơn là đúng
  chuẩn best practice.
- Cần cung cấp đủ context (schema DB thật, code hiện tại) để AI cho kết quả
  chính xác, tránh nhận giải pháp sai do thiếu thông tin.
- Cần hiểu nội dung trước khi nộp — tôi đảm bảo có thể giải thích từng dòng
  code trong StudentDetailServlet và AddParentFromStudentServlet khi bảo vệ.
- Cần ghi nhận trung thực việc sử dụng AI, không che giấu các phần đã được
  AI hỗ trợ.
- AI là công cụ tăng tốc quá trình học và làm việc, không thay thế việc tự
  tư duy và chịu trách nhiệm với sản phẩm cuối cùng.
```

---

## 13. Điều tôi sẽ không làm khi sử dụng AI

- [x] Không dùng AI để làm toàn bộ bài mà không hiểu nội dung.
- [x] Không nộp nguyên văn kết quả AI nếu chưa kiểm tra.
- [x] Không che giấu việc sử dụng AI trong các phần quan trọng.
- [x] Không dùng AI để tạo nội dung sai lệch hoặc gian lận.
- [x] Không dùng AI thay thế hoàn toàn quá trình học.
- [x] Không bỏ qua yêu cầu, rubric hoặc hướng dẫn của giảng viên.

### Giải thích thêm nếu có

```text
Mỗi đoạn code AI gợi ý, tôi đều đọc và hiểu logic trước khi tích hợp vào
project, đồng thời ghi nhận đầy đủ vào AI_AUDIT_LOG.md để minh bạch với
giảng viên về phần nào có AI hỗ trợ.
```

---

## 14. Kế hoạch cải thiện lần sau

```text
- Viết prompt rõ hơn ngay từ đầu: nêu công nghệ cụ thể, đính kèm schema DB
  hoặc code hiện tại ngay trong lần hỏi đầu tiên thay vì hỏi lại nhiều lần.
- Luôn yêu cầu AI giải thích lý do đằng sau giải pháp, không chỉ xin code.
- Chủ động hỏi AI về rủi ro bảo mật và hiệu năng của giải pháp được gợi ý,
  thay vì tự phát hiện sau.
- Ghi log ngay sau mỗi lần dùng AI, không dồn lại viết một lần ở cuối project.
- Đối chiếu kết quả AI với tài liệu môn học Software Engineering kỹ hơn.
```

---

## 15. Tự đánh giá mức độ hoàn thành

| Tiêu chí | Điểm tự đánh giá 1-5 | Ghi chú |
|---|:---:|---|
| Ghi nhận việc dùng AI trung thực | 5 | Ghi đầy đủ từng lần sử dụng |
| Prompt có mục tiêu rõ ràng | 4 | Một số prompt đầu còn chung, đã cải tiến |
| Kiểm chứng kết quả AI | 5 | Luôn chạy thử thực tế trước khi áp dụng |
| Tự chỉnh sửa/cải tiến | 5 | Sửa nhiều edge case AI không đề cập |
| Hiểu nội dung đã nộp | 5 | Có thể giải thích từng dòng code |
| Reflection có chiều sâu | 4 | |
| Sử dụng AI có trách nhiệm | 5 | |

---

## 16. Câu hỏi tự vấn cuối bài

### 16.1. Nếu giảng viên hỏi về phần AI đã hỗ trợ, tôi có giải thích lại được không?

```text
Có. Tôi có thể giải thích rõ AI hỗ trợ ở bước nào (thiết kế luồng, debug, tối
ưu UI) và phần nào tôi tự làm (xử lý edge case, bảo mật, hiệu năng). Tôi hiểu
rõ logic của từng servlet trong Admin Module và lý do thiết kế như vậy.
```

### 16.2. Nếu không có AI, tôi có thể tự làm lại phần quan trọng nhất không?

```text
Có thể, nhưng sẽ mất nhiều thời gian hơn ở giai đoạn phác thảo luồng Student-
Parent linking ban đầu. Tôi hiểu rõ logic nghiệp vụ nên có thể tự thiết kế lại
từ đầu, chỉ là sẽ cần nhiều lần thử-sai hơn so với khi có AI gợi ý hướng đi.
```

### 16.3. Phần nào trong bài thể hiện rõ nhất năng lực thật sự của tôi?

```text
Việc phát hiện và xử lý các edge case mà AI không đề cập: lỗi email trùng,
xử lý NULL parent_id đúng chuẩn SQL Server, sửa lỗi bảo mật GET→POST, và tối
ưu hiệu năng từ loop INSERT thành 1 câu SQL duy nhất. Đây là những điểm thể
hiện tôi không chỉ copy code mà thực sự hiểu và cải tiến giải pháp.
```

### 16.4. Tôi muốn cải thiện kỹ năng nào sau bài này?

```text
Tôi muốn cải thiện kỹ năng viết prompt có cấu trúc ngay từ đầu (đủ context,
đủ yêu cầu đầu ra) để giảm số lần phải hỏi lại AI, và kỹ năng tự đánh giá
bảo mật/hiệu năng của giải pháp một cách hệ thống hơn, không chỉ phát hiện
khi review thủ công.
```

---

## 17. Cam kết Reflection

Tôi cam kết rằng nội dung reflection này phản ánh trung thực quá trình sử dụng AI và quá trình học tập trong project School Bus System — phần Admin Module.

Tôi hiểu rằng:
- AI là công cụ hỗ trợ học tập, không thay thế hoàn toàn năng lực cá nhân.
- Mọi kết quả AI gợi ý cần được kiểm tra trước khi sử dụng.
- Tôi chịu trách nhiệm với sản phẩm cuối cùng.
- Tôi cần giải thích được các phần đã nộp.

| Đại diện sinh viên | Ngày xác nhận |
|---|---|
| Đào Hoàng Ân |  |
