# 04 콜백 함수

## 1. 콜백함수란?

- 함수의 인자로써 넘겨지며, 자신의 **제어권**도 함께 위임하는 함수다.

## 2. 제어권

1. 호출 시점
2. 인자 순서
3. `this`


### 2-1) 호출 시점
- 콜백 함수를 넘겨받은 함수는 콜백 함수를 필요에 따라 **적절한 시점**에 실행한다.

#### sctInterval의 구조

```js
var intervalID = scope.setInterval(func, delay[, param1, param2,...])
```
- `scope`: `Window` 객체 || `Worker`의 인스턴스
- `setInterval()`: 고유한 ID값 반환
- `clearInterval(setIntervalID)`: `setInterval` 멈추기

```js
var count = 0
var cbFunc = function() {
    console.log(count)
    if(++count > 4) clearInterval(timer)
}
var timer = setInterval(cbFunc,300)
```


|함수|호출주체|제어권|
|:-----|:-----:|:---------:|
|`cbFunc()`|사용자|사용자|
|`setInterval(cbFunc, 300)`|`setInterval`|`setInterval`|


### 2-2) 인자

- `map()`은 콜백 함수를 호출할 때, 인자에 **어떤 값**들을 **어떤 순서**로 넘길 것인지 **제어권을** 가진다.

```js
var newArr = [10, 20, 30].map(function(currentValue, index){
    console.log(currentValue, index)
    return currentValue + 5
})
console.log(newArr)
```


### 2-3 this

- 콜백 함수는 함수로써 호출되기 떄문에,`this`는 전역객체를 참조한다.
- 하지만 `this`가 될 대상을 명시적으로 지정할 경우, 그 대상을 참조한다.

#### 예시) 명시적 this 바인딩
```js
Array.prototype.map = function(callback, thisArg) {
    var mappedArr = []
    for(var i =0; i<this.length; i++){
        var value = callback.call(thisArg || window, this[i], i, this)
        mappedArr[i] = value
    }
    return mappedArr
}
```
- `callback.call(thisArg || window, this[i], i, this)`
- `callback.call(thisArg, value, index, array)`
- `thisArg || window`: `this` 바인딩 대상 객체
- `this`: array 인스턴스
- `this[i]`: 배열 내부의 값


#### 예시) 콜백함수 내부에서의 this

```js
setTimeout(function() {
    console.log(this) // Window
},300) 
```

- `setTimeout`: 콜백함수를 호출할 때 `call` 메서드를 통해 전역객체를 넘겨주기 때문에 `this`가 전역객체를 가리킨다. 

```js
[1,2,3,4,5].forEach(function(x){
    console.log(this) // Window
})
```

- `forEach`: 별도의 인자로 `this`를 넘겨받지 않았기 때문에 전역객체를 가리킨다. 

```js
document.body.innerHTML += '<button id="a">클릭</button>'
document.body.querySelector('#a')
    .addEventListener('click', function(e) {
        console.log(this,e) // <button>...</button>, MouseEvent
})
```

- `addEventListener`: 콜백 함수를 호출할 때, `call` 메서드를 통해 `addEventListener`를 **호출한 주체**인 **HTML엘리먼트**를 넘겨주기 때문에 `this`는 **HTML엘리먼트**를 가리킨다.


## 3. 콜백 함수는 함수다.

- 콜백 함수로 객체의 메서드를 전달하더라도 그 메서드는 메서드가 아닌 **함수로써 호출**된다.

```js
var obj = {
    vals:[1,2,3],
    logValues: function(v,i){
        console.log(this,v,i)
    }
}
obj.logValues(1,2)           
// obj, 1, 2

[4,5,6].forEach(obj.logValues) 
// Window, 4, 0
// Window. 5, 1
```

- `obj.logValues(1,2)`: **메서드**로 호출되어 `this`는 `obj`를 가리킴
- `forEach(obj.logValues)`: `forEach`의 콜백 **함수**로서 호출되어, `this`는 `Window`를 가리킴


## 4. 콜백함수 내부의 this에 다른 값 바인딩하기

- 객체의 메서드를 콜백함수로 전달하면 해당 객체를 바라보지 않는다.
- 그럼에도 불구하고 콜백함수 내부에서 this가 객체를 바라보게 하려면 어떻게 할까?

### 예시1) 전통적인 방식: 콜백함수 내부의 this에 다른 값을 바인딩
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
- 불필요한 코드가 많아, 가독성이 나쁘다.
- 명시적으로 `obj1`을 지정했기 때문에 다른 객체를 바라볼 수 없다.
- `self`라는 변수를 따로 생성해, 메모리 낭비를 야기한다.


### 예시2) 콜백함수 내부에서 this를 사용하지 않은 경우
```js
var obj1 = {
    name:'obj1',
    func: function() {
        console.log(obj1.name)
    }
}
setTimeout(obj1.func,1000)
```
- 간결하지만 `this`를 사용하지 못하여, 다른 객체에서의 재사용이 불가능하다.

### 예시3) func 함수 재활용
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

var obj2 = {
    name: 'obj2',
    func: obj1.func // ✅ 재활용 (1)
}

var callback2 = obj2.func()
setTimeout(callback2, 1500)

