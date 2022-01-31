const express = require('express');
const router = express.Router();

const studentService = require('../class_files/students.js');

// read students
router.get('/students', (request, response) => {
  const db = new studentService();

  const result = db.AllStudentData();
  
  result
  .then(data => response.json(data))
  .catch(err => console.log(err));
})

// read info about single student
router.get('/students/:id', (request, response) => {
    const id  = request.params.id;
    const db = new studentService();
  
    const result = db.SingleStudentData(id);
    
    result
    .then(data => response.json(data))
    .catch(err => console.log(err));
})

// create and insert student
router.post('/students/insert', (request, response) => {
  const { class_id, first_name, last_name } = request.body;
  const db = new studentService();
  
  const result = db.insertNewStudent(class_id, first_name, last_name);

  result
  .then(data => response.json(data))
  .catch(err => console.log(err));
});

// update Student Class records 
router.patch('/students/updateClass', (request, response) => {
  const { id, class_id } = request.body;
  const db = new studentService();

  const result = db.updateStudentClassById(id, class_id);
  
  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
});

// update Student Grade records 
router.patch('/students/updateGrade', (request, response) => {
    const { id, grade } = request.body;
    const db = new studentService();
    
    const result = db.updateStudentGradeById(id, grade);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

// update Student Fee Status records 
router.patch('/students/updateFeeStatus', (request, response) => {
    const { id, fee_status } = request.body;
    const db = new studentService();
  
    const result = db.updateStudentFeeStatusById(id, fee_status);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

// delete row by id
router.delete('/students/delete', (request, response) => {
  const { id } = request.body;
  const db = new studentService();

  const result = db.deleteStudentRowById(id);
  
  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
});

module.exports = router;
