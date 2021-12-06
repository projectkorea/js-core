## 01 콜백 함수란?
`콜백 함수`: 다른 코드의 인자로 넘겨주는 함수이다. 콜백 함수를 넘겨받은 코드는 이 콜백 함수를 필요에 따라 적절한 시점에 실행할 것 이다. 

콜백 함수는 **제어권**과 관련이 깊다.

`callback`은 '되돌아 호출해달라'는 명령이다.

어떤 `함수 X`를 호출하면서 '특정 조건일 때 `함수 Y`를 실행해서 나에게 알려달라'는 요청을 함께 보내는 것이다. 

이 요청을 받은 `함수 X`의 입장에서는 해당 조건이 갖춰졌는지 여부를 스스로 판단하고 Y를 직접 호출한다. 

이처럼 콜백 함수는 다른 코드에게 인자로 넘겨줌으로써 그 제어권도 함께 위임한 함수이다.
콜백 함수를 위임받은 코드는 자체적인 내부 로직에 의해 이 콜백 함수를 적절한 시점에 실행할 것이다. 

## 02 제어권
### 호출 시점

```js
var count = 0
var timer = setInterval(function() {
    console.log(count)
    if(++count > 4) clearInterval(timer)
}, 300)
```

setInterval을 호출할 때 두개의 매개변수를 전달했다.
1. 익명 함수
2. 300이라는 숫자

`var intervalID = scope.setInterval(func, delay[, param1, param2]);`

- `scope`에는 Window 객체 또는 Worker의 인스턴스가 들어올 수 있다. 
- func(함수)와 delay(밀리초(ms)단위의 숫자)는 반드시 전달해야하고, 세번재 매개변수부터는 선택적이다. 
- param1, param2는 func 함수를 실행할 때 매개변수로 전달할 인자이다.
- func에 넘겨준 함수는 매 delay(ms)마다 실행되며, 그 결과 어떠한 값도 리턴하지 않는다. 
- `setInterval`를 실행하면 반복적으로 실행되는 내용 자체를 특정할 수 있는 고유한 ID 값이 반환된다. 이를 변수에 담는 이유는 반복 실행되는 중간에 종료(`clearInterval`)할 수 있게 하기 위해서이다.

```js
var counter = 0
var vbFunc = function () {
    console.log(count)
    if(++count > 4) clearInterval(timer)
}
var timer = setInterval(cbFunc, 300)
//실행 결과
// 0 (0.3초)
// 1 (0.6초)
// 2 (0.9초)
// 3 (1.2초)
// 4(1.5초)
```
- timer 변수에는 setInterval의 ID 값이 담긴다.
- setInterval에 전달한 첫번째 인자인 cbFunc 함수(이 함수가 **콜백함수**)는 0.3초마다 자동으로 실행될 것이다. 

code|호출주체|제어권
----|-------|------
cbFunc()|사용자|사용자
setInterval(cbFunc,300)|setInterval|setInterval

이처럼 콜백 함수의 제어권을 넘겨받은 코드는 콜백 함수 호출 시점에 대한 제어권을 가진다. 

### 인자
```js
var newArr = [10, 20, 30].map(function (currentValue, index){
    console.log(currentValue, index)
    return currentValue + 5
})
console.log(newArr)
// 실행결과
//10 0 
//20 1
//30 2
//[15,25,35]
```

**Array의 prototype에 담긴 map 메서드의 구조**
```js
Array.prototype.map(callback[, thisArg])
callback: function(currentValue, index, array)
```
- map 메서드는 첫번재 인자로 callback 함수를 받고, 생략 가능한 두번째 인자로 콜백 함수 내부에서 this로 인식할 대상을 특정할 수 있다. 
- thisArg를 생략할 경우에는 일반적인 함수와 마찬가지로 전역객체가 바인딩된다. 

map 메서드는 메서드의 대상이 되는 배열의 모든 요소들을 처음부터 끝까지 하나씩 꺼내어 콜백 함수를 반복 호출하고, 콜백 함수의 실행 결과들을 모아 새로운 배열을 만든다. 

`제어쿼리`의 메서드들은 기본적으로 첫번째 인자에 index가, 두번째 인자에 currentValue가 온다. 
만약 map 메서드를 제이쿼리의 방식처럼 순서를 바꾸어 사용해보면?

```js
var newArr2 = [10,20,30].map(function(index, currentValue){
    console.log(index, currentValue)
    return currentValue + 5
})
console.log(newArr2)
//실행 결과
//10 0 
//20 1
//30 2
//[5,6,7]
```
컴퓨터는 그저 첫 번째, 두 번째의 순서에 의해서만 각각을 구분하고 인식한다. 

### this
콜백함수도 함수이기 때문에 기본적으로 `this`가 전역객체를 참조하지만, 제어권을 넘겨받을 코드에서 콜백 함수에 별도로 `this`가 될 대상을 지정한 경우에는 그 대상을 참조하게 된다. 

