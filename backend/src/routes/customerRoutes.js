// src/routes/customerRoutes.js
const express = require("express");
const router = express.Router();

// Nhập hàm getMenu từ file controller
const { getMenu, createOrder } = require("../controllers/customerController");

// Định nghĩa API: GET /menu
router.get("/menu", getMenu);
router.post("/orders", createOrder);

// Đừng quên xuất router ra nhé
module.exports = router;
