// src/routes/managerRoutes.js
const express = require("express");
const router = express.Router();

const {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getDailyRevenue,
} = require("../controllers/managerController");

// Import Middleware
const { verifyToken, authorize } = require("../middlewares/authMiddleware");

// Chỉ những ai CÓ TOKEN (verifyToken) và CÓ ROLE LÀ MANAGER (authorize) mới được gọi API này
router.post("/menu", verifyToken, authorize(["MANAGER"]), createMenuItem);
router.patch("/menu/:id", verifyToken, authorize(["MANAGER"]), updateMenuItem);
router.delete("/menu/:id", verifyToken, authorize(["MANAGER"]), deleteMenuItem);
router.get(
  "/revenue/daily",
  verifyToken,
  authorize(["MANAGER"]),
  getDailyRevenue,
);

module.exports = router;
