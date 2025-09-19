import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
  card_id: {
    type: Number,
    required: true,
    unique: true,
  },
  card_number: {
    type: Number,
    required: true,
  },
  card_name: {
    type: String,
    required: true,
  },
  expiry_date: {
    type: String,
    required: true,
    min: 0,
  }
  
});

const CreditCard = mongoose.model("CreditCard", cardSchema);

export default CreditCard;
