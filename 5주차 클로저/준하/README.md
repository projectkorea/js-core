# 05. 클로저

## 1. 클로저의 의미와 원리

### 1) 클로저란 무엇인가
- 클로저는 **함수형 프로그래밍 언어**에서 자주 등장하는 특징이다.
- 다양한 서적에서 클로저를 다음과 같이 요약하고 있다.

```
1. 자신을 내포하는 함수의 컨텍스트에 접근할 수 있는 함수
2. 함수가 특정 스코프에 접근할 수 있도록 의도적으로 그 스코프에서 정의하는 것
3. 함수를 선언할 때 만들어지는 유효범위가 사라진 후에도 호출할 수 있는 함수
4. 이미 생명 주기상 끝난 외부 함수의 변수를 참조하는 함수
5. 자유변수가 있는 함수와 자유변수를 알 수 있는 환경의 결합
6. 로컬 변수를 참조하고 있는 함수 내의 함수
7. 자신이 생성될 때의 스코프에서 알 수 있었던 변수들 중, 언젠가 자신이 실행될 때 사용할 변수들만을 기억하여 유지시키는 함수
```

- **클로저**는 **내부함수에서 외부 변수를 참조하는 상황**에서 발생하는 현상을 말한다.
- 내부 함수: `함수`와
- 외부 변수: 그 함수가 선언될 당시의 `LexicalEnviornment`(`outerEnvironmentRefernce`)의
-  **상호관계에 따른 현상**이다.
- 예를 들어, B의 실행 컨텍스트가 활성화된 시점에는 B의 `outerEnvironmentReference`가 참조하는 대상인 A의 `LexicalEnviornment`에 접근이 가능하다.

### 2) 외부 함수의 변수를 참조하는 내부 함수

**예시1) 일반적인 경우**
  ```js
  var outer = function() {
      var a = 1
      var inner = function() {
          console.log(++a)
      }
      inner()
  }
  outer()
  ```

  - `inner`함수 내부에 a를 선언하지 않았기 때문에, `environtmentRecord`에서 값을 찾지 못해, `outerEnvironmentReference`에 지정된 상위 컨텍스트인 `outer`의 `LexicalEnvironment`에 접근해서 `a`를 찾는다. 
  - `outer` 함수 실행 컨텍스트가 종료되면, `LexicalEnvironment`에 저장된 식별자들 `a`, `inner`에 대한 참조를 지운다. 각 주소에 저장돼 있던 값들은 자신을 참조하는 변수가 하나도 없게 되므로 가비지 컬렉터의 수집 대상이 된다.


**예시2) 내부함수의 실행 결과를 반환하는 경우**
```js
var outer = function() {
    var a = 1
    var inner = function() {
        return ++a
    }
    return inner()    // <-- 포인트
}
var outer2 =outer() // inner() ==> return ++a
console.log(outer2) 
```

- 예시1과 동일하게 `outer`함수 실행 컨텍스트가 종료되기 이전에 `inner` 함수의 실행 컨텍스트가 종료돼 있으며, `outer` 함수의 실행 컨텍스트가 종료된 시점에는 a 변수를 참조하는 대상이 없어진다. 이후 별도로 `inner` 함수를 호출할 수 없다는 공통점이 있다.

**예시3) 내부함수 자체를 반환하는 경우**
```js
var outer = function() {
    var a = 1
    var inner = function() {
        return ++a
    }
    return inner  // inner함수 자체를 반환
}
var outer2 =outer()
console.log(outer2()) // 2
console.log(outer2()) // 3
```
- `outer` 함수
  - 실행 컨텍스트가 종료될 때, `outer2` 변수는 `inner` 함수를 참조하고, `outer2` 를 호출하면 `inner` 함수가 실행한다.
- `inner` 함수
  -  `outer` 함수 내부에서 선언됐으므로, `outerEnvironmentReference`에`outer` 함수의 `LexicalEnvironment`가 참조 복사된다.
  -  `environmentRecord`는 수집할 정보가 없다.
- 스코프 체이닝에 따라 `outer`에서 선언한 변수 a에 접근해서 1만큼 증가시키고, `inner` 함수의 실행 컨텍스트가 종료된다.

