// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Hàm 1: Kiểm tra xem người dùng có đeo Thẻ (Token) không
const verifyToken = (req, res, next) => {
  // Token thường được gửi kèm trong Header với định dạng: "Bearer <chuỗi_token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Bạn chưa đăng nhập (Không có Token)!" });
  }

  // Dùng chữ ký bí mật để kiểm tra Token là thật hay giả
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) return res.status(403).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
    
    // Nếu thẻ thật, giải mã lấy id và role gắn vào req để các hàm phía sau dùng
    req.user = decodedUser; 
    next(); // Cho phép đi tiếp vào Controller
  });
};

// Hàm 2: Kiểm tra xem chức vụ (Role) có được phép làm việc này không
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Bạn không có quyền thực hiện hành động này!" });
    }
    next();
  };
};

module.exports = { verifyToken, authorize };