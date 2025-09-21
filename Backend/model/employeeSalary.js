import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import "./user.js";

const AutoIncrement = AutoIncrementFactory(mongoose);
const Schema = mongoose.Schema;

const employeeSalarySchema = new Schema({
  salary_id: {
    type: Number,
    unique: true,
  },

  base_salary: {
    type: String,
  },

  salaryPay_method: {
    type: String,
  },

  salaryPay_date: {
    type: String,
  },

  employee_role: {
    type: String,
  },

  workshift_schedule: {
    type: String,
  },

  attendance_count: {
    type: Number,
  },

  leave_count: {
    type: Number,
  },

  performance_notes: {
    type: String,
  },
});

employeeSalarySchema.plugin(AutoIncrement, { inc_field: "salary_id" });

const salary = mongoose.model("employeeSalary", employeeSalarySchema);
export default salary;
