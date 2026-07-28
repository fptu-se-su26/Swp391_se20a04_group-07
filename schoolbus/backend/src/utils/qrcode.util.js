// backend/src/utils/qrcode.util.js
// Sinh Payment Code duy nhất theo tháng và URL ảnh mã QR VietQR
// (dịch vụ img.vietqr.io - miễn phí, không cần đăng ký / API key).
//
// Cấu hình tài khoản ngân hàng lấy từ file .env:
//   BANK_CODE=MB
//   BANK_ACCOUNT_NO=0816306852
//   BANK_ACCOUNT_NAME=DAO HOANG AN

const BANK_CODE    = process.env.BANK_CODE || 'MB';
const BANK_ACCOUNT = process.env.BANK_ACCOUNT_NO || '';
const ACCOUNT_NAME = process.env.BANK_ACCOUNT_NAME || '';

/**
 * Sinh mã Payment Code dạng PAY{YYYY}{MM}{NNNN}
 * Ví dụ: generatePaymentCode(7, 2026, 1) -> "PAY2026070001"
 * @param {number} month 1-12
 * @param {number} year  ví dụ 2026
 * @param {number} seq   số thứ tự trong tháng đó (1, 2, 3...)
 */
function generatePaymentCode(month, year, seq) {
  const mm = String(month).padStart(2, '0');
  const nnnn = String(seq).padStart(4, '0');
  return `PAY${year}${mm}${nnnn}`;
}

/**
 * Sinh URL ảnh QR VietQR để hiển thị trực tiếp bằng thẻ <img src="...">
 * QR chứa: tài khoản ngân hàng, số tiền, nội dung = Payment Code.
 * @param {number|string} amount     Số tiền (VNĐ)
 * @param {string} paymentCode       Nội dung chuyển khoản (Payment Code)
 */
function buildVietQrUrl(amount, paymentCode) {
  if (!BANK_ACCOUNT) {
    throw new Error('Thiếu cấu hình BANK_ACCOUNT_NO trong file .env');
  }
  const amt = Math.round(Number(amount));
  const info = encodeURIComponent(paymentCode);
  const name = encodeURIComponent(ACCOUNT_NAME);
  return `https://img.vietqr.io/image/${BANK_CODE}-${BANK_ACCOUNT}-compact2.png?amount=${amt}&addInfo=${info}&accountName=${name}`;
}

module.exports = { generatePaymentCode, buildVietQrUrl, BANK_CODE, BANK_ACCOUNT, ACCOUNT_NAME };
