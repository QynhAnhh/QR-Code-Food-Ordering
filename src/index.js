// src/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware cơ bản
app.use(cors()); // Cho phép Frontend (React/Vue) gọi API không bị lỗi CORS
app.use(express.json()); // Giúp Backend đọc được dữ liệu JSON gửi lên

// API test thử xem server sống chưa
app.get("/", (req, res) => {
  res.send("Server Hệ thống gọi món qua QR đang hoạt động.");
});

// Khai báo file routes của khách hàng
const customerRoutes = require("./routes/customerRoutes");

// Mọi API bắt đầu bằng /api/customer sẽ được giao cho customerRoutes xử lý
app.use("/api/customer", customerRoutes);

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
