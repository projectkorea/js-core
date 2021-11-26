var obj7 = {
    name: 'junha',
};

var idiots = {
    name: 'jiwon',
    age: this,
    member: {
        roto: {
            memberName: 'roto',
            play0: function () {
                console.log(this); // roto [Object]
                console.log(idiots); // idiots [Object]
                console.log(idiots.name); // jiwon
                // 해당 메서드는 idiots가 선언되고 실행하기 때문에 idiots를 참조할 수 있음.
            },
            play1: obj7, // obj7 [Object]
            play2: obj7.name, // junha: obj7이 선언되고 나서 참조하니까 된다.
            play3: idiots, // undefined: idiots이 선언되기 전에 참조하려고함
            // play4: idiots.name, // : Cannot read properties of undefined
            play5: this, // Window: 해당 스코프 {}는 호출 주체가 전역객체(Window)이다.
            play6: this.idiots, // undefined: idiots이 선언되기 전에 참조하려고함
        },
    },
};

idiots.member.roto.play0();

// var foo = {
//     bar: function () {
//         return this.baz;
//     },
//     baz: 1,
// };

// function execFoo() {
//     return console.log(typeof arguments[0]);
// }
// execFoo(foo.bar()); // number
// execFoo(foo.bar); // undefined
