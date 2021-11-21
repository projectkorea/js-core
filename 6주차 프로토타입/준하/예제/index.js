var Constructor = function (name) {
    this.name = name;
};

Constructor.prototype.method1 = function () {};
Constructor.prototype.property1 = `constructor prototype property`;

var instance = new Constructor('instance');
console.dir(Constructor);
console.dir(instance);

var Person = function (name) {
    this.name = name;
};
Person.prototype.getName = function () {
    return this.name;
};
var junha = new Person('김준하');
junha.getName = function (name) {
    return `SPECIAL HERO! + ${this.name}`;
};
// console.log(junha.getName());

// //
// const arr1 = [1, 2];
// console.dir(arr1);
// //
// console.dir(Object);
// //
// console.log('this is start');
// var arr2 = [1, 2];
// var arr3 = new arr2.constructor(3, 4);
// var arr4 = new Array(3, 4);
// console.log(arr3);
// console.log(arr4);

var Grade = function () {
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < args.length; i++) {
        this[i] = args[i];
    }
    this.length = args.length;
};
var g = new Grade(100, 80);
