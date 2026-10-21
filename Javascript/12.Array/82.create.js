let browsers = ["Chrome", "Firefox", "Safari"];

let scores = new Array(3);// creates [empty x 3]
scores[0] = "1";//putting value at index 0
let scores1=[3]  // creates [3]  / 1 element
console.log(scores);
console.log(scores1);
 
//new Array(3);       // 3 empty slots
//new Array(1, 2, 3); // 3 elements: 1, 2, 3
//new Array("3");     // 1 element: "3" (a string)

let scores2 = new Array(1, 2, 3);
let numbers = new Array(100, 200, 300, 400);


let test = Array.of(10, 20, 30, 40, 50);
console.log(test.length);

// Array.from()
let chars = Array.from("hello");
chars[1]= "E";
console.log(chars);
// ["h", "E", "l", "l", "o"]