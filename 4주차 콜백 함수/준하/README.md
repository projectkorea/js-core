# 04 콜백 함수

## 1. 콜백함수란?
**콜백 함수**: 다른 코드의 인자로 넘겨주는 함수
- 콜백 함수를 넘겨받은 코드는 콜백 함수를 필요에 따라 적절한 시점에 실행한다.
- 어떤 함수 X를 호출하면서 `특정 조건` 일 때 함수 Y를 실행한다.
- 요청을 받은 함수 X는 `특정 조건`이 만족하는지 **스스로 판단**하고 Y를 호출한다.
- 콜백 함수는 함수에게 인자로 넘겨줌으로써, 그 제어권도 함께 위임하는 함수다.

## 2. 제어권
### 2-1 호출 시점
**sctInterval의 구조**
```js
var intervalID = scope.setInterval(func, delay[, param1, param2,...])
```
- scope에는 Window 객체 또는 Worker의 인스턴스가 들어올 수 있다.
- 두 객체 모두 setInterval 메서드를 제공한다.
- 매개변수: func, delay는 필수, 다른 param들은 함수 실행시 매개변수로 전달할 인자이다.
- setInterval을 고유한 ID값으로 받는다.
- 그 이유는 실행 중간에 종료할 수 있게 하기 위해서이다. **clearInterval**

```js
var count = 0
var cbFunc = function() {
    console.log(count)
    if(++count > 4) clearInterval(timer)
}
var timer = setInterval(cbFunc,300)
```
- cbFunc(): 호출 주체: 사용자, 제어권: 사용자
- setInterval(cbFunc, 300): 호출 주체: setInterval, 제어권: setInterval
- setInterval이 첫번째 인자로서 cbFunc 함수를 받으며, `콜백 함수 호출 시점에 관한 제어권`을 넘겨 받는다.

### 2-2 인자
**map 메서드 구조**
```js
Array.prototype.map(callback[, thisArg])
callback: function(currentValue, index, array)
```
- thisArg를 생략할 경우 일반적인 함수와 마찬가지로 전역객체가 바인딩 된다.
- map 메서드는 대상이 되는 배열의 모든 요소들을 콜백 함수로 반복 호출하여, 실행결과들을 모아 배열로 리턴한다.

```js
var newArr = [10, 20, 30].map(function(currentValue, index){
    console.log(currentValue, index)
    return currentValue + 5
})
console.log(newArr)
```
- map에 해당하는 인자의 순서가 바뀌면 전혀다른 값이 나온다.
- 따라서 map 메서드에 정의된 규칙에 따라 함수를 작성해야한다.
- map 메서드에 정의된 규칙에는 콜백 함수의 인자로 넘어올 값들 및 순서도 포함되어 있기 때문이다.
→ 콜백 함수의 제어권을 넘겨받은 코드(map)는 콜백 함수를 호출할 때 인자에 어떤 값들을 어떤 순서로 넘길 것인지 제어권을 가진다.


### 2-3 this
- 콜백 함수도 함수이기 때문에 this가 전역객체를 참조한다.
- 하지만 제어권을 넘겨받을 코드에서 별도로 this가 될 대상을 지정할 경우 그 대상을 참조한다.

**예시) this를 별도로 지정한 map메서드를 만든다면**
```js
Array.prototype.map = function(callback, thisArg) {
    var mappedArr = []
    for(var i =0; i<this.length; i++ ){
        var mappedValue = callback.call(thisArg || window, this[i], i, this)
        // callback에 들어갈 인자에 call메서드가 붙어 처음엔 바인딩 객체가 오고 그다음은 callback 매개변수가 들어감
        // thisArg || window: this 바인딩 대상 객체
        // this[i]: currentCalue
        // i: 인덱스
        // this: array

        mappedArr[i] = mappedValue
    }
    return mappedArr
}
```
**예시) 콜백 함수 내부에서의 this**
```js
setTimeout(function() {
    console.log(this) // Window
},300) 

[1,2,3,4,5].forEach(function(x){
    console.log(this) // Window
})

document.body.innerHTML += '<button id="a">클릭</button>'
document.body.querySelector('#a')
    .addEventListener('click', function(e) {
        console.log(this,e) // <button>...</button>, MouseEvent
})
```
- 1) setTimeout은 콜백함수를 호출할 때 call 메서드에 첫 번째 인자에 전역객체를 넘겨주기 때문에 this가 전역객체를 가리킨다. (위위 예시 참고)
- 2) forEach는 별도의 인자로 this를 넘겨받지 않았기 때문에 전역객체를 가리킨다. 
- 3) addEventListener는 콜백 함수를 호출할 때 call 메서드 첫 번째 인자에 메서드의 this를 그대로 넘기도록 정의돼있기 때문에, this가 addEventListener를 호출한 주체인 HTML엘리먼트를 가리키게 된다. 

## 3. 콜백 함수는 함수다.
- 콜백 함수로 객체의 메서드를 전달하더라도 그 메서드는 메서드가 아닌 **함수로서 호출**된다.

