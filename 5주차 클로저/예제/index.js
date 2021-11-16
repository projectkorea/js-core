var outer = function () {
    var a = 1;
    var inner = function () {
        return ++a;
    };
    return inner; // inner함수 자체를 반환
};
var outer2 = outer;
console.log(outer2()); // 2
console.log(outer2()()); // 3
console.log('----------------------------');

var createCar = function () {
    var fuel = Math.ceil(Math.random() * 10 + 10);
    var power = Math.ceil(Math.random() * 3 + 2);
    var moved = 0;
    return {
        get moved() {
            return moved;
        },
        run: function () {
            var km = Math.ceil(Math.random() * 6);
            var wasteFuel = km / power;
            if (this.fuel < wasteFuel) {
                console.log('이동불가');
                return;
            }
            fuel -= wasteFuel;
            moved += km;
            console.log(km + 'km 이동 (총' + moved + 'km). 남은 연료: ' + fuel);
            debugger;
        },
    };
};

var car = createCar();
var car1 = createCar();
var car2 = createCar();
car.run();
car.fuel = 1000;
console.log(car.fuel);
car.run();
car1.run();
car2.run();
car1.run();
