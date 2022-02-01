const { request, response } = require('express');
const express = require('express');
const router = express.Router();

const classService = require('../class_files/classes.js');

// read classes
router.get('/classes', (request, response) => {
  const db = new classService();

  const result = db.AllClassData();
  
  result
  .then(data => response.render('classes', { data: data }))
  .catch(err => console.log(err));
})

// router.get('/classes/insertForm', (request, response) => {
//   response.render('classInsert');
// })

// create and insert class
router.post('/classes/insert', (request, response) => {
  const { name } = request.body;
  const db = new classService();
  
  const result = db.insertNewClass(name);

  result
  .then(data => response.json(data))
  .catch(err => console.log(err));
});

// update class records
router.patch('/classes/update', (request, response) => {
  const { id, name } = request.body;
  const db = new classService();

  const result = db.updateClassNameById(id, name);
  
  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
});

router.patch('/classes/updatePrimeTeacher', (request, response) => {
  const { id, teacher_id } = request.body;
  const db = new classService();

  const result = db.updateClassPrimaryTeacherById(id, teacher_id);
  
  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
});

// delete row by id
router.delete('/classes/delete', (request, response) => {
  const { id } = request.body;
  const db = new classService();

  const result = db.deleteClassRowById(id);
  
  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
});

module.exports = router;
