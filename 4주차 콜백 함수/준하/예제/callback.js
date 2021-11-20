let p = new Promise((resolve, reject) => {
    let a = 1 + 2;
    if (a == 2) {
        resolve('Success');
    } else {
        reject('Failed');
    }
});

p.then((message) => {
    console.log('This is the then ' + message);
})
    .catch((message) => {
        console.log('This is the then ' + message);
    })
    .finally(() => {
        console.log('This is the then Finally');
    });

var addCoffee = function (name) {
    return function (prevName) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                var newName = prevName ? prevName + ',' + name : name;
                console.log(newName);
                resolve(newName);
            }, 500);
        });
    };
};

addCoffee('에스프레소')()
    .then(addCoffee('아메리카노'))
    .then(addCoffee('카페모카'))
    .then(addCoffee('카페라떼'));
