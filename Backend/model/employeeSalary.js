import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const employeeSalarySchema = new Schema ({

    salary_id:{
        type: Number,
        unique: true,
        required: true,
    },

    base_salary:{
        type: String
    },

    salaryPay_method:{
        type: String
    },

    salaryPay_date:{
        type: String
    },

    overtime_pay:{
        type: String,
    },

});

const salary = mongoose.model("employeeSalary",employeeSalarySchema);
export default salary;