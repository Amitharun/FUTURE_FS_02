import express from "express";
import Order from "../models/order.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  const { userName, items, total } = req.body;

  const deliveryDays = Math.floor(Math.random() * 5) + 3; // 3–7 days

  const newOrder = await Order.create({
    userName,
    items,
    total,
    deliveryDays
  });

  res.json({
    success: true,
    message: "Order saved",
    order: newOrder
  });
});

export default router;
