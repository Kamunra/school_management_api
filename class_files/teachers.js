// const app = require('../app');
const db = require('../db');
let Person = require('./Person.js');

class Teacher extends Person{
    #salary;
    #annual_salary;
    #year_bonus;
    #base_bonus;
    #bonus_coef;
    constructor(first_name,last_name,email, year_rec){  
        super(first_name,last_name);
        this.email=email;
        this.year_rec=year_rec;
        
        this.#salary=10000;
        this.#year_bonus=3;
        this.#base_bonus=1000;
        this.#bonus_coef=1.1;
    };

    getTeacherId(){
        return this.tid;
    }

    setTeacherId(tid){
        this.tid = tid;
    }

    getBaseSalary(){
        return this.#salary;
    }

    setBaseSalary(salary){
        this.#salary=salary;
    }

    getBaseBonus(){
        return this.#base_bonus;
    }

    setBaseBonus(base_bonus){
        this.#base_bonus=base_bonus;
    }

    getYearBonus(){
        return this.#year_bonus;
    }

    setYearBonus(year_bonus){
        this.#year_bonus=year_bonus;
    }

    getCoefBonus(){
        return this.#bonus_coef;
    }

    setCoefBonus(bonus_coef){
        this.#bonus_coef=bonus_coef;
    }

    getAnnualSalary(){
        return this.#annual_salary;
    }

    setAnnualSalary(){
        let calculateBonus = function(year_bonus,base_bonus,bonus_coef){
            const years = new Date().getFullYear()-this.year_rec;
            if(years>year_bonus){
                return base_bonus*Math.pow(bonus_coef,years-year_bonus);
            }
        }
        this.#annual_salary = this.#salary + calculateBonus(this.#year_bonus,this.#base_bonus,this.#bonus_coef);
    }
}

class teacherService{
    async AllTeacherData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Teachers;";

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

    async SingleTeacherData(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Teachers WHERE `teacher_id`=?;";

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

    async insertNewTeacher(first_name, last_name, email) {
        try {
            const year_rec = new Date().getFullYear();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO `Teachers` (`first_name`, `last_name`, `email`, `year_rec`) VALUES (?, ?, ?, ?);";

                db.query(query, [first_name,last_name,email,year_rec] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            const tea = new Teacher(first_name, last_name, email, year_rec);
            tea.setTeacherId(insertId);
            return tea;
        } catch (error) {
            console.log(error);
        }
    }

    async updateTeacherEmailById(id, email) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Teachers SET email = ? WHERE teacher_id = ?";
    
                db.query(query, [email, id] , (err, result) => {
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

    async updateTeacherRecruiteYearById(id, year_rec) {
        try {
            id = parseInt(id, 10);  
            year_rec = parseInt(year_rec,10);
            if(year_rec > new Date().getFullYear() || year_rec < 1990){throw "Invalid year!";}           
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Teachers SET year_rec = ? WHERE teacher_id = ?";
    
                db.query(query, [year_rec, id] , (err, result) => {
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

    async deleteTeacherRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM Teachers WHERE teacher_id = ?";
    
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

module.exports = teacherService;
