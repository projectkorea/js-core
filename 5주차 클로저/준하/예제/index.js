var fruits = ['apple', 'banana', 'peach'];
var $ul = document.createElement('ul');

fruits.forEach(function (fruit) {
    // A 함수
    var $li = document.createElement('li');
    $li.innerText = fruit;
    $li.addEventListener('click', function () {
        // B 함수
        alert('your choice is ' + fruit);
    });
    $ul.appendChild($li);
});
document.body.appendChild($ul);

{
    var fruits = ['apple', 'banana', 'peach'];
    var $ul = document.createElement('ul');

    var alertFruit = function (fruit) {
        alert('your choice is' + fruit);
    };

    fruits.forEach(function (fruit) {
        var $li = document.createElement('li');
        $li.innerText = fruit;
        $li.addEventListener('click', alertFruit);
        $ul.appendChild($li);
    });
    document.body.appendChild($ul);
}

{
    var fruits = ['apple', 'banana', 'peach'];
    var $ul = document.createElement('ul');
    var alertFruit = function (fruit) {
        alert('your choice is' + fruit);
        console.log(e);
    };

    fruits.forEach(function (fruit) {
        var $li = document.createElement('li');
        $li.innerText = fruit;
        $li.addEventListener('click', alertFruit.bind(null, fruit));
        //.bind(thisArg[,arg1[,arg2]])
        $ul.appendChild($li);
    });

    document.body.appendChild($ul);
}

// {
//     console.clear();
//     function outer(value) {
//         return function () {
//             console.log(value);
//         };
//     }
//     const inner = outer('hi World');
//     inner();
// }
// var outer = function () {
//     var a = 1;
//     var inner = function () {
//         return ++a;
//     };
//     return inner; // inner함수 자체를 반환
// };
// var outer2 = outer;
// console.log(outer2()); // 2
// console.log(outer2()()); // 3
// console.log('----------------------------');

// var createCar = function () {
//     var fuel = Math.ceil(Math.random() * 10 + 10);
//     var power = Math.ceil(Math.random() * 3 + 2);
//     var moved = 0;
//     return {
//         get moved() {
//             return moved;
//         },
//         run: function () {
//             var km = Math.ceil(Math.random() * 6);
//             var wasteFuel = km / power;
//             if (this.fuel < wasteFuel) {
//                 console.log('이동불가');
//                 return;
//             }
//             fuel -= wasteFuel;
//             moved += km;
//             console.log(km + 'km 이동 (총' + moved + 'km). 남은 연료: ' + fuel);
//             debugger;
//         },
//     };
// };

// var car = createCar();
// var car1 = createCar();
// var car2 = createCar();
// car.run();
// car.fuel = 1000;
// console.log(car.fuel);
// car.run();
// car1.run();
// car2.run();
// car1.run();

// {
//     console.clear();
//     var partial = function () {
//         var originalPartialArgs = arguments;
//         var func = originalPartialArgs[0];
//         if (typeof func !== 'function') {
//             throw new Error('첫 번째 인자가 함수가 아닙니다.');
//         }
//         return function () {
//             var partialArgs = Array.prototype.slice.call(
//                 originalPartialArgs,
//                 1
//             ); // 미리 받은 아규먼트
//             // call의 두번째 파라메터는 slice의 아규먼트로 들어간다.
//             // 따라서 slice(1)이 되고 이는 arguments[1:]을 의미한다.
//             var restArgs = Array.prototype.slice.call(arguments); // 나중에 받을 아규먼트
//             return func.apply(this, partialArgs.concat(restArgs));
//         };
//     };
//     // 참고: Array.prototype.slice.call(arguments)는 유사배열객체를 배열로 만드는 코드

//     var add = function () {
//         var result = 0;
//         for (var i = 0; i < arguments.length; i++) {
//             result += arguments[i];
//         }
//         return result;
//     };
//     var addPartial = partial(add, 1, 2, 3, 4, 5); // add~5 매게변수가 클로저 형성
//     console.log(addPartial(6, 7, 8, 9, 10)); // 5

//     var dog = {
//         name: '강아지',
//         greet: partial(function (prefix, suffix) {
//             return prefix + this.name + suffix;
//         }, '왈왈'),
//     };
//     console.log(dog.greet('입니다.'));
// }