#### 여기서 잠깐!
- Question
  -  inner함수 실행 시점에는 outer 함수는 이미 실행이 종료된 상태이다.  어떻게 inner함수는 outer함수의 LexicalEnvironment에 접근할 수 있었을까?
- Answer
  -  가비지 컬렉팅(이하 G.C)의 동작 방식 때문이다. G.C는 어떤 값을 참조하는 변수가 하나라도 있다면, 그 값은 수집대상에 포함시키지 않는다. 
  - inner함수의 실행 컨텍스트가 활성화되면 `outerEnvironmentReference`가 outer 함수의 `LexicalEnvironment`를 필요할 것이므로 수집 대상에서 제외된다. 
  - (크롬이나 Node.js등에서 사용중인 V8 엔진의 경우, 내부 함수에서 실제로 사용하는 변수만 남겨두고 나머지는 GC하도록 최적화 되있다.)
---
#### 다시 클로저를 재정의 해보자!
- 클로저는 **어떤 함수에서 선언한 변수를 내부함수에서 참조할 때 발생하는 현상**이다.
- **외부 함수의 `LexicalEnvironment`가 가비지 컬렉팅 되지 않는 현상**이다.
- 즉, 클로저란 어떤 함수 A에서 선언한 변수 a를 참조하는 내부함수 B를 외부로 전달할 경우 A의 실행 컨텍스트가 종료된 이후에도 변수 a가 사라지지 않는 현상이다.
- 앞서 설명한 표현 중 아래 세 가지가 클로저 정의에 가장 근접하다.
  ```
  1. 함수를 선언할 때 만들어지는 유효범위가 사라진 후에도 호출할 수 있는 함수
  2. 이미 생명 주기가 끝난 외부 함수의 변수를 참조하는 함수
  3. 자신이 생성될 때의 스코프에서 알 수 있었던 변수들 중 언젠가 자신이 실행될 때 사용할 변수들만을 기억하여 유지시키는 함수
  ```
  ---
- 여기서 외부로 전달이 return만을 의미하는 것은 아니다.

#### Return 없이도 클로저가 발생하는 경우
**예제) setInterval / setTimeout**
```js
(function(){
    var a = 0
    var intervalID = null
    var inner = function() {
        if(++a >= 10){
            clearInterval(intervalID)
        }
        console.log(a)
    }
    intervalID = setInterval(inner, 1000)
})()
```
- window의 메서드(setTimeout, setInterval)에 전달할 콜백 함수 내부에서 지역변수를 참조한다.

**예제) eventListener**
```js
(function(){
    var count = 0
    var button = document.createElement('button')
    button.innerText = 'click'
    button.addEventListener('click', function(){
        console.log(++count, 'times clicked')
    })
    document.body.appendChild(button)
})()
```
- DOM의 메서드(addEventListener)에 등록할 handler 함수 내부에서 지역변수를 참조한다.
- 두 상황 모두 **지역변수를 참조하는 내부함수를 외부에 전달**했기 때문에 클로저다.

## 2. 클로저와 메모리 관리
- `메모리 누수`: 개발자의 의도와 달리, 어떤 값의 참조 카운트가 0이 되지 않아 GC의 수거 대상이 되지 않는 경우
- 클로저는 함수의 **지역변수를 참조**하면서 메모리가 소모된다. 지역변수의 참조가 필요하지 않을 때, 참조 카운트를 0으로 만든다면 소모됐던 메모리가 회수된다. 의도적으로 사용하는 클로저의 경우는 `메모리 누수`로 보진 않는다.
- 참고로 참조 카운트를 0으로 만드려면 식별자에 `null` 또는 `undefined`를 할당하면 된다.

### 클로저의 메모리 해제 방법

**예시1) return에 의한 클로저의 메모리 해제**
```js
var outer = (function(){
    var a = 1
    var inner = function() {
        return ++a
    }
    return inner
})()                     // var outer = inner
console.log(outer()) 
console.log(outer())

outer = null             // outer 식별자의 inner함수 참조를 끊음
```

