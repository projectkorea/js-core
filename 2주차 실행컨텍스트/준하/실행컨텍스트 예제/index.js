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

var foo = {
    bar: function () {
        return this.baz;
    },
    baz: 1,
};

// 1. 익명함수
(function () {
    return console.log(typeof arguments[0]());
})(foo.bar);

// 2. 함수
function execFoo() {
    return console.log(typeof arguments[0]());
}
execFoo(foo.bar);

// 3.
console.log(foo.bar());

// parameter구나, argmuent가 아니라;;;;;
// function execFoo(foo.bar) {
//     return console.log(typeof arguments[0]());
// }
