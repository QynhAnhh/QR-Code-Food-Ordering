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

const createOrder = async (req, res) => {
  try {
    // Lấy dữ liệu Frontend gửi lên (body)
    const { table_id, items } = req.body;

    // items sẽ có dạng mảng: [{ menu_item_id: 1, quantity: 2, price: 85000, note: "Không hành" }, ...]

    // 1. Tính tổng tiền của cả đơn hàng
    const total_amount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // 2. Lưu vào Database (Lưu 1 Order kèm theo nhiều OrderItem cùng lúc)
    const newOrder = await prisma.order.create({
      data: {
        table_id: parseInt(table_id),
        total_amount: total_amount,
        status: "PENDING", // Mới đặt thì trạng thái là Chờ xử lý
        order_items: {
          create: items.map((item) => ({
            menu_item_id: parseInt(item.menu_item_id),
            quantity: parseInt(item.quantity),
            price_at_order: item.price, // Lưu lại giá lúc mua để mốt đổi giá menu cũng không ảnh hưởng hóa đơn cũ
            note: item.note || "",
          })),
        },
      },
      include: {
        order_items: true, // Lấy luôn chi tiết món vừa lưu để trả về cho khách xem
      },
    });

// Phát tín hiệu 'new-order' đến thẳng phòng 'kitchen-room'
req.io.to('kitchen-room').emit('new-order', newOrder);

    res.status(201).json({ message: "Đặt món thành công!", order: newOrder });
  } catch (error) {
    console.error("Lỗi khi đặt món:", error);
    res.status(500).json({ error: "Hệ thống gặp sự cố khi đặt món" });
  }
};

// Xuất hàm này ra để file Route sử dụng
module.exports = { getMenu, createOrder };
