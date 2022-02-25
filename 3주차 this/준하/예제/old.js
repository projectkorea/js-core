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

//
console.log('-------------------------------------');
var obj3 = {
  outer: function () {
    console.log(this);
    var innerFunc = () => {
      console.log(this);
    };
    innerFunc();
  },
};
obj3.outer();

//
console.log('-------------------------------------');
let glob;
const obj5 = {
  name: 'jh',
  getName: function () {
    glob = this;
    console.log(this);
    setTimeout(() => {
      console.log(this);
    });
  },
};
obj5.getName();
console.log(this);
console.log(glob);

//
console.log('-------------------------------------');
let glob2;
const obj52 = {
  name: 'jh',
  getName: function () {
    function getFirstLetter() {
      return this;
    }
    glob2 = this;
    console.log(this); // 1
    setTimeout(() => {
      console.log(this); // 2
    });
    console.log(getFirstLetter()); // 3
  },
};
obj52.getName();
console.log(this); // 4
console.log(glob2); // 5

console.clear();

var obj1 = {
  name: 'obj1',
  func: function () {
    console.log(this.name);
  },
};
setTimeout(obj1.func.bind(obj1), 1000);

var obj2 = { name: 'obj2' };
setTimeout(obj1.func.call(obj2), 1500);

Promise.reject;
