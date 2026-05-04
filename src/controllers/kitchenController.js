// src/controllers/kitchenController.js
const prisma = require("../lib/prisma");

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID của đơn hàng từ URL (vd: /orders/1)
    const { status } = req.body; // Trạng thái mới Đầu bếp chọn (vd: "COOKING" hoặc "READY")

    // Kiểm tra xem trạng thái truyền lên có hợp lệ không
    const validStatuses = ["PENDING", "COOKING", "READY", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    // Cập nhật Database
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: status },
      include: { order_items: true }, // Trả về luôn thông tin các món trong đơn
    });

    if (status === "READY") {
      req.io.to("cashier-room").emit("order-ready", updatedOrder);
    }
    res.status(200).json({
      message: `Đơn hàng #${id} đã chuyển sang trạng thái: ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    // Bắt lỗi nếu gửi ID không tồn tại
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng này" });
    }
    res.status(500).json({ error: "Lỗi hệ thống khi cập nhật đơn hàng" });
  }
};

module.exports = { updateOrderStatus };
