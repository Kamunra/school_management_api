const db = require('../db');
const Student = require('./students.js').Student;
const studentService = require('./students.js').studentService;
const Teacher = require('./teachers.js').Teacher;
const teacherService = require('./teachers.js').teacherService;

// some generic functions used by index page
class School{
    #budget;
    constructor(){
        this.name = "Simbrella School";

        this.#budget = 0;
    }

    getNumStudents(){
        return this.num_students;
    }

    async setNumStudents(){
        const db = new studentService();
        const result = await db.AllStudentData();
        this.num_students = result.length;
    }

    getNumTeachers(){
        return this.num_teachers;
    }

    async setNumTeachers(){
        const db = new teacherService();
        const result = await db.AllTeacherData();
        this.num_teachers = result.length;
    }

    getSchoolBudget(){
        return Math.round(this.#budget);
    }

    async setSchoolBudget(){
        const s_db = new studentService();
        const t_db = new teacherService();
        const students = await s_db.AllStudentData();
        const teachers = await t_db.AllTeacherData();
        for(let i=0; i<students.length; i++){
            const st_instance = new Student(students[i].first_name, students[i].last_name);
            await st_instance.setFeeStatus(students[i].has_fee);
            st_instance.setTotalFee();
            this.#budget += st_instance.getTotalFee();
        }
        for(let j=0; j<teachers.length; j++){
            const tea_instance = new Teacher(teachers[j].first_name, teachers[j].last_name, teachers[j].email, teachers[j].year_rec);
            tea_instance.setAnnualSalary();
            this.#budget -= tea_instance.getAnnualSalary();
        }
    }
}

module.exports = School;
