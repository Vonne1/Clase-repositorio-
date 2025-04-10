"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline-sync");
console.log("Ingresa tu edad");
var edad = readline.questionInt();
if (edad >= 18) {
    console.log("Es mayor de edad");
}
else {
    console.log("Es menor de edad");
}