**예시2) setInterval에 의한 클로저의 메모리 해제**
```js
(function(){
    var a = 0
    var intervalId = null
    var inner = function(){
        if(++a >= 10){
            clearInterval(intervalId)
            inner = null // inner 식별자의 함수 참조를 끊음
        }
        console.log(a)
    }
    intervalId = setInterval(inner,1000)
})()
```

**예시3) eventListener에 의한 클로저의 메모리 해제**
```js
(function(){
    var count = 0
    var button = document.createElement('button')
    button.innerText = `click`
    
    var clickHandler = function() {
        console.log(++count, 'times clicked')
        if (count >= 10){
            button.removeEventListener('click',clickHandler)
            clickHandler = null // clickHandler 식별자의 함수 참조를 끊음
        }
    }
    button.addEventListener('click', clickHandler)
    document.body.appendChild(button)
})()
```


## 3. 클로저 활용 사례

### 1) 콜백함수 내부에서 외부 데이터를 사용할 때

**공통 코드**
```js
var fruits = ['apple', 'banana', 'peach']
var $ul = document.createElement('ul')
```

**예시1) 클로저 사용 O**
```js
fruits.forEach(function(fruit){                  // A 함수
    var $li = document.createElement('li')
    $li.innerText = fruit
    $li.addEventListener('click', function() {    // B 함수
        alert('your choice is ' + fruit)
    })
    $ul.appendChild($li)
})
document.body.appendChild($ul)
```
- B 함수에서 fruit 참조하고 있기 때문에, B 함수의 `outerEnvironmentReference`가 A 함수의 `LexcialEnvironment`를 참조한다. 
- 반복을 줄이기 위해 B 함수를 외부로 분리하면 아래 코드와 같다.

**예시2) 콜백함수 분리, 클로저 사용 X**
```js
var alertFruit = function(fruit){
    alert('your choice is' + fruit)
}

fruits.forEach(function(fruit){   
    var $li = document.createElement('li')
    $li.innerText = fruit
    $li.addEventListener('click', alertFruit)
    $ul.appendChild($li)
})
document.body.appendChild($ul)
alertFruit(fruits[1]) // banana
```
- 콜백 함수의 인자에 대한 제어권을 `addEventListener`가 가졌기 때문에, 콜백 함수를 호출할 때 **첫 번째 인자에 '이벤트 객체'**를 주입하여 과일명이 아니라 이벤트 객체가 출력된다. 이는 bind메서드로 해결한다.
- fruit라는 변수자체를 이용하지 않기 때문에 클로저를 사용하지 않은 예시이다.

**예시3) bind메서드, 클로저 사용 X**
```js
fruits.forEach(function(fruit){
    var $li = document.createElement('li')
    $li.innerText = fruit
    $li.addEventListener('click', alertFruit.bind(null,fruit))
    //.bind(thisArg[,arg1[,arg2]]) 
    $ul.appendChild($li)
})
```
- bind 메서드의 첫 번째 인자가 새로 바인딩할 this인데, 생략할 수 없기 때문에 원래의 this를 유지할 수 없다. 그리고 두번째 인자에 이벤트 객체가 넘어온다.
- 따라서 이는 bind메서드가 아닌 고차함수로 해결한다.
- 새로 바인딩되었기 때문에 클로저를 사용하지 않은 예시이다.
- 엄밀히 따지면, `alertFruit.bind(null,fruit)`가 있어야 할 자리는 함수가 와야하는 것이므로, 매개변수가 들어가 따로 외부변수를 호출할 일이 없다.

**예시4) 고차함수 활용, 클로저 사용 O**
```js
var alertFruitBuilder  = function (fruit) {
    return function() {
        alert('your choice is' + fruit)
    }
}
fruits.forEach(function(fruit){
    var $li = document.createElement('li')
    $li.innerText = fruit
    $li.addEventListener('click', alertFruitBuilder(fruit))
    $ul.appendChild($li)
})
```
- 클릭 이벤트가 발생하면 `alertFruitBuilder`함수의 실행 컨텍스트가 열리면서 인자로 넘어온 fruit을 `outerEnvironmentRefrence`에 의해 참조할 수 있다.
- 즉, `alertFruitBuilder`의 실행 결과로 반환된 함수에는 클로저가 존재한다.

