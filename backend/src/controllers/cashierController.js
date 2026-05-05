// src/controllers/cashierController.js
const prisma = require("../lib/prisma");

const processPayment = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID đơn hàng trên URL
    const { cashier_id } = req.body; // Lấy ID của nhân viên thu ngân từ Body

    // 1. Tìm đơn hàng xem nó nằm ở bàn nào
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng này" });
    }

    if (order.status === "COMPLETED") {
      return res
        .status(400)
        .json({ error: "Đơn hàng này đã được thanh toán rồi!" });
    }

    // 2. Sử dụng Prisma Transaction để cập nhật 2 bảng cùng lúc
    const [updatedOrder, updatedTable] = await prisma.$transaction([
      // Hành động 1: Chốt đơn
      prisma.order.update({
        where: { id: parseInt(id) },
        data: {
          status: "COMPLETED",
          user_id: parseInt(cashier_id),
        },
      }),
      // Hành động 2: Dọn bàn
      prisma.table.update({
        where: { id: order.table_id },
        data: { status: "EMPTY" },
      }),
    ]);

    res.status(200).json({
      message: "Thanh toán thành công! Bàn đã được dọn trống.",
      order: updatedOrder,
      table: updatedTable,
    });
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    res.status(500).json({ error: "Lỗi hệ thống khi xử lý thanh toán" });
  }
};

module.exports = { processPayment };
