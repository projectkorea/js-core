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
console.log(junha.getName());

//
const arr1 = [1, 2];
console.dir(arr1);

console.dir(Object);