### 2) 접근 권한 제어(정보 은닉)를 부여할 때
- **정보은닉**이란 모듈의 내부 로직의 노출을 최소화해서 모듈 간의 결합도를 낮추고 유연성을 높이는 개념이다.
- 접근 권한에는 public, private, protected가 있다.
  - public: 외부에서 접근 가능한 것
  - private: 내부에서만 사용하며 외부에 노출되지 않는 것
- 자바스크립트는 변수 자체에 **접근 권한**을 직접 부여할 수 있도록 설계돼 있지만, 클로저를 이용하면 함수 차원에서 public한 값과 private한 값을 구분하는 것이 가능하다.

```js
var outer = function() {
    var a = 1
    var inner = function() {
        return ++a
    }
    return inner
}
var outer2 = outer()
console.log(outer2()) 
```

- 전역 공간에서는 `outer`함수를 실행할 순 있지만, 내부에 개입할 수는 없다.
- 하지만 `inner` 함수를 반환함으로써 outer함수의 지역변수인 a의 값을 외부에서도 읽을 수 있게 된다.
- 클로저를 활용하여 외부 스코프에서 함수 내부의 변수에 대한 접근 권한을 부여할 수 있게 된 것이다.
- 외부에 제공하고자 하는 정보들을 모아 return하고, 내부에서만 사용할 정보들은 return하지 않는 것으로 접근 권한 제어가 가능하다. 
- 이때 return한 변수들은 공개멤버(public member), 그렇지 않은 변수들은 비공개멤버(private member)라고 부른다.

**예시) 자동차 객체 선언**
```js
var car = {
    fuel: Math.ceil(Math.random() * 10 + 10),
    power: Math.ceil(Math.random()* 3 + 2),
    moved: 0,
    run: function() {
        var km = Math.ceil(Math.random() * 6)
        var wasteFuel = km / this.power
        if(this.fuel<wasteFuel){
            console.log('이동불가')
            return
        }
        this.fuel -= wasteFuel
        this.moved += km
        console.log(km+'km 이동 (총' + this.moved + 'km)')
    }
}

car.fuel = 10000
car.power = 100
car.moved = 1000
```

- car의 프로퍼티는 쉽게 바꿔버릴 수 있다.
- 프로퍼티 값을 바꿔버리지 않게 클로저를 활용하여 방어할 수 있다.

**예시) 클로저로 변수를 보호한 자동차 객체**
```js
var createCar = function () {
    var fuel = Math.ceil(Math.random() * 10 + 10); // 비공개멤버
    var power = Math.ceil(Math.random() * 3 + 2);  // 비공개멤버
    var moved = 0;
    return {          // 객체 생성
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
```
- 객체가 아닌 **함수**로 만들고, **필요한 멤버만을 return**한다.
- `fuel`, `power는` return값에 포함되지 않아 외부에서 접근을 제어했고, `moved` 변수는 `getter`만을 부여함으로써 읽기 전용 속성을 부여했다.
![image](https://user-images.githubusercontent.com/76730867/141715968-4f6ba45c-4150-4e3c-82bb-3b049452e0b6.PNG)
- `car.fuel = 1000;`을 통해 `fuel`값을 수정해보려고 해도, `car.fuel`에 값이 생성된다. 이는 실제 `fuel`이 `run 메서드`에서만 값으로 작동하고 있기 때문에 의미가 없다. 수정하려고 하는 `fuel`은 `createCar` 함수의 클로저 값을 참조하고 있으므로 값을 수정할 수 없게 된다.

**예시) Object.freeze()를 활용해 완벽히 변수를 보호한 자동차 객체**
```js
var createCar = function() {
    ...
    var publicMembers = {
        ...
    }
    Object.freeze(pulicMemvers)
    return publicMembers
}
```
- run 메서드를 다른 내용으로 덮어씌우는 어뷰징 까지 막았다.
- 이와 같이 객체를 return하기 전에 미리 변경할 수 없게끔 조치를 취할 수 있다.

