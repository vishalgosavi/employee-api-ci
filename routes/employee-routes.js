
const { Router } = require('express');
const { EmployeeService } = require('../helpers/employee-helper');
//const express = require('express');

var router = Router();
var empSvc = new EmployeeService();


//GET http://localhost:5000/employees
//Get All employees
router.get("/", async (req, res) => {
    let emps = await empSvc.getAllEmployees().catch(err => res.status(500).json({ 'message': 'Unable to read employees' }));

    res.status(200).json(emps);


});

router.post("/", async (req, res) => {
    let employee = req.body;
    let result = await empSvc.addEmployee(employee).catch(err => res.status(500).json({ 'message': 'Unable to add new Employee' }));
    if (result) {
        res.status(201).json({ 'message': 'Employee added successfully' });
    }
});


router.get("/Location/:locId", async (req, res) => {
    let LocationId = req.params["locId"];
    let result = await empSvc.getEmployeesByLocation(LocationId).catch(err => {
        console.log(err);
        res.status(500).json({ 'message': 'Error in fetching employee data' })
    });
    if (result) {
        res.status(200).json(result.Items);
    }
});


router.get("/Location/:locId/empcode/:ecode", async (req, res) => {
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.getEmployee(locationId, empCode)
        .catch(err => {
            console.log(err);
            res.status(500).json({ 'message': 'Unable to get employee details' })
        })
    if (result) {
        res.status(200).json(result);
    }
});


//Get a single employee
// router.get(params);

// //Insert employee
// router.post();

//delete a employee
//DELETE /employees/location/:locId/empcode/:ecode
router.delete("/Location/:locId/empcode/:ecode", async (req, res) => {
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.deleteEmployee(locationId, empCode)
        .catch(err => {
            console.log(err);
            res.status(500).json({ 'message': 'Error in deleting' })
        })
    if (result) {
        res.status(200).json({ 'message': 'Deleted' })
    }



});

module.exports = { router }