var globalVariable1 = 1;
const globalVariable2 = 2;

const outerConst = function () {
  console.log();
};

var outerVar = function () {
  console.log();
};

function outerFunc() {
  console.log();
}

function outer() {
  let outerVariable = 999;
  function inner() {
    const innerVariable = 1;
    outerVariable += 1;
  }
  inner();
}

outer();

// var foo = {
//   bar: function () {
//     return this.baz;
//   },
//   baz: 1,
// };

// (function () {
//   return typeof arguments[0]();
// })(foo.bar);

// var a = 1;
// var outer = function () {
//   var b = 2;
//   var inner = function () {
//     console.log(b);
//     console.dir(inner);
//     debugger;
//   };
//   inner();
// };
// outer();

// // 1. 익명함수
// (function () {
//   return console.log(typeof arguments[0]());
// })(foo.bar);

// // 2. 함수
// function execFoo() {
//   return console.log(typeof arguments[0]());
// }
// execFoo(foo.bar);

// // 3.
// console.log(foo.bar());

// parameter구나, argmuent가 아니라;;;;;
// function execFoo(foo.bar) {
//     return console.log(typeof arguments[0]());
// }