**정리**
- 클로저를 활용해 접근권한을 제어하는 방법은 다음과 같다.
  - 1) 함수에서 지역변수 및 내부함수 등을 생성한다.
  - 2) 외부에 접근권한을 주고자 하는 대상들로 구성된 참조형 데이터를 return한다.
  - (대상이 여럿일 때는 객체 또는 배열, 하나일 때는 함수를 리턴한다.)
  - return한 변수들은 공개 멤버가 되고, 그렇지 않은 변수들은 비공개 멤버가 된다.

### 3) 부분 적용 함수
- **부분 적용 함수**란, n개의 인자를 받는 함수에 미리 m개의 인자만 넘겨 기억시켰다가, 나중에 n-m개의 인자를 넘기면 원래 함수의 실행 결과를 얻을 수 있게끔 하는 함수
- this 바인딩 과정만 제외하면 `bind` 메서드의 실행 결과와 비슷하다.

**예시1) bind 메서드를 활용한 부분 적용 함수**
```js
var add = function() {
    var result = 0
    for (var i = 0; i<arguments.length;i++){
        result += arguments[i]
    }
    return result;
}
var addPartial = add.bind(null, 1,2,3,4,5)
console.log(addPartial(6,7,8,9,10))
```
- this값을 바꾸는 단점이 있다.

**예시2) this에 관여하지 않은 부분 적용 함수**
```js
var partial = function() {
    var originalPartialArgs = arguments
    var func = originalPartialArgs[0]
    if(typeof func !== 'function'){
        throw new Error('첫 번째 인자가 함수가 아닙니다.')
    }
    return function() {
        var partialArgs = Array.prototype.slice.call(originalPartialArgs, 1) // 미리 받은 아규먼트
        // call의 두번째 파라메터는 slice의 아규먼트로 들어간다.
        // 따라서 slice(1)이 되고 이는 arguments[1:]을 의미한다.
        var restArgs = Array.prototype.slice.call(arguments) // 나중에 받을 아규먼트
        return func.apply(this, partialArgs.concat(restArgs)) // function안에의 this
    }
}
// 참고: Array.prototype.slice.call(arguments)는 유사배열객체를 배열로 만드는 코드
```
- `partial(function[, arguemnts...])`
```js
var add = function() {
    var result = 0
    for (var i =0 ;i<arguments.length;i++){
        result += arguments[i]
    }
    return result
}
var addPartial = partial(add, 1, 2, 3, 4, 5) // add~5 매게변수가 클로저 형성
console.log(addPartial(6,7,8,9,10)) // 55
```

```js
var dog = {
    name:'강아지',
    greet:partial(function(prefix, suffix){
        return prefix + this.name + suffix ;
    }, '왈왈',)
};
console.log(dog.greet('입니다.')) // 왈왈(prefix), 강아지(this.name)입니다.(suffix)
```
- 실행 시점의 this를 그대로 반영할 수 있다.

**예시3) 인자의 순서에 무관한 부분 적용 함수**

```js
Object.defineProperty(window, '_', {
    value:'EMPTY_SPACE',
    writable:false,
    configurable:false,
    enumerable:false
})
// var _ = Symbol.for('EMPTY_SPACE')

var partial2 = function () {
    var originalPartitialArgs = arguments
    var func = arguments[0];
    if (typeof func!) {
        throw new Error('첫 번째 인자가 함수가 아닙니다.`)
    }
    return function() {
        var partialArgs = Array.prototype.slice.call(originalPartialArgs,1)
        var restArgs = Array.prototype.slice.call(arguments)
        for(var i =0;i<partialArgs.length;i++){
            if(partialArgs[i] === _){ 
            // = if(partialArgs[i] === Symbol.for('EMPTY_SPACE'))
                partialArgs[i] = restArgs.shift()
                //빈칸이 나올 때 마다 (partialArgs가 _면) restArgs에서 하나씩 땡겨받음
            }
        }
        return func.apply(this,partialArgs.concat(restArgs))
    }
}

