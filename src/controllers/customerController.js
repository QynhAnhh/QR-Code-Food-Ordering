// src/controllers/customerController.js
const prisma = require("../lib/prisma");

const getMenu = async (req, res) => {
  try {
    // Truy vấn database: Lấy tất cả Category, kèm theo MenuItem bên trong
    const menu = await prisma.category.findMany({
      include: {
        menu_items: {
          where: { is_available: true }, // Chỉ lấy những món đang còn bán
        },
      },
    });

    // Trả dữ liệu về cho Frontend dưới dạng JSON
    res.status(200).json(menu);
  } catch (error) {
    console.error("Lỗi khi lấy Menu:", error);
    res.status(500).json({ error: "Hệ thống gặp sự cố khi tải thực đơn" });
  }
};

// Xuất hàm này ra để file Route sử dụng
module.exports = { getMenu };
