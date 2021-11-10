document.body.innerHTML += '<button id="a">클릭</button>';
console.log(document.body.querySelector('#a'));
// this하면 이것이 나옴

console.log(document.body.querySelector('#a').addEventListener);
//addeventListenr는 객체가 아닌 메서드이다.

document.body.querySelector('#a').addEventListener('click', function (e) {
  console.log(this, e);
});

var Cat = function (name, age) {
  this.sort = '고양이';
  this.name = name;
  this.age = age;
};

var choco = new Cat('초코', 7);
var nabi = new Cat('나비', 5);
console.log(choco, nabi);

//
console.log('-------------------------------------');
var func = function (x) {
  console.log(this, x);
};
func(1); // window { ...} 1
var obj = {
  method: func,
};
obj.method(2);
console.log(obj);

//
console.log('-------------------------------------');
var obj1 = {
  outer: function () {
    console.log(this); // (1)
    var innerFunc = function () {
      console.log(this); // (2) (3)
    };
    innerFunc();
    var obj2 = {
      innerMethod: innerFunc,
    };
    obj2.innerMethod();
  },
};
obj1.outer();

//
console.log('-------------------------------------');
aaa = 1;
console.log(this);
console.log(window);
//console.log(global);

//
console.log('-------------------------------------');
console.dir(Object.prototype);

//
console.log('-------------------------------------');

var obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};
// length가 없으면 0에 push가 되네?
Array.prototype.push.call(obj, 'd');
console.log(obj);

//
console.log('-------------------------------------');
function a() {
  var argv = Array.prototype.slice.call(arguments);
  argv.forEach(function (arg) {
    console.log(arg);
  });
}
a(1, 2, 3);

//
console.log('-------------------------------------');
var obj = {
  outer: function () {
    console.log(this);
    var innerFunc = () => {
      console.log(this);
    };
    innerFunc();
  },
};
obj.outer();
