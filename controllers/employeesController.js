// const data = {
//     employees: require('../models/employees.json'),
//     setEmployees: function (data) { this.employees = data }
// }
// const getAllEmployess = (req, res) => {
//     res.json(data.employees)
// }

// const createNewEmployee = (req, res) => {

//     const newEmployee = {
//         id: data.employees[data.employees.length - 1].id + 1 || 1,
//         name: req.body.name,
//         age: req.body.age
//     }
//     if (!newEmployee.name || !newEmployee.age) {
//         return res.status(400).json({ 'message': "name and age are required" })
//     }
//     data.setEmployees([...data.employees, newEmployee])
//     res.status(201).json(data.employees)
// }

// const updateEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
//     }
//     if (req.body.name) employee.name = req.body.name;
//     if (req.body.age) employee.age = req.body.age;
//     const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
//     const unsortedArray = [...filteredArray, employee];
//     data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
//     res.json(data.employees);
// }

// const deleteEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
//     }
//     const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
//     data.setEmployees([...filteredArray]);
//     res.json(data.employees);
// }

// const getEmployee = (req, res) => {
//     const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
//     if (!employee) {
//         return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
//     }
//     res.json(employee);
// }


// module.exports = {
//     getAllEmployess,
//     createNewEmployee,
//     updateEmployee,
//     deleteEmployee,
//     getEmployee
// }



const Employee = require('../models/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(employees);
}

const createNewEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required' });
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await employee.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}