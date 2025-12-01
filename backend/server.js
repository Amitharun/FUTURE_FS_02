import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// mongo connection
mongoose.connect("mongodb://127.0.0.1:27017/minishop");

app.use("/api/orders", orderRoutes);

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