var addPartial = partial2(add, 1, 2, _, 4, 5, _, _, 8, 9)
console.log(addPartial(3,6,7,10))
```

#### 참고
- ES5 환경에서는 `_`를 비워놓음으로 사용하기 위해 어쩔 수 없이 전역공간을 침범했다.
- ES6 환경은 `Symbol.for()`를 활용한다.
- `Symbol.for()`은 전역 심볼공간에 인자로 넘어온 문자열이 이미 있으면 해당 값을 참조하고, 선언돼 있지 않으면 새로 만드는 방식으로, 어디서든 접근 가능하면서 유일무이한 상수를 만들때 적합하다.
- `var EmptySpace = Symbol.for('EMPTY_SPACE')`


**예시4) 디바운스**

- **디바운스**는 짧은 시간 동안 동일한 이벤트가 많이 발생할 경우, 이를 전부 처리하지 않고 처음 또는 마지막에 발생한 이벤트에 대해 한 번만 처리한다.
- 프론트엔드 성능 최적화에 큰 도움을 주는 기능 중 하나이다.
- `scroll`, `wheel`, `mousemove`, `resize` 등에 적용하기 좋다. 

```js
var debounce = function(eventName, func, wait){
    var timeoutId = null
    return function (event) {
        var self = this
        console.log(eventName, `event 발생`)
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func.bind(self,event), wait)
    }
}

var mouseHandler = function(e) {
    console.log('move event 처리')
}
var wheelHandler = function(e) {
    console.log('wheel event 처리')
}

document.body.addEventListener('mousemove', debounce('move', moveHandler, 500));
document.body.addEventListener('mousewheel', debounce('wheel', wheelHandler, 700));
```
- 클로저로 처리되는 변수에는 eventName, func, wait, timeoutID가 있다.


### 4) 커링 함수
- 여러 개의 인자를 받는 함수를 하나의 인자만 받는 함수로 나눠서 순차적으로 호출될 수 있게 체인 형태로 구성한 것.
- **한 번에 하나의 인자만 전달**하는 것을 원칙으로 한다는 점에서 `부분적용함수`와 차이가 있다.
- 또한 중간 과정상의 함수를 실행한 결과는 그다음 인자를 받기 위해 대기만 할 뿐으로, **마지막 인자가 전달되기 전까지는 원본 함수가 실행되지 않는다.** 
- (부분 적용 함수는 **여러개의 인자**를 전달할 수 있고, **실행 결과를 재실행**할 때 원본 함수가 실행된다. )

**예시1) 지연실행(lazy execution)**
```js
var curry3 = function (func) {
    return function (a) {
        return function (b) {
            return func(a,b);
        };
    };
};

var getMaxWith10 = curry3(Math.max)(10);
console.log(getMaxWith10)(8) // 10
console.log(getMaxWith10)(25) // 25

var getMinWith10 = curry3(Math.min)(10);
console.log(getMinWith10)(8) // 8
console.log(getMinWith10)(25) // 10
```

**예시2) 지연실행(lazy execution)**
```js
var curry5 = function (func) {
    return function (a) {
        return function (b) {
            return function (c) {
                return function (d) {
                    return function (e) {
                        return func(a, b, c, d, e)
                    }
                }
            }
        }
    }
}
var getMax = curry5(Math.max)
console.log(getMax(1)(2)(3)(4)(5))
```
```js
var curry5 = func => a => b => c => d => e => func(a, b, c, d, e)
```
- 각 단계에서 받은 인자들을 모두 마지막 단계에서 참조할 것이므로 GC되지 않고, 메모리에 차곡차곡 쌓였다가, 마지막 호출로 실행 컨텍스트가 종료된 후에 한꺼번에 GC의 수거대상이 된다.
- 커링함수가 유용한 경우는 당장 필요한 정보만 받아 전달하고 또 필요한 정보가 들어오면 잔달하는 식으로 마지막 인자가 넘어갈 때까지 함수 실행을 미룰 때 유용하다.
- 즉, 원하는 시점까지 지연시켰다가 실행해야 하는 상황에 커링 함수를 사용한다.

```js
var getInformation = function (baseUrl) {
    return function (path) {
        return function (id) {
            return fetch(baseUrl + path + '/' + id)
        }
    }
}

