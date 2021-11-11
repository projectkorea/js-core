var target = Array.prototype.map;
console.log(target);
console.log(target.this);
console.log('--------------------------------');

Array.prototype.map = function (callback, thisArg) {
  var mappedArr = [];
  console.log(this); //this가 array인 이유는 map의 대상 객체 앞이라서?
  debugger;
  for (var i = 0; i < this.length; i++) {
    console.log(this[i]);
  }
  return mappedArr;
};

function add5(x) {
  return x + 5;
}

console.log([1, 2, 3].map(add5));
