//Nota
//let=palabra reservada y sirve para declarar variables


//let nombre: string = ""; 


import * as readline from "readline-sync"

console.log("Ingresa dos números:");
let num1:number = readline.questionInt();
let num2: number = readline.questionInt();
let suma: number = num1 + num2
console.log("La suma es:"+suma); 