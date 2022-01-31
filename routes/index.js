const express = require('express');
const router = express.Router();

const School = require('../class_files/School.js');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const sc_instance = new School();
  await sc_instance.setNumStudents();
  await sc_instance.setNumTeachers();
  await sc_instance.setSchoolBudget();
  const school_details = { 
    title: sc_instance.name, 
    num_students: sc_instance.getNumStudents(), 
    num_teachers: sc_instance.getNumTeachers(), 
    budget: sc_instance.getSchoolBudget() 
  }
  res.render('index', school_details);
});

module.exports = router;
