const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const itemSchema = new Schema({
  userId: { type: String, required: [true, "User ID required"] },
  date: { type: Date, required: [true, "Date required"] },
  concept: {
    type: String,
    enum: {
      values: ["INCOME", "EXPENSE"],
      message: "Unexpected concept",
    },
    required: [true, "Details required"],
  },
  details: { type: String, required: [true, "Details required"] },
  amount: { type: Number, required: [true, "Amount required"] },
});

const Item = model("Item", itemSchema);

module.exports = Item;
