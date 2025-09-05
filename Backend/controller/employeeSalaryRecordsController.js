import EmployeeSalaryRecords from '../model/employeeSalaryRecords.js'

export const getEmployeeSalaryRecords =(req, res) => {
    req.user={role: "Admin"};
    if(req.user.role == "Admin"){
        EmployeeSalaryRecords.find()
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

export const addEmployeeSalaryRecords = (req, res) => {
    req.user={role: "Admin"};
    if(req.user.role == "Admin"){
        const records = new EmployeeSalaryRecords ({
            record_id: req.body.record_id,
            workshift_schedule: req.body.workshift_schedule,
            attendance_count: req.body.attendance_count,
            leave_count: req.body.leave_count,
            performance_notes: req.body.performance_notes,
        });
        records.save()
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


export const updateEmployeeSalaryRecords = (req, res) => {
    req.user={role: "Admin"};
    if(req.user.role == "Admin"){
        const {
            record_id,
            workshift_schedule,
            attendance_count,
            leave_count,
            performance_notes
        } = req.body;
        EmployeeSalaryRecords.updateOne(
            { record_id: record_id },
            { $set: { workshift_schedule, attendance_count, leave_count, performance_notes } }
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



export const deleteEmployeeSalaryRecords = (req, res) => {
    req.user={role: "Admin"};
    if(req.user.role == "Admin"){
        const {record_id} = req.body;
        EmployeeSalaryRecords.deleteOne({ record_id: record_id})
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