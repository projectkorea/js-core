let human = {
    face: 'handsome',
    height: 1.8,
    weight: 80,
};

console.log(`human의 face 스펙입니다. ${human.face}`);

ork = human;
ork.face = 'beautiful';

console.log(`ork의 face스펙입니다. ${ork.face}`);
console.log(`human의 face스펙입니다. ${human.face}`);

var result = {};
console.log(result, typeof result);

result = 1;
console.log(result, typeof result);

var arr1 = [];
arr1.length = 3;
console.log(arr1);