```js
var obj = {
    vals:[1,2,3],
    logValues: function(v,i){
        console.log(this,v,i)
    }
}
obj.logValues(1,2)             // 1) obj, 1, 2
[4,5,6].forEach(obj.logValues) // 2) Window, 4, 0 ...
```

- 1) obj객체의 logValues는 메서드로 호출되어 this는 obj를 가리킨다.
- 2) logValues는 forEach의 콜백 함수로서 호출되고, 별도의 this를 지정하는 인자를 지정하지 않았으므로 함수 내부에서의 this는 전역객체를 바라본다.
- 정리: 함수의 인자에 객체의 메서드를 전달하더라도 결국 함수일 뿐이다.

## 4. 콜백함수 내부의 this에 다른 값 바인딩하기
- 객체의 메서드를 콜백함수로 전달하면 해당 객체를 바라보지 않는다.
- 그럼에도 불구하고 콜백함수 내부에서 this가 객체를 바라보게 하려면 어떻게 할까?

**예시) 전통적인 방식: 콜백함수 내부의 this에 다른 값을 바인딩**
```js
var obj1 = {
    name: 'obj1',
    func: function() {
        var self = this
        return function() {
            console.log(self.name)
        }
    }
}
var callback =  obj1.func()
setTimeout(callback, 1000)
```
- 전반적으로 불필요한 코드가 너무 많아 이해하기 힘들다.


**예시) 콜백함수 내부에서 this를 사용하지 않은 경우**
```js
var obj1 = {
    name:'obj1',
    func: function() {
        console.log(obj1.name)
    }
}
setTimeout(obj1.func,1000)
```
- 간결하지만 this를 사용하지 못하는 단점이 있다.
- 이는 다른 객체에서의 재사용이 불가능하다는 뜻이다.

**예시) func 함수 재활용**
```js
var obj2 = {
    name: 'obj2',
    func: obj1.func
}
var callback2 = obj2.func()
setTimeout(callback2, 1500)

var obj3 = {name: 'obj3'}
var callback3 = obj1.func.call(obj3)
setTimeout(callback3, 2000)
```
- this를 우회하여 다양한 상황에서 원하는 객체를 바라보는 콜백 함수를 만들 수 있는 방법이다.
- 전통적인 방법은 명시적으로 obj1을 지정했기 때문에 다른 객체를 바라볼 수 없고, 이는 메모리 낭비를 야기한다.

**예시) ES5 bind 메서드**
```js
var obj1 = {
    name: 'obj1',
    func: function(){
        console.log(this.name)
    }
}
setTimeout(obj1.func.bind(obj1),1000)

var obj2 = {name:'obj2'}
setTimeout(obj1.func.bind(obj2), 1500)
```
- 전통적인 방법을 보완한 bind 메서드 방법이다.
- bind가 없었다면 함수 내부의 this는 전역객체를 참조한다.


## 5. 콜백 지옥과 비동기 제어
**콜백지옥란?**
- 콜백 함수를 익명 함수로 전달하는 과정이 반복되어 코드의 들여쓰기 수준이 감당하기 힘들정도로 깊어지는 현상
- 이벤트 처리나 서버 통신과 같이 비동기적인 작업을 수행할 때 자주 발생한다.
- 코드 가독성이 심히 떨어지고, 수정하기에도 힘들다.

**동기적인 코드**
- 현재 실행중인 코드가 완료된 후에야 다음 코드를 실행하는 방식
- CPU의 계산에 의해 즉시 처리가 가능한 대부분의 코드
- 계산식이 복잡해서 CPU가 계산하는데 시간이 많이 필요한 경우의 코드

**비동기적인 코드**
- 현재 실행중인 코드의 완료 여부와 무관하게 즉시 다음 코드로 넘어간다. 
- **setTimeout:**사용자의 요청에 의해 특정 시간이 경과되기 전까지 어떤 함수의 실행을 보류한다거나
- **addEventListener:**사용자의 직접적인 개입이 있을 때 함수를 실행하도록 대기한다거나
- **XMLHttpRequest:**별도의 대상에 무언가를 요청하고 그에 대한 응답이 왔을 때 함수를 실행하도록 대기하는 등
- **별도의 요청, 실행 대기, 보류** 등과 관련된 코드

**예시1) 콜백지옥**
```js
setTimeout(function(name){
    var coffeeList = name
    console.log(coffeeList)

    setTimeout(function(name){
        coffeeList += ',' + name
        console.log(coffeeList)

        setTimeout(function(name){
            coffeeList += ',' + name
            console.log(coffeeList)

            setTimeout(function(name){
                coffeeList += ',' + name
                console.log(coffeeList)
            }, 500, '카페라떼)
        }, 500, '카페모카')
    }, 500, '아메리카노')
}, 500, '에스프레소')
```
**문제점**
- 깊이가 깊음
- 값이 전달되는 순서가 아래에서 위로 향함


