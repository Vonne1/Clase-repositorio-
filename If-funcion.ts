import * as readline from "readline-sync"
    console.log("Ingresa tu edad");
let edad : number = readline.questionInt();
if (edad >= 18) 
{console.log("Es mayor de edad")}
else {console.log("Es menor de edad")}