var = getInformation = baseUrl => path => id => fetch(baseUrl + path + '/' + id)
```

- REST API를 이용할 경우, baseUrl은 몇 개로 고정되지만 path, id 값은 많을 수 있다. 

```js
var imageUrl = 'http://imageAddress.com/'
var productUrl = 'http://productAddress.com/'

// 이미지 타입별 요청 함수 준비
var getImage = getInformation(imageUrl) // http://imageAddress.com/
var getEmoticon = getImage('emoticon') // http://imageAddress.com/emoticon
var getIcon = getImage('icon')         // http://imageAddress.com/icon

// 제품 타입별 요청 함수 준비
var getProduct = getInformation(productUrl)
var getFruit = getProduct('fruit')
var getVegetable = getProduct(`vegetable`)

// 실제 요청
var emoticon1 = getEmoticon(100) // http://imageAddress.com/emoticon/100
var icon1 = getIcon(230) // http://imageAddress.com/icon/230
var fruit1 = getFruit(300) // http://imageAddress.com/fruit/300
var fruit2 = getFruit(400) // http://imageAddress.com/fruit/400
var vegetable1 = getVegetable(500) // http://imageAddress.com/vegetable/500
var vegatable2 = getVegetable(660) // http://imageAddress.com/vegetable/660
```
- 서버에 정보를 요청할 때, 매번 baseUrl부터 전부 기입하는 것보다 공통적인 요소는 먼저 기억시켜두고 특정한 값(id)만으로 서버 요청을 수행하는 함수를 만든다면 개발 효율성과 가독성이 더 좋을 것이다.

- Flux 아키텍처 구현체 중 하나인 Redux 미들웨어에서도 커링을 사용하고 있다.
- 
**예시1) Redux Middleware 'Logger'**
```js
const logger = store => next => action => {
    console.log('dispatching', action)
    console.log('next state', store.getState())
    return next(action)
}
```

**예시2) Redux Middleware 'thunk'**
```js
const thunk = store => next => action => {
    return typeof action === 'function'
        ? action(dispatch, store.getState())
        : next(action)
}
```
- `store`와 `next`는 프로젝트 내에서 한 번 생성된 이후로 바뀌지 않는 속성인데 비해, `action`의 경우 매번 달라진다.
- store와 next 값이 결정되면 Redux 내부에서 logger 또는 thunk에 store, next를 미리 넘겨서 반환된 함수를 저장시켜 놓고 이후에는 action만 받아서 처리할 수 있게한다.

## 정리
- 클로저란 어떤 함수에서 선언한 변수를 참조하는 내부함수를 외부로 전달할 경우, 함수의 실행컨텍스트가 종료된 이후에도 해당 변수가 사라지지 않는 현상이다. 
- 내부 함수를 외부로 전달하는 방법에는 함수를 return하는 경우뿐만 아니라 콜백으로 전달하는 경우도 포함된다.
- 클로저는 메모리를 계속 차지하기 때문에, 사용하지 않게 된 클로저는 메모리 관리의 필요성이 있다.

---
## Quiz

```js
    function outer(value){
        return function inner(){
            console.log(value);
        }
    }
    const inner = outer('hi World');  
    inner();
```
- Q: 위의 코드는 클로저의 예시라고 할 수 있는가?
- A: 그렇다. outer 스택이 끝났음에도 inner함수를 실행시키면 `value`를 갖고 있기 때문이다.


```js
- [quiz.js참고]("https://github.com/projectkorea/study-javascript-core/blob/main/5%EC%A3%BC%EC%B0%A8%20%ED%81%B4%EB%A1%9C%EC%A0%80/%EC%A4%80%ED%95%98/%EC%98%88%EC%A0%9C/quiz.js")
- [quiz 참고2]("https://velog.io/@hw8129/%EB%B0%94%EB%8B%90%EB%9D%BC%EC%BD%94%EB%94%A9-%ED%94%84%EB%A0%99-Closure-%EC%98%88%EC%A0%9C-%EB%AA%A8%EC%9D%8C")