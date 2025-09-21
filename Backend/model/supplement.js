import mongoose from 'mongoose';
const {Schema} = mongoose;

const counterSchema = new Schema(
    { _id: { type: String, required: true }, seq: { type: Number, default: 100 } },
    { versionKey: false }
);
const Counter = mongoose.model("AppCounter1", counterSchema, "app_counters");

//supplement schema
const supplementSchema = new Schema({
    Sup_code:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    Sup_name:{
        type:String,
        required:true
    },
    Sup_type:{
        type: String,
        required: true
    },
    Sup_price:{
        type: Number,
        required: true
    },
    Sup_status:{
        type: String,
        enum:['In stock','Out of stock'],
        default: 'IN stock',
        required: true
    },
    Sup_quantity:{
        type: Number,
        required: true
    },
    Sup_supplier:{
        type: String
    },
    IM_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'equipmentManager',
        required: true
    },
    Sup_image:[],  

});

const CODE_PREFIX = "SUP-";
const PAD = 4;

supplementSchema.pre("validate", async function autoCode(next) {
  try {
    if (!this.isNew || this.Sup_code) return next();

    const counter = await Counter.findOneAndUpdate(
      { _id: "supplement" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    this.Sup_code = `${CODE_PREFIX}${String(counter.seq).padStart(PAD, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

const supplement= mongoose.model("supplement",supplementSchema);
export default supplement;