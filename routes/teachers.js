const express = require('express');
const router = express.Router();

const teacherService = require('../class_files/teachers.js');

// read teachers
router.get('/teachers', (request, response) => {
  const db = new teacherService();

  const result = db.AllTeacherData();
  
  result
  .then(data => response.json(data))
  .catch(err => console.log(err));
})

// read info about single teacher
router.get('/teachers/:id', (request, response) => {
    const id  = request.params.id;
    const db = new teacherService();
  
    const result = db.SingleTeacherData(id);
    
    result
    .then(data => response.json(data))
    .catch(err => console.log(err));
})

// create and insert teacher
router.post('/teachers/insert', (request, response) => {
  const { first_name, last_name, email } = request.body;
  const db = new teacherService();
  
  const result = db.insertNewTeacher(first_name, last_name, email);

  result
  .then(data => response.json(data))
  .catch(err => console.log(err));
});

// update Teacher Email records 
router.patch('/teachers/updateEmail', (request, response) => {
  const { id, email } = request.body;
  const db = new teacherService();

  const result = db.updateTeacherEmailById(id, email);
  
  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
});

// update Teacher Recruitement Date records 
router.patch('/teachers/updateDOR', (request, response) => {
    const { id, year_rec } = request.body;
    const db = new teacherService();
    
    const result = db.updateTeacherRecruiteYearById(id, year_rec);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

// delete row by id
router.delete('/teachers/delete', (request, response) => {
  const { id } = request.body;
  const db = new teacherService();

  const result = db.deleteTeacherRowById(id);
  
  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
});

module.exports = router;
