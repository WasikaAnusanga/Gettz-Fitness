import EmployeeSalary from "../model/employeeSalary.js"

export const getEmployeeSalary =(req, res) => {
    req.user={role: "Admin"};
    if(req.user.role == "Admin"){
        EmployeeSalary.find()
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need Admin authorization..."
        });
    }
};


export const addEmployeeSalary = (req, res) => {
    req.user={role: "Admin"};
    if(req.user.role == "Admin"){
        const salary = new EmployeeSalary ({
            salary_id: req.body.salary_id,
            base_salary: req.body.base_salary,
            salaryPay_method: req.body.salaryPay_method,
            salaryPay_date: req.body.salaryPay_date,
            overtime_pay: req.body.overtime_pay,
        });
        salary.save()
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need Admin authorization..."
        });
    }
};

export const updateEmployeeSalary = (req, res) => {
    req.user={role: "Admin"};
    if(req.user.role == "Admin"){
        const {
            salary_id,
            base_salary,
            salaryPay_method,
            salaryPay_date,
            overtime_pay
        } = req.body;
        EmployeeSalary.updateOne(
            { salary_id: salary_id },
            { $set: { base_salary, salaryPay_method, salaryPay_date, overtime_pay } }
        )
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need Admin authorization..."
        });
    }
};

export const deleteEmployeeSalary = (req, res) => {
    req.user={role: "Admin"};
    if(req.user.role == "Admin"){
        const {salary_id} = req.body;
        EmployeeSalary.deleteOne({ salary_id: salary_id})
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need Admin authorization..."
        });
    }
};