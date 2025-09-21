import EmployeeSalary from "../model/employeeSalary.js";

export const getEmployeeSalary = (req, res) => {
  req.user = { role: "Admin" };
  if (req.user.role == "Admin") {
    EmployeeSalary.find()
      .then((response) => {
        res.json({ response });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } else {
    res.status(401).json({
      message: "You need Admin authorization...",
    });
  }
};

export const addEmployeeSalary = (req, res) => {
  req.user = { role: "Admin" };
  if (req.user.role == "Admin") {
    const salary = new EmployeeSalary({
      base_salary: req.body.base_salary,
      salaryPay_method: req.body.salaryPay_method,
      salaryPay_date: req.body.salaryPay_date,
      employee_role: req.body.employee_role,
      workshift_schedule: req.body.workshift_schedule,
      attendance_count: req.body.attendance_count,
      leave_count: req.body.leave_count,
      performance_notes: req.body.performance_notes,
    });
    salary
      .save()
      .then((response) => {
        res.json({ response });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } else {
    res.status(401).json({
      message: "You need Admin authorization...",
    });
  }
};

export const updateEmployeeSalary = (req, res) => {
  req.user = { role: "Admin" };
  if (req.user.role == "Admin") {
    const {
      base_salary,
      salaryPay_method,
      salaryPay_date,
      employee_role,
      workshift_schedule,
      attendance_count,
      leave_count,
      performance_notes,
    } = req.body;
    const salary_id = Number(req.params.id);
    EmployeeSalary.updateOne(
      { salary_id: salary_id },
      {
        $set: {
          base_salary,
          salaryPay_method,
          salaryPay_date,
          employee_role,
          workshift_schedule,
          attendance_count,
          leave_count,
          performance_notes,
        },
      }
    )
      .then((response) => {
        res.json({ response });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } else {
    res.status(401).json({
      message: "You need Admin authorization...",
    });
  }
};

export const deleteEmployeeSalary = (req, res) => {
  req.user = { role: "Admin" };
  if (req.user.role == "Admin") {
    const salary_id = Number(req.params.id);
    EmployeeSalary.findOneAndDelete({ salary_id: salary_id })
      .then((response) => {
        res.status(200).json({
          message: "Delete Successful",
        });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } else {
    res.status(401).json({
      message: "You need Admin authorization...",
    });
  }
};
