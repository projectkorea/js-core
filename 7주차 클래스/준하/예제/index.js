// var Constructor = function (name) {
//     this.name = name;
// };

// Constructor.prototype.method1 = function () {};
// Constructor.prototype.property1 = `constructor prototype property`;

// var instance = new Constructor('instance');
// console.dir(Constructor);
// console.dir(instance);

var Grade = function () {
  var args = Array.prototype.slice.call(arguments);
  for (var i = 0; i < args.length; i++) {
    this[i] = args[i];
  }
  this.length = args.length;
};

// Grade.prototype = ['a', 'b', 'c', 'd'];
Grade.prototype = [];

var g = new Grade(100, 80);
g.push(90);

g.push(70);
console.log(g);
