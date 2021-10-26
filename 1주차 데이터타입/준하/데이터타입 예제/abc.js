var copyObectDeep = function (target) {
  console.log('count');
  var result = {};
  if (typeof target === 'object' && target !== null) {
    for (var prop in target) {
      result[prop] = copyObectDeep(target[prop]);
      console.log(prop);
    }
  } else {
    result = target;
  }
  return result;
};

obj1 = { 'a': ['b', 'c', ['d', 'e', ['f', 'g']]] };
var obj2 = copyObectDeep(obj1);
console.log(obj2);

target = ['x', 'y', 'z'];
for (var prop in target) {
  console.log(prop);
  console.log(target[prop]);
}
