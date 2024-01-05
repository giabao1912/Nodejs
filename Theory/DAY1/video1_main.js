
// Var can call in out scope
if(3 > 1){
    console.log("Please");
    var l = 10;
}

console.log("Age =  " + l)

// const is a constant in ES6
const pi = 3.14;

// arrow function
let sum2 = (a,b) => a + b;
console.log("Sum = " + sum2(5,8))
const squareNumber = n => n * n
console.log("Square = " + squareNumber(5))

function add(a,b) {
    return a + b;
}

// can call many time
function subtract(a,b) {
    return a - b;
}

function test(a,b,operation) {
    return operation(a,b)
}

console.log(test(7,6,subtract))


// function only use 1 time ( function same like subtract )
let k = test(5,8, function name(a,b) {
    return a - b
})

let test2 = test(8,12, (a,b) =>{
    return a + b
})

console.log(test2)