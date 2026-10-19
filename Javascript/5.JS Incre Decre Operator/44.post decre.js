let a = 10;
let b = a--;
console.log(b); //10
console.log(a); //9

/* Some Examples
1.
let a = 100;
console.log(a++ + ++a +a++ + ++a); //100 + 102 + 102 + 104 = 408
console.log(a); //104

2.
let a = 37;
console.log(—a + a—); //36 + 36 =72
console.log(a); //35

3.
let a = 5;
let b = a-- - --a; // 5 - 3 =2
console.log(b, a); // 2,3

4.
let i = 1;
let r = i++ > 1 ? i++ : ++i; // 3 after else part execution
console.log(r, i); //final value same for both r and i 3,3
*/