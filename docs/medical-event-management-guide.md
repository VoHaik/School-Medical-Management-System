# Hướng dẫn Quản lý Sự kiện Y tế và Thuốc

## Giới thiệu
Tài liệu này hướng dẫn về các trường thông tin trong biểu mẫu sự kiện y tế và cách sử dụng chức năng mới để chọn thuốc từ kho thuốc.

## Các trường thông tin trong biểu mẫu sự kiện y tế

1. **Học sinh (Student)**: Chọn học sinh từ danh sách
   - *Mô tả tiếng Việt*: Học sinh gặp sự cố y tế, được chọn từ danh sách có sẵn

2. **Loại sự kiện (Event Type)**: Chọn loại sự kiện y tế
   - *Mô tả tiếng Việt*: Phân loại sự kiện y tế: Chấn thương, Bệnh tật, Tai nạn, Khẩn cấp, Dùng thuốc, Dịch bệnh, Ngã, Sốt, Dị ứng, hoặc Khác

3. **Mức độ nghiêm trọng (Severity)**: Chọn mức độ nghiêm trọng của sự kiện
   - *Mô tả tiếng Việt*: Mức độ nghiêm trọng của sự kiện: Thấp, Trung bình, Cao, hoặc Nguy cấp

4. **Trạng thái (Status)**: Trạng thái hiện tại của sự kiện
   - *Mô tả tiếng Việt*: Trạng thái xử lý: Đang xử lý, Đã giải quyết, Cần theo dõi thêm, hoặc Đã chuyển tuyến

5. **Mô tả (Description)**: Mô tả chi tiết về sự kiện y tế
   - *Mô tả tiếng Việt*: Mô tả chi tiết về sự kiện y tế, các biểu hiện, hoàn cảnh xảy ra

6. **Triệu chứng (Symptoms)**: Các triệu chứng học sinh gặp phải
   - *Mô tả tiếng Việt*: Các triệu chứng cụ thể như sốt, đau đầu, buồn nôn, nôn, chóng mặt, phát ban, đau, chảy máu, sưng, ho, mệt mỏi, khó thở
   - Đây là trường **tự nhập** (có gợi ý từ danh sách có sẵn)

7. **Hành động đã thực hiện (Action Taken)**: Các biện pháp đã áp dụng
   - *Mô tả tiếng Việt*: Mô tả chi tiết các hành động y tế đã thực hiện để xử lý tình huống

8. **Thuốc đã cấp (Medication Given)**: Thuốc đã được cấp cho học sinh
   - *Mô tả tiếng Việt*: Chọn thuốc từ danh sách các thuốc có trong kho thuốc
   - Hiển thị kèm thông tin số lượng hiện có trong kho
   - Không thể chọn thuốc đã hết

9. **Số lượng thuốc (Medication Quantity)**: Số lượng thuốc đã sử dụng
   - *Mô tả tiếng Việt*: Số lượng thuốc đã dùng, sẽ được trừ tự động từ kho thuốc

## Cách sử dụng chức năng

1. **Thêm sự kiện y tế mới**
   - Nhấn nút "Add Medical Event" (Thêm sự kiện y tế)
   - Điền đầy đủ thông tin vào biểu mẫu
   - Khi chọn thuốc từ danh sách, hệ thống sẽ hiển thị số lượng còn lại trong kho
   - Nhập số lượng thuốc sử dụng
   - Nhấn "Save" để lưu sự kiện

2. **Theo dõi kho thuốc**
   - Sau khi sử dụng thuốc cho sự kiện y tế, số lượng sẽ được tự động trừ khỏi kho
   - Kho thuốc được cập nhật tự động

3. **Chỉnh sửa sự kiện y tế**
   - Khi chỉnh sửa, nếu thay đổi thông tin về thuốc:
     - Thuốc cũ sẽ được hoàn trả vào kho
     - Thuốc mới sẽ được trừ từ kho

## Chú ý quan trọng

1. Không thể sử dụng nhiều hơn số lượng thuốc có trong kho
2. Thuốc đã hết không được hiển thị trong danh sách chọn
3. Biểu mẫu hiện đã loại bỏ các trường không cần thiết như "Parent Notified", "Referred To" và "Follow-up Required"
4. Hệ thống sẽ tự động gửi thông báo cho phụ huynh dựa trên mã học sinh
