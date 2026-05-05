// src/routes/cashierRoutes.js
const express = require("express");
const router = express.Router();

const { processPayment } = require("../controllers/cashierController");

// API: POST /api/cashier/orders/:id/pay
router.post("/orders/:id/pay", processPayment);

module.exports = router;
