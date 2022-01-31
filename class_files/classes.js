// const app = require('../app');
const db = require('../db');

class school_class{
    constructor(name){   
        this.name= name;        
    };

    getClassId(){
        return this.cid;
    }

    setClassId(cid){
        this.cid = cid;
    }

    getNumStudents(){
        return this.num_students;
    }

    async countNumStudents(){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM `Students` WHERE Students.class_id = ?;";

                db.query(query, this.getClassId(), (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.length);
                })
            });
            this.num_students = response;
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

class classService{
    async AllClassData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Classes;";

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            for(let i=0; i<response.length; i++){
                const cl_instance = new school_class(response[i].class_name);
                cl_instance.setClassId(response[i].class_id);
                response[i]["num_students"] = await cl_instance.countNumStudents();
            }
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewClass(name) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO Classes (class_name) VALUES (?);";

                db.query(query, name , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            const cl_instance = new school_class(name);
            cl_instance.setClassId(insertId);
            return cl_instance;
        } catch (error) {
            console.log(error);
        }
    }

    async updateClassNameById(id, name) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Classes SET class_name = ? WHERE class_id = ?";
    
                db.query(query, [name, id] , (err, result) => {
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

    async deleteClassRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM Classes WHERE class_id = ?";
    
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

module.exports = classService;
