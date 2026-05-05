// src/controllers/managerController.js
const prisma = require('../lib/prisma');

// 1. Thêm món ăn mới (Create)
const createMenuItem = async (req, res) => {
  try {
    const { name, price, category_id, image_url } = req.body;
    
    const newItem = await prisma.menuItem.create({
      data: {
        name,
        price: parseFloat(price),
        category_id: parseInt(category_id),
        image_url: image_url || null, // Nếu không gửi link ảnh thì để trống
        is_available: true
      }
    });
    
    res.status(201).json({ message: "Thêm món thành công", item: newItem });
  } catch (error) {
    console.error("Lỗi thêm món:", error);
    res.status(500).json({ error: "Không thể thêm món ăn" });
  }
};

// 2. Cập nhật món ăn (Update - Sửa giá, đổi tên, hoặc báo hết hàng)
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category_id, image_url, is_available } = req.body;

    const updatedItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        // Cú pháp này nghĩa là: Nếu có gửi name lên thì cập nhật, không thì giữ nguyên
        name: name !== undefined ? name : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        category_id: category_id !== undefined ? parseInt(category_id) : undefined,
        image_url: image_url !== undefined ? image_url : undefined,
        is_available: is_available !== undefined ? is_available : undefined,
      }
    });
    res.status(200).json({ message: "Cập nhật thành công", item: updatedItem });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: "Món ăn không tồn tại" });
    res.status(500).json({ error: "Lỗi khi cập nhật món ăn" });
  }
};

// 3. Xóa món ăn (Delete)
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.menuItem.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: "Đã xóa món ăn khỏi thực đơn" });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: "Món ăn không tồn tại" });
    res.status(500).json({ error: "Lỗi khi xóa món ăn" });
  }
};

// 4. Tính doanh thu trong ngày hiện tại
const getDailyRevenue = async (req, res) => {
  try {
    // Tạo mốc thời gian từ 00:00:00 đến 23:59:59 của ngày hôm nay
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Yêu cầu Prisma tính tổng cột total_amount và đếm số lượng Order
    const metrics = await prisma.order.aggregate({
      _sum: { total_amount: true },
      _count: { id: true },
      where: {
        status: 'COMPLETED', // Chỉ tính những đơn đã thu tiền
        created_at: {
          gte: startOfDay, // gte = Greater than or equal (Lớn hơn hoặc bằng)
          lte: endOfDay    // lte = Less than or equal (Nhỏ hơn hoặc bằng)
        }
      }
    });

    res.status(200).json({
      date: startOfDay.toLocaleDateString('vi-VN'),
      total_orders: metrics._count.id,
      total_revenue: metrics._sum.total_amount || 0 // Nếu không có đơn nào thì trả về 0
    });

  } catch (error) {
    console.error("Lỗi tính doanh thu:", error);
    res.status(500).json({ error: "Không thể tính doanh thu" });
  }
};

module.exports = { createMenuItem, updateMenuItem, deleteMenuItem, getDailyRevenue };