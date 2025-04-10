"use strict";
//Nota
//let=palabra reservada y sirve para declarar variables
Object.defineProperty(exports, "__esModule", { value: true });
//let nombre: string = ""; 
var readline = require("readline-sync");
console.log("Ingresa dos números:");
var num1 = readline.questionInt();
var num2 = readline.questionInt();
var suma = num1 + num2;
console.log("La suma es:" + suma);
