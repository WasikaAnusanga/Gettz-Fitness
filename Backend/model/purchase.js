import mongoose from "mongoose";
const { Schema } = mongoose;

const counterSchema = new Schema(
    { _id: { type: String, required: true }, seq: { type: Number, default: 100 } },
    { versionKey: false }
);
const Counter = mongoose.model("AppCounter", counterSchema, "app_counters");

//purchase schema
const purchaseSchema = new Schema({
    P_code: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    P_date: {
        type: Date,
        required: true
    },
    P_cost: {
        type: Number,
        required: true
    },
    P_quantiy: {
        type: Number,
        required: true
    },
    P_item: {
        type: String,
        enum: ['Equipment', 'Supplement', 'Other'],
        default: 'Other',
        required: true
    },
    P_note: {
        type: String,
        default: 'No notes'
    },
});

const CODE_PREFIX = "PUR-";
const PAD = 4;

purchaseSchema.pre("validate", async function autoCode(next) {
  try {
    if (!this.isNew || this.P_code) return next();

    const counter = await Counter.findOneAndUpdate(
      { _id: "purchase" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    this.P_code = `${CODE_PREFIX}${String(counter.seq).padStart(PAD, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

const purchase = mongoose.model("purchase", purchaseSchema);
export default purchase;