// src/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

// 3. Khởi tạo Socket.io
const io = new Server(server, {
  cors: { origin: "*" }, // Cho phép mọi Frontend kết nối đến
});

// Middleware cơ bản
app.use(cors()); // Cho phép Frontend (React/Vue) gọi API không bị lỗi CORS
app.use(express.json()); // Giúp Backend đọc được dữ liệu JSON gửi lên

// 4. Middleware "thần thánh": Gắn `io` vào `req` để các file Controller xài được
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 5. Cấu hình các phòng (Rooms) cho Socket.io
io.on("connection", (socket) => {
  console.log("🟢 Có thiết bị kết nối Socket:", socket.id);
  // Khi nhân viên đăng nhập trên Frontend, Frontend sẽ gửi tín hiệu 'join-room'
  socket.on("join-room", (role) => {
    if (role === "KITCHEN") {
      socket.join("kitchen-room");
      console.log(`👨‍🍳 Thiết bị ${socket.id} đã vào phòng BẾP`);
    } else if (role === "CASHIER") {
      socket.join("cashier-room");
      console.log(`👩‍💻 Thiết bị ${socket.id} đã vào phòng THU NGÂN`);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Thiết bị ngắt kết nối:", socket.id);
  });
});
// API test thử xem server sống chưa
app.get("/", (req, res) => {
  res.send("Server Hệ thống gọi món qua QR đang hoạt động.");
});

// Khai báo file routes của khách hàng
const customerRoutes = require("./routes/customerRoutes");

// Mọi API bắt đầu bằng /api/customer sẽ được giao cho customerRoutes xử lý
app.use("/api/customer", customerRoutes);

const kitchenRoutes = require("./routes/kitchenRoutes");
app.use("/api/kitchen", kitchenRoutes);

const cashierRoutes = require("./routes/cashierRoutes");
app.use("/api/cashier", cashierRoutes);

const managerRoutes = require("./routes/managerRoutes");
app.use("/api/manager", managerRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Chạy server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
