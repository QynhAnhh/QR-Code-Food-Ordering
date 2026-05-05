// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
// const bcrypt = require('bcryptjs'); // Thực tế sẽ dùng cái này để giải mã password

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Tìm user trong database
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    if (!user) {
      return res.status(401).json({ error: "Tài khoản không tồn tại" });
    }

    // 2. Kiểm tra mật khẩu 
    // (Lưu ý: Vì dữ liệu seed cũ đang lưu thẳng chữ '123456' nên mình so sánh trực tiếp. 
    // Trong thực tế sẽ dùng: const isMatch = await bcrypt.compare(password, user.password_hash); )
    const isMatch = (password === user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Sai mật khẩu" });
    }

    // 3. Tạo Token (Thẻ nhân viên)
    // Nhét id và role vào trong thẻ để lát nữa phân quyền
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // Thẻ có hạn sử dụng 8 tiếng (hết ca làm)
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token: token,
      role: user.role
    });

  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

module.exports = { login };