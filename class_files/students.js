// const app = require('../app');
const db = require('../db');
let Person = require('./Person.js');

class Student extends Person{
    #fees;
    #total_fee;
    constructor(first_name,last_name){   
        super(first_name,last_name);
        this.has_fee=1; 

        this.#fees=3500;
    };

    getStudentId(){
        return this.sid;
    }

    setStudentId(sid){
        this.sid = sid;
    }

    getFeeSize(){
        return this.#fees;
    }

    setFeeSize(fees){
        this.#fees = fees;
    }

    getStudentFeeStatus(){
        return this.has_fee;
    }

    async setFeeStatus(fee_status){
        if(!(isNaN(fee_status))){this.has_fee=fee_status; return;}
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT Students.has_fee FROM `Students` WHERE `student_id`=?;";

                db.query(query, this.getStudentId(), (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0].has_fee);
                })
            });
            this.has_fee = response;
        } catch (error) {
            console.log(error);
        }
    }

    getTotalFee(){
        return this.#total_fee;
    }

    setTotalFee(){
        this.#total_fee = (this.has_fee===1) ? this.#fees : 0;
    }

    getStudentClass(){
        return this.class_name;
    }

    async setStudentClass(class_name){
        if(!(isNaN(class_name))){this.class_name=class_name; return;}
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT Classes.class_name FROM `Students` LEFT JOIN `Classes` ON Students.class_id = Classes.class_id WHERE `student_id`=?;";

                db.query(query, this.getStudentId(), (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0].class_name);
                })
            });
            this.class_name = response;
        } catch (error) {
            console.log(error);
        }
    }

    getStudentGrade(){
        return this.cgpa;
    }

    async setStudentGrade(cgpa){
        if(!(isNaN(cgpa))){this.cgpa=cgpa; return;}
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT Students.cgpa FROM `Students` WHERE `student_id`=?;";

                db.query(query, this.getStudentId(), (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0].cgpa);
                })
            });
            this.cgpa = response;
        } catch (error) {
            console.log(error);
        }
    }
}

class studentService{
    async AllStudentData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT `Students`.`student_id`, `Students`.`first_name`, `Students`.`last_name`, Classes.class_name, `Students`.`cgpa`, `Students`.`has_fee` FROM `Students` LEFT JOIN `Classes` ON Students.class_id = Classes.class_id;";

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async SingleStudentData(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT `Students`.`student_id`, `Students`.`first_name`, `Students`.`last_name`, Classes.class_name, `Students`.`cgpa`, `Students`.`has_fee` FROM `Students` LEFT JOIN `Classes` ON Students.class_id = Classes.class_id WHERE `student_id`=?;";

                db.query(query, id, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0]);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewStudent(class_id, first_name, last_name) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO `Students` (`class_id`, `first_name`, `last_name`) VALUES (?, ?, ?);";

                db.query(query, [class_id, first_name,last_name] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            const st = new Student(first_name, last_name);
            st.setStudentId(insertId);
            await st.setStudentClass();
            return st;
        } catch (error) {
            console.log(error);
        }
    }

    async updateStudentClassById(id, class_id) {
        try {
            id = parseInt(id, 10); 
            class_id = parseInt(class_id, 10); 
            const check = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Classes WHERE class_id = ?";
    
                db.query(query, class_id , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.length);
                })
            });
            if(check !== 1){throw "There exists no class with the given index!";}

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Students SET class_id = ? WHERE student_id = ?";
    
                db.query(query, [class_id, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateStudentGradeById(id, grade) {
        try {
            id = parseInt(id, 10);
            grade = parseInt(grade,10);
            if(grade>100){grade=100;}
            else if(grade<0){grade=0;}   

            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Students SET cgpa = ? WHERE student_id = ?";
    
                db.query(query, [grade, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateStudentFeeStatusById(id, fee_status) {
        try {
            id = parseInt(id, 10);  
            fee_status = parseInt(fee_status,10);
            if(fee_status>1 || fee_status<0){throw "Invalid fee status value!";}           
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Students SET has_fee = ? WHERE student_id = ?";
    
                db.query(query, [fee_status, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteStudentRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM Students WHERE student_id = ?";
    
                db.query(query, id , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = studentService;
