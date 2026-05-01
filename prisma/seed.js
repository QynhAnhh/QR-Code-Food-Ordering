const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Đang bắt đầu seeding...");

  // 1. Tạo các bàn (Tables)
  await prisma.table.createMany({
    data: [
      { name: "Bàn số 1", qr_code: "TABLE_1" },
      { name: "Bàn số 2", qr_code: "TABLE_2" },
      { name: "Bàn số 3", qr_code: "TABLE_3" },
    ],
  });

  // 2. Tạo các vai trò (Users) - Password tạm thời là "123456"
  // Lưu ý: Sau này nên dùng thư viện bcrypt để mã hóa mật khẩu
  await prisma.user.createMany({
    data: [
      {
        username: "admin",
        password_hash: "123456",
        role: "MANAGER",
        full_name: "Quản Lý Tổng",
      },
      {
        username: "cashier1",
        password_hash: "123456",
        role: "CASHIER",
        full_name: "Nguyễn Thu Ngân",
      },
      {
        username: "kitchen1",
        password_hash: "123456",
        role: "KITCHEN",
        full_name: "Đầu Bếp Chính",
      },
    ],
  });

  // 3. Tạo Danh mục & Món ăn
  const drinkCat = await prisma.category.create({
    data: {
      name: "Đồ uống",
      menu_items: {
        create: [
          { name: "Cà phê sữa đá", price: 25000, is_available: true },
          { name: "Trà đào cam sả", price: 35000, is_available: true },
        ],
      },
    },
  });

  const foodCat = await prisma.category.create({
    data: {
      name: "Món chính",
      menu_items: {
        create: [
          { name: "Phở Bò", price: 45000, is_available: true },
          { name: "Cơm Tấm Sườn", price: 40000, is_available: true },
        ],
      },
    },
  });

  console.log("Seeding thành công!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
