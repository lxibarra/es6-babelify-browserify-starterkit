"use strict";
import Person from './Person';

class Student extends Person {
    constructor() {
        console.log('executing super from Student');
        super();


    }
}

module.exports = Student;