별도의 this를 지정하는 방식을 이해하기 위해 map메서드를 구현해보자

```js
Array.prototype.map = function(callback, thisArg){
    var mappedArr = []
    for (var i = 0; i<this.length; i++){
        var mappedValue = callback.call(thisArg || window, this[i],i,this)
        mappedArr[i] = mappedCalue
    }
    return mappedArr
}
```
메섣 구현의 핵심은 `call/apply` 메서드에 있다. 
this에는 thisArg 값이 있을 경우에는 그 값을, 없을 경우에는 전역객체를 지정하고 첫번째 인자에는 메서드의 this가 배열을 가리킬 것이므로 배열의 i 번째 요소 값을, 두번째 인자에는 i 값을, 세번째 인자에는 배열 자체를 지정해 호출한다. 
그 결과 변수 mappedValue에 담겨 mappedArr의 i 번재 인자에 할당된다. 

```js
setTimeout(function(){ console.log(this)}, 300) //(!) Window{...}

[1,2,3,4,5].forEach(function(x){ //(2) Window{...}
    console.log(this)
})

document.body.innerHTML += `<button id="a">클릭</button>`
document.body.querySelector('#a')
    .addEventListener('click', function(e){
        console.log(this, e) //(3) <button id="a">클릭</button>
    })                      // MouseEvent{isTrusted: true, ..}
```

- (1): `setTimeout`은 내부에서 콜백 함수를 호출할 때 `call` 메서드의 첫 번째 인자에 전역 객체를 넘기기 때문에 콜백 함수 내부에서의 this가 전역객체를 가리킨다. 
- (2): `forEach`는 별도의 인자로 this를 받는 경우에 해당하지만 별도의 인자로 this를 넘겨주지 않았기 때문에 전역객체를 가리키게 된다. 
- (3): `addEventListener`는 내부에서 콜백 함수를 호출할 때 call 메서드의 첫 번째 인자에 `addEventListener` 메서드의 this를 그대로 넘기도록 정의돼 있기 때문에 콜백 함수 내부에서의 this가 `addEventListener`를 호출한 주체인 html 엘리먼트를 가리키게 된다. 

## 03 콜백함수는 함수다
콜백함수는 함수이다. 
콜백함수로 어떤 객체의 메서드를 전달하더라도 그 메서드는 메서드가 아닌 함수로서 호출된다. 

```js
var obj = {
    vals: [1,2,3],
    logValues: function(v,i){
        console.log(this,v,i)
    }
}

obj.logValues(1,2)  // (1) {vals: [1,2,3], logValues: f} 1 2  
[4,5,6].forEach(obj.logValues) // (2) Window {...} 4 0
                               // Window {...} 5 1
                               // Window {...} 6 2
```
- (1): 메서드 이름 앞에 `점`이 있으니 메서드로서 호출한 것이다. 따라서 `this`는 `obj`를 가리키고, 인자로 넘어온 1,2가 출력된다.
- (2): 이 메서드를 `forEach` 함수의 콜백 함수로서 전달했다. 이 함수는 메서드로서 호출할때가 아닌 한 `obj`와의 직접적인 연관이 없어진다. `forEach`에 의해 콜백이 함수로서 호출되고, 별도로 `this`를 지정하는 인자를 지정하지 않았으므로 함수 내부에서의 `this`는 전역객체를 바라보게 된다. 

어떤 함수의 인자에 객체의 메서드를 전달하더라도 이는 결국 **메서드가 아닌 함수**일 뿐이다. 

## 콜백 함수 내부의 this에 다른 값 바인딩하기
콜백 함수 내부에서 this가 객체를 바라보게 하고 싶다면 어떻게 해야할까요?
별도의 인자로 this를 받는 함수의 경우에는 여기에 원하는 값을 넘겨주면 되지만 그렇지 않은 경우에는 this의 제어권도 넘겨주게 되므로 사용자가 임의로 값을 바꿀 수 없다. 

그래서 전통적으로 `this`를 다른 변수에 담아 콜백 함수로 활용할 함수에서는 this 대신 그 변수를 사용하게 하고, 이를 클로저로 만드는 방식이 많이 쓰였다. 

**콜백 함수 내부의 this에 다른 값을 바인딩하는 방법- 전통적인 방식**
```js
var obj1 = {
    name: 'obj1',
    func: functions(){
        var self = this
        return function(){
            console.log(self.name)
        }
    }
}
var callback = obj1.func()
setTimeout(callback, 1000)
```

obj1.func 메서드 내부에서 `self` 변수에 `this`를 담고, **익명 함수를 선언과 동시에 반환**했다. 
obj1.func를 호출하면 앞서 선언한 내부함수가 반환되어 callback 변수에 담긴다. 
이 callback을 setTimeout 함수에 인자로 전달하면 1초 뒤 callback이 실행되면서 'obj1'을 출력할 것이다. 

