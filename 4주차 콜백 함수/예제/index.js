var target = Array.prototype.map;
console.log(target);
console.log(target.this);
console.log('--------------------------------');

Array.prototype.map = function (callback, thisArg) {
  var mappedArr = [];
  console.log(this); // this가 array인 이유는 map의 대상 객체 앞이라서?
  // function이 메소드로 작동하니까 this는 prototype을 노린 것
  for (var i = 0; i < this.length; i++) {
    var mappedValue = callback.call(thisArg || window, this[i], i, this);
    mappedArr[i] = mappedValue;
  }
  return mappedArr;
};
// map은 메서드고, map안에 있는 callback은 콜백 "함수"다.

function add5(x) {
  return x + 5;
}
console.log([1, 2, 3].map(add5));

// v,i는 undefiend가 출력되야하지 않나
var obj = {
  vals: [1, 2, 3],
  logValues: function (v, i) {
    console.log(this, v, i);
  },
};
[4, 5, 6].forEach(obj.logValues);
// forEach callback의 parameter 순서는
// currentValue, Index, Array이다.
// 따라서 undefiend가 나오지 않고 4 0 5 1 6 2 가 나온다.

// Q-1.setTimeout(obj1.func, 1000);하면 되는거 아닌가
// A-1 콜백함수가 함수로서 , obj1의 메서드의 내부 함수과 반환되어 this가 obj1을 참조하게 된다.
// Q-2.this를 바인딩 왜해? console.log(this.name)하면 되는거 아닌가
// A-2. return에 함수가 더 있기 때문에 값을 저장안하면 this는 전역객체를 참조하기 때문이다.

var obj1 = {
  name: 'obj1',
  func: function () {
    var self = this;
    return function () {
      console.log(self.name);
    };
  },
};
var callback = obj1.func();

setTimeout(callback, 1000);