var obj3 = {name: 'obj3'}
var callback3 = obj1.func.call(obj3) // ✅ 재활용 (2)
setTimeout(callback3, 2000)
```
- `this`를 우회하여 다양한 상황에서 원하는 객체를 바라보는 콜백 함수를 만들 수 있는 방법이다.


### 예시4) ES5 bind 메서드
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

#### `call`, `apply`로는 바인딩하지 못할까?
- Use `.bind()` when you want that **function to later be called** with a certain context, useful in events. Use `.call()` or `.apply()` when you want to **invoke the function immediately**, and modify the context.


## 5. 콜백 지옥과 비동기 제어

### 1) 콜백지옥
- 콜백 함수를 익명 함수로 전달하는 과정이 반복되어 코드의 들여쓰기 수준이 감당하기 힘들정도로 깊어지는 현상
- 이벤트 처리, 서버 통신과 같은 비동기적인 작업을 수행할 때 자주 발생
- 코드 가독성이 심히 떨어지고, 수정하기에도 힘듦

### 2) 동기적인 코드
- 현재 실행중인 코드가 완료된 후에야 다음 코드를 실행하는 방식
- CPU의 계산에 의해 즉시 처리가 가능한 대부분의 코드
- 계산식이 복잡해서 CPU가 계산하는데 시간이 많이 필요한 경우의 코드

### 3) 비동기적인 코드
- **별도의 요청, 실행 대기, 보류** 등과 관련된 코드
- 현재 실행중인 코드의 완료 여부와 무관하게 즉시 다음 코드로 넘어감ㄴ
  - `setTimeout`:사용자의 요청에 의해 특정 시간이 경과되기 전까지 어떤 함수의 실행을 보류한다거나
  - `addEventListener`:사용자의 직접적인 개입이 있을 때 함수를 실행하도록 대기한다거나
  - `XMLHttpRequest`:별도의 대상에 무언가를 요청하고 그에 대한 응답이 왔을 때 함수를 실행하도록 대기하는 등


### 예시1) 콜백지옥
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
- 깊이가 깊어 가독성이 떨어짐
- 값이 전달되는 순서가 아래에서 위로 향함


### 예시2) 익명의 콜백 함수를 모두 기명으로 바꾸기
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

### 예시3) Promise: 비동기 작업의 동기적 표현

```js
new Promise(function(resolve){
    setTimeout(function() {
        var name = '에스프레소'
        console.log(name)
        resolve(name)
    }, 500)
}).then(function(prevName){ //prevName is resolve에 있는 (name)
    return new Promise(function(resolve){
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

### 예시4) Promise: 중복 코드 제거
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

### 예시5) Generator: 비동기 작업의 동기적 표현
```js
var addCoffee = function(prevName, name) {
    setTimeout(function(){
        coffeeMaker.next(prevName? prevName + ',' + name : name)
    }, 5000)
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

#### Generator 함수

- 키워드: `function* () {}`
- 반환 값: `Iterator` 객체
  - `Iterator` 객체는 `next` 메서드를 갖고 있다.
  - `next` 메서드를 호출하면, `Generator` 함수 내부에 가장 먼저 등장하는 `yield`까지 코드를 실행한다.
  - 이후 `next`를 호출하면 그 다음 `yield`까지 함수를 실행한다.
- 비동기 작업이 완료되는 시점마다 `next` 메서드를 호출하면 `Generator` 함수의 내부의 소스가 아래로 순차적으로 진행된다.

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
  1) 호출 시점
     - 콜백함수를 호출하는 시점을 스스로 판단해서 실행한다.
  2) 인자 순서
     - 콜백함수를 호출할 때 인자로 넘겨줄 값들은 순서가 정해져 있다.
  3) `this`
     - 콜백함수의 `this`가 무엇을 바라보도록 할지가 정해져있는 경우도 있다. 정해져있지 않으면 this는 전역객체를 바라보니 bind메서드를 활용해서 바꾸자.
- 어떤 함수에 인자로 메서드를 전달하더라도 결국 함수로서 실행된다.
- `Promise`, `Generator`, `async/await`를 활용해 효과적으로 비동기 제어를 하자.

---

### Quiz

1) 출력 결과는?
```js
const func = function() {
    console.log('당신')
    return new Promise((res)=>{
        res('개발자')
    })
}
const execute = func()
console.log('근처의')
setTimeout(()=>{
    console.log('당근개발자')
})
execute.then((msg)=>{
    console.log(msg)
})
```

2) 출력 결과는?
```js
const obj = {
    title :'자바스크립트',
    subObj: {
        title:'Javascript',
        show(func){
            console.log(this)
            return func.apply(this)
        },
    },
    show() {
        return this.subObj.show(()=>{
            return this.title
        })
    }
}
console.log(obj.show()==='자바스크립트' ? 'O' : 'X')
```
---

#### 답
1) `당신 근처의 개발자 당근개발자`
- 처리 우선순위 : Call Stack > Microtask Queue > Animation Frames > Task Queue 순으로 실행 (크롬 기준, 브라우저 마다 다를 수 있음)
<img src='https://user-images.githubusercontent.com/76730867/144958510-7f7fd171-4649-4871-8e14-cc4778eb6174.png' width='600px'>

2) `subObj O`
   1) 화살표 함수를 사용하면 `this`바인딩 과정이 생략되고, 스코프 체인 상 가장 가까운 `this`에 접근한다. `obj.show()` 실행 컨텍스트의 `this`는 호출 주체인 obj를 가리키게 되고, 따라서 화살표 함수 내부의 `return this.title`에서 `this`는 상위 스코프의 `this`인 `obj`를 가리키며 고정된다.
   2) subObj가 호출했기 때문에 `func.apply(this)`에서 `this`는 `subObj {title:Javscript}`가 맞다. 하지만 func 내부에 this 자체가 없기 때문에 바인딩이 메서드가 작동하지 않는다.
---
### Reference
https://danlevy.net/javascript-promises-quiz/