이 방식은 실제로 `this`를 사용하지도 않을 뿐더러 번거롭다.

**콜백 함수 내부에서 this를 사용하지 않는 경우**
```js
var obj1 = {
    name: 'obj1',
    func: function(){
        console.log(obj1.name)
    }
}
setTimeout(obj1.func, 1000)
```
첫번째 예제에서 this를 사용하지 않았을 때의 결과이다.
훨씬 간결하고 직관적이지만 이제는 작성한 함수를 this를 이용해 다양한 상황에 재활용할 수 없게 되어버렸다. 

**첫번째 예제의 func 함수 재활용**
```js
var obj2 = {
    name:'obj2',
    func: obj1.func
}
var callback2 = obj2.func()
setTiemout(callback2, 1500) //obj2 출력

var obj3 = {name:'obj3'}
var callback3 = obj1.func.call(obj3)
setTimeout(callback3, 2000) //obj3 출력
```

이제는 전통적인 방식의 아쉬움을 보완하는 훌륭한 방법이 있다.
바로 ES5에서 등장한 `bind` 메서드를 이용하는 방법이다. 
```js
var obj1 = {
    name: 'obj1',
    func: function(){
        console.log(this.name)
    }
}
setTimeout(obj1.func.bind(obj1), 1000)

var obj2 = {name:'obj2'}
setTimeout(obj1.func.bind(obj2), 2500)
```

## 콜백 지옥과 비동기 제어 
콜백 지옥은 콜백 함수를 익명 함수로 전달하는 과정이 반복되어 코드의 들여쓰기 수준이 감당하기 힘들 정도로 깊어지는 현상이다. 

주로 이벤트 처리나 서버 통신과 같이 비동기적인 작업을 수행하기 위해 이런 형태가 자주 등장하곤 하는데, 가독성이 떨어질뿐더러 코드를 수정하기도 어렵다. 

- 동기적인 코드: 현재 실행 중인 코드가 완료된 후에야 다음 코드를 실행하는 방식
- 비동기적인 코드: 현재 실행 중인 코드의 완료 여부와 무관하게 즉시 다음 코드로 넘어간다. 

**콜백 지옥 예시**
```js
setTimeout(function (name){
    var coffeeList = name
    console.log(coffeeList)
    
    setTimeout(function(name){
        coffeeList += ", " + name
        console.log(coffeeList)

        setTimeout(function(name){
            coffeeList += ", " + name
            console.log(coffeeList)

            setTimeout(function(name){
                coffeeList += ", " + name
                console.log(coffeeList)
            }, 500, '카페라떼')
     }, 500,' 카페모카')
    }, 500, '아메리카노')
}, 500, '에스프레소')

//에스프레소
// 에스프레소, 아메리카노
//에스프레소, 아메리카노,  카페모카
//에스프레소, 아메리카노,  카페모카, 카페라떼
```

0.5초 주기마다 커피 목록을 수집하고 출력한다.
각 콜백은 커피 이름을 전달하고 목록에 이름을 추가한다. 
목적달성에는 지장이 없지만 들여쓰기 수준이 과도하게 깊어졌을뿐더러 값이 전달되는 순서가 '아래에서 위로'향하고 있어 어색하게 느껴진다. 

- 가독성 문제와 어색함을 동시에 해결하는 가장 간단한 방법은 익명의 콜백함수를 `모두 기명함수로 전환`하는 것이다.

**콜백 지옥 해결 - 기명함수로 변환**
```js
var coffeeList = ''

var addEspresso = function(name){
    coffeeList = name
    console.log(coffeeList)
    setTimeout(addAmericano, 500, '아메리카노')
}
var addAmericano = function(name){
    coffeeList += ', ' + name
    console.log(coffeeList)
    setTimeout(addMocha, 500, '카페모카')
}
var addMocha = function(name){
    coffeeList += ', ' + name
    console.log(coffeeList)
    setTimeout(addLatte, 500, '카페라떼')
}
var addLattee = function(name){
    coffeeList += ', ' + name
    console.log(coffeeList)
}

setTimeout(addEspresso, 500, '에스프레소')
```

일회성 함수를 전부 변수에 할당하는 것이 마뜩잖을 수 도 있다. 
코드명을 일일이 따라다녀야 해서 오히려 헷갈릴 수 도 있다.

자바스크립트 진영은 비동기적인 일련의 작업을 동기적으로, 혹은 동기적인 것처럼 보이게끔 처리해주는 장치를 마련하고자 노력했다.
- ES6에서는 `promise`, `Generator` 등이 도입됐고
- ES2017에서는 `async/await`가 도입됐다. 