**예시2) 익명의 콜백 함수를 모두 기명으로 바꾸기**
```js
var coffeeList = ''

var addEspresso = function (name){
    coffeeList = name
    console.log(coffeeList)
    setTimeout(addAmericano, 500, '아메리카노')
}

var addAmericano = function (name){
    coffeeList += ',' + name
    console.log(coffeeList)
    setTimeout(addMocha, 500, '카페모카')
}

var addMocha = function (name){
    coffeeList += ',' + name
    console.log(coffeeList)
    setTimeout(addLatte, 500, '카페라떼')
}

var addAmericano = function (name){
    coffeeList += ',' + name
    console.log(coffeeList)
}

setTimeout(addEspresso, 500, '에스프레소)
```

**예시3) Promise: 비동기 작업의 동기적 표현**
```js
//Promise 매개변수에 콜백함수, 파라미터 2개
new Promise(function(resolve){
    setTimeout(function() {
        var name = '에스프레소'
        console.log(name)
        resolve(name)
    }, 500)
}).then(function(prevName){ //prevName is resolve에 있는 (name)
    return newPromise(function(resolve){
        setTimeout(function(){
            var name = prevName + ', 아메리카노'
            console.log(name)
            resolve(name) // onfull시 then의 파라메터로 넘어감
        },500)
    })
}).then(function(prevName){
    return new Promise(function(resolve){
        setTimeout(function() {
            var name = prevName + ', 카페모카'
            console.log(name)
            resolve(name)
        }, 500)
    })
}) .then(function(prevName){
    return new Promise(function(resolve){
        setTimeout(function(){
            var name = prevName + ', 카페라떼'
            console.log(name)
            resolve(name)
        })
    })
})
```
**예시4) Promise2: 비동기 작업의 동기적 표현**
```js
var addCoffee = function (name) {
    return function (prevName){
        return new Promise (function(resolve){
            setTimeout(function(){
                var newName = prevName? (prevName + ',' + name) : name
                console.log(newName)
                resolve(newName)
            },500)
        })
    }
}
addCoffee('에스프레소')()
.then(addCoffee('아메리카노'))
.then(addCoffee('카페모카'))
.then(addCoffee('카페라떼'))
```

**예시5) Generator: 비동기 작업의 동기적 표현**
```js
var addCoffee = function(prevName, name){
    setTimeout(function(){
        coffeeMaker.next(prevName? prevname + ',' + name : name)
    }, 500)
}
var coffeeGenerator = function* () {
    var espresso = yield addCoffee('', '에스프레소')
    console.log(espresso)
    var americano = yield addCoffee(espresso, '아메리카노')
    console.log(americano)
    var mocha = yield addCoffee(americano, '카페모카')
    console.log(mocha)
    var latte = yield addCoffee(mocha, '카페라떼')
    console.log(latte)
}
var coffeeMaker = coffeeGenerator()
coffeeMaker.next()
```
- *이 붙은 함수가 Generator 함수
- Generator 함수를 실행하면 Iterator가 반환된다.
- Iterator는 next 메서드를 갖고있다. 
- next 메서드를 호출하면, Generator 함수 내부에 가장 먼저 등장하는 yield에서 함수의 실행을 멈춘다.
- 이후 next를 호출하면 그다음 yield에서 함수의 실행을 다시 멈춘다.
- 비동기 작업이 완료도니느 시점마다 next 메서드를 호출하면 Generator 함수의 내부의 소스가 아래로 순차적으로 진행된다.

**예시6) Promise + Async/await 비동기 작업의 동기적 표현**
```js
var addCoffee = function(name) {
    return new Promise(function(resolve){
        setTimeout(function(){
            resolve(name)
        },500)
    })
}

var coffeeMaker = async function () {
    var coffeeList = ''
    var _addCoffee = async function (name){
        coffeeList += (conffeeList? ',' :'') + await addCoffee(name)
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
- 비동기 작업을 수행하고자 하는 함수 앞에 async 표기
- 함수 내부에서 실질적인 비동기 작업이 필요한 위치마다 await를 표기
- async/await 표기법으로 뒤의 내용을 Promise로 자동 전환하고, 해당 내용이 resolve된 이후에 다음으로 진행한다.

## 6. 정리
- 콜백 함수는 다른 코드에 인자로 넘겨줌으로써 그 제어권도 함께 위임한 함수다.
- 제어권을 넘겨받은 코드는 다음과 같은 제어권을 갖는다.
- 1) 콜백함수를 호출하는 시점을 스스로 판단해서 실행한다.
- 2) 콜백함수를 호출할 때 인자로 넘겨줄 값들은 순서가 정해져 있다.
- 3) 콜백함수의 this가 무엇을 바라보도록 할지가 정해져있는 경우도 있다. 정해져있지 않으면 this는 전역객체를 바라보니 bind메서드를 활용해서 바꾸자.
- 4) 어떤 함수에 인자로 메서드를 전달하더라도 결국 함수로서 실행된다.
- 5) Promise, Generator, async/await를 활용해 비동기 제어를 효과적으로 해보자.




