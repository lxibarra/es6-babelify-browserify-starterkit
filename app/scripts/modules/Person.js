"use strict";

class Person {
    constructor() {
        this.x = 10;
        this.y = 500;
        console.log('Executed from Person class');
    }

    add(){
        return this.x + this.y;
    }
}

module.exports = Person;