**비동기 작업의 동기적 표현 - Promise**
```js
new Promise(function (resolve){
    setTimeout(function (){
        var name = '에스프레소'
        console.log(name)
        resolve(name)
    }, 500)
}).then(function (prevName){
    return new PRomise(function (resolve){
        setTimeout(function(){
            var name = preName + ', 아메리카노'
            console.log(name)
            resolve(name)
        },500)
    })
}). then(function(prevName){
    return new Promise(function (resolve){
        setTimeout(function(){
            var name = prevName +', 카페모카'
            console.log(name)
            resolve(name)
        }, 500)
    })
}).then(function (prevName){
    return new Promise(function (resolve){
        setTimeout(function(){
            var name = prevName + ', 카페라떼'
            console.log(name)
            resolve(name)
        }, 500)
    })
})
```
new 연산자와 함께 호출한 `Promise`의 인자로 넘겨주는 콜백 함수는 호출할 때 바로 실행되지만 그 내부에 `resolve` 또는 `reject` 함수를 호출하는 구문이 있을 경우 둘 중 하나가 실행되기 전까지는 `then` 또는 `catch`로 넘어가지 않는다. 
따라서 비동기 작업이 완료될 때 비로소 `resolve` 또는 `reject`를 호출하는 방법으로 비동기 작업의 동기적 표현이 가능하다. 


**비동기 작업의 동기적 표현 - Promise(2)
```js
var addCoffee = function (name) {
    return function (prevName){
        return new Promise(function (resolve){
            setTimeout(function(){
                var newName = prevName ? (prevName + ',' + name) : name
                console.log(newName)
                resolve(newName)
            }, 500)
        })
    }
}
addCoffee('에스프레소')()
    .then(addCoffee('아메리카노))
    .then(addCoffee('카페모카'))
    .then(addCoffee('카페라떼'))
```

반복적인 내용을 함수화해서 더욱 짧게 표현한 것이다. 

**비동기 작업의 동기적 표현 - Generator**
```js
var addCoffee = function(prevName, name){
    setTimeout(function(){
        coffeeMaker.next(prevName ? prevName + ', ' + name: name)
    }, 500)
}

var coffeeGenerator = function* () {
    var espresso = yield addCoffee('','에스프레소')
    console.log(espresso)
    var americano = yield addCoffee(espresso,'아메리카노')
    console.log(americano)
    var mocha = yield addCoffee(americano, '카페모카')
    console.log(mocha)
    var latte = yield addCoffee(mocha, '카페라떼')
    console.log(latte)
}
var coffeeMaker = coffeeGenerator()
coffeeMaker.next()
```

`*` 붙은 함수가 바로 `Generator` 함수이다.
`Generator` 함수를 실행하면 Iterator가 반환되는데, Iterator는 `next`라는 메서드를 가지고 있다. 
이 `next` 메서드를 호출하면 `Generator` 함수 내부에서 가장 먼저 등장하는 `yield`에서 함수의 실행을 멈춘다. 이후 다시 next 메서드를 호출하면 앞서 멈췄던 부분부터 시작해서 그 다음에 등장하는 `yield`에서 함수의 실행을 멈춘다. 

그러니까 비동기 작업이 완료되는 시점마다 `next` 메서드를 호출해준다면 `Generator` 함수 내부의 소스가 위에서부터 아래로 순차적으로 진행된다. 

**비동기 작업의 동기적 표현 - Promsie + Async/awiat**
```js
var addCoffee = function (name) {
    return new Promise(function (resolve){
        setTimeout(function(){
            resolve(name)
        }, 500)
    })
}
var coffeeMaker = async function(){
    var coffeeList = ''
    var _addCoffee = async function (name){
        coffeeList += (coffeeList ?',':'')+ await addCoffee(name)
    }
    await _addCoffee('에스프레소')
    console.log(coffeeList)
    await _addCoffee('아메리카노')
    console.log(coffeeList)
    await _addCoffee('카페모카')
    console.log(coffeeList)
    await _addCoffee('카페라떼')
    console.log(coffeeList)
}
coffeeMaker()
```
비동기 작업을 수행하고자 하는 함수 앞에 `async`를 표기하고, 함수 내부에서 실질적인 비동기 작업이 필요한 위치마다 `await`를 표기하는 것만으로 뒤의 내용을 `Promise`로 자동 전환하고 해당 내용이 resolve 된 이후에야 다음으로 진행한다.
즉 `promise`의 `then`과 흡사한 효과를 얻을 수 있다. 

**주의할점**
비동기 처리 메서드가 꼭 프로미스를 반환해야 await가 의도한 대로 동작합니다.

**퀴즈**
https://velog.io/@modolee/jsconf2020-karrot-market-quiz
https://www.codingame.com/playgrounds/347/javascript-promises-mastering-the-asynchronous/its-quiz-time
https://danlevy.net/javascript-promises-quiz/