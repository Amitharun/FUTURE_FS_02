import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userName: String,
  items: Array,
  total: Number,
  status: { type: String, default: "Booking Confirmed" },
  deliveryDays: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
