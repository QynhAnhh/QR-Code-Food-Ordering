// src/routes/kitchenRoutes.js
const express = require("express");
const router = express.Router();

const { updateOrderStatus } = require("../controllers/kitchenController");

// API: PATCH /api/kitchen/orders/:id/status
router.patch("/orders/:id/status", updateOrderStatus);

module.exports = router;
