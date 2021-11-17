# 05. 클로저

## 1. 클로저의 의미와 원리
- 함수형 프로그래밍 언어에서 등장하는 보편적인 특징
- 아래는 다양한 서적에서 클로저를 한 문장으로 요약한 설명이다.
```
1. 자신을 내포하는 함수의 컨텍스트에 접근할 수 있는 함수
2. 함수가 특정 스코프에 접근할 수 있도록 의도적으로 그 스코프에서 정의하는 것
3. 함수를 선언할 때 만들어지는 유효범위가 사라진 후에도 호출할 수 있는 함수
4. 이미 생명 주기상 끝난 외부 함수의 변수를 참조하는 변수
5. 자유변수가 있는 함수와 자유변수를 알 수 있는 환경의 결합
6. 로컬 변수를 참조하고 있는 함수 내의 함수
7. 자신이 생성될 때의 스코프에서 알 수 있었던 변수들 중 언젠가 자신이 실행될 때 사용할 변수들만을 기억하여 유지시키는 함수
```
- a **Closure** is the combination of a `function` and the `lexical environment within which that function was declared.` 
- 클로저는 함수와 그 함수가 선언될 당시의 lexical enviornment의 상호관계에 따른 현상이다.
- 선언될 당시의 lexical environemt는 `outerEnvironmentRefernce`에 해당한다.
- 어떤 컨텍스트 A에서 선언한 내부함수 B의 실행 컨텍스트가 활성화된 시점에는 B의 outerEnvironment가 참조하는 대상인 A의 LexicalEnvironment에도 접근이 가능하다.
- A에서는 B에서 선언한 변수에 접근 할 수 없지만, B에서는 A로의 접근이 가능하다. 
- 즉, 내부함수에서 외부 변수를 참조하는 경우에 한해서만, 함수와 선언될 당시의 LexcialEnvironmet와의 상호관계가 의미가 있을 것이다. 
  
**예시1) 외부 함수의 변수를 참조하는 내부 함수**
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
  - inner함수 내부에서는 a를 선언하지 않았기 때문에, `environtmentRecord`에서 값을 찾지 못한다.
  - 그 다음, `outerEnvironmentReference`에 지정된 상위 컨텍스트인 outer `LexicalEnvironment`에 접근해서 a를 찾는다. 
  - outer 함수 실행 컨텍스트가 종료되면, `LexicalEnvironment`에 저장된 식별자들(a, inner)에 대한 참조를 지운다.
  - 각 주소에 저장돼 있던 값들은 자신을 참조하는 변수가 하나도 없게 되므로 가비지 컬렉터의 수집 대상이 된다.

**예시1-2) 인자로 받은 변수를 참조하는 내부 함수**
```js
function outter(value){
    return function(){
        console.log(value);
    }
}
const inner = outter('hi World');  
inner(); // Hi World
```
- 외부함수의 지역변수인 value 에 접근 가능하다.
- 인자로 전달된 value 는 지역변수 역할을 한다.
- 따라서 외부함수 outter 의 지역변수로 볼 수 있다. 

**예시2) 외부 함수의 변수를 참조하는 내부 함수**
```js
var outer = function() {
    var a = 1
    var inner = function() {
        return ++a
    }
    return inner()
}
var outer2 =outer()
console.log(outer2) // 2
```
- inner함수의 실행결과를 리턴하고 있다.
- outer함수의 실행 컨텍스트가 종료된 시점에는 a 변수를 참조하는 대상이 없어진다. 
- 예시1과 동일하게 outer함수 실행 컨텍스트가 종료되기 이전에 inner 함수의 실행 컨텍스트가 종료돼 있으며, 이후 별도로 inner 함수를 호출할 수 없다는 공통점이 있다.

**예시3) 외부함수의 변수를 참조하는 내부함수**
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
- outer 함수의 실행 컨텍스트가 종료될 때, outer2 변수는 outer의 실행 결과인 inner함수를 참조한다.
- outer2를 호출하면 inner 함수가 실행한다.
- inner 함수의 실행 컨텍스트의
  - `environmentRecord`는 수집할 정보가 없다.
  - `outerEnvironmentReference`는 inner 함수가 선언되었던 LexicalEnvironment가 참조 복사된다. 
- inner 함수는 outer함수 내부에서 선언됐으므로, outer함수의 LexicalEnvironment가 담긴다.
- 스코프 체이닝에 따라 outer에서 선언한 변수 a에 접근해서 1만큼 증가시키고, inner함수의 실행 컨텍스트가 종료된다.

#### 여기서 잠깐!
- inner함수 실행 시점에는 outer 함수는 이미 실행이 종료된 상태이다.
- inner함수는 outer함수의 LexicalEnvironment에 어떻게 접근할 수 있었을까?
- 이는 가비지 컬렉팅(이하 G.C)의 동작 방식 때문이다.
- GC는 어떤 값을 참조하는 변수가 하나라도 있다면, 그 값은 수집대상에 포함시키지 않는다. 
- inner함수의 실행 컨텍스트가 활성화되면 outerEnvironmentReference가 outer 함수의 LexicalEnvironment를 필요할 것이므로 수집 대상에서 제외된다. 
- (크롬이나 Node.js등에서 사용중인 V8 엔진의 경우, 내부 함수에서 실제로 사용하는 변수만 남겨두고 나머지는 GC하도록 최적화 되있다.)

#### 클로저 재정의
- 클로저는 어떤 함수에서 선언한 변수를 참조하는 내부함수에서만 발생하는 현상이다.
- 외부 함수의 LexicalEnvironment가 가비지 컬렉팅 되지 않는 현싱이다.
- 즉, 클로저란 어떤 함수 A에서 선언한 변수 a를 참조하는 내부함수 B를 외부로 전달할 경우 A의 실행 컨텍스트가 종료된 이후에도 변수 a가 사라지지 않는 현상이다.
- 앞서 설명한 표현 중 아래 세 가지가 클로저 정의에 가장 근접하다.
  ```
  1. 함수를 선언할 때 만들어지는 유효범위가 사라진 후에도 호출할 수 있는 함수
  2. 이미 생명 주기가 끝난 외부 함수의 변수를 참조하는 함수
  3. 자신이 생성될 때의 스코프에서 알 수 있었던 변수들 중 언젠가 자신이 실행될 때 사용할 변수들만을 기억하여 유지시키는 함수
  ```
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
- 두 상황 모두 **지역변수를 참조하는 내부함수**를 외부에 전달했기 때문에 클로저다.

## 2. 클로저와 메모리 관리
- 메모리 누수란 개발자의 의도와 달리 어떤 값의 참조 카운트가 0이 되지 않아 GC의 수거 대상이 되지 않는 경우를 말한다. 
- 클로저는 함수의 지역변수를 참조하면서 메모리가 소모된다. 
- 그리고 지역변수의 참조가 필요하지 않을 때, 참조 카운트를 0으로 만든다면 소모됐던 메모리가 회수된다.
- 식별자에 참조형이 아닌 기본형 데이터(보통 null, undefined)를 할당하면 된다. 


**예시) 클로저와 메모리 관리**
```js
// 1) return에 의한 클로저의 메모리 해제
var outer = (function(){
    var a = 1
    var inner = function() {
        return ++a
    }
    return inner
})()
console.log(outer()) // inner()
console.log(outer())
outer = null // outer 식별자의 inner함수 참조를 끊음
```
```js
// 2) setInterval에 의한 클로저의 메모리 해제
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
```js
// 3) eventListener에 의한 클로저의 메모리 해제
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
**예시1)**
```js
fruits.forEach(function(fruit){    // A
    var $li = document.createElement('li')
    $li.innerText = fruit
    $li.addEventListener('click', function(){ // B
        alert('your choice is ' + fruit)
    })
    $ul.appendChild($li)
})
document.body.appendChild($ul)
```
- B에서 fruit 참조하고 있다.
- B의 `outerEnvironmentReference`가 A의 `LexcialEnvironment`를 참조한다. 
  
  **예시2)**
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
- alertFruit()를 바로 실행하면 잘 나오는데, 각 li를 클릭하면 [object MouseEvent]값이 출력된다.
- 콜백 함수의 인자에 대한 제어권을 addEventListener가 가진 상태이며, addEventListener는 콜백 함수를 호출할 때 첫 번째 인자에 '이벤트 객체'를 주입하기 때문이다.
- 이는 bind메서드로 해결한다.

```js
fruits.forEach(function(fruit){
    var $li = document.createElement('li')
    $li.innerText = fruit
    $li.addEventListener('click', alertFruit.bind(null,fruit))
    //.bind(thisArg[,arg1[,arg2]])
    $ul.appendChild($li)
})
```
- 하지만 이 경우 이벤트 객체가 인자로 넘어오는 순서가 바뀌고, this가 달라진다.
- 이는 고차함수로 해결한다.
- 고차함수: 함수를 인자로 받거나 함수를 리턴하는 함수

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
- 즉  `alertFruitBuilder`의 실행 결과로 반환된 함수에는 클로저가 존재한다.

### 2) 접근 권한 제어(정보 은닉)
- 정보은닉: 모듈의 내부 로직에 대해 노출을 최소화해서 모듈 간의 결합도를 낮추고 유연성을 높이는 개념
- 접근 권한에는 public, private, protected가 있다.
- public: 외부에서 접근 가능한 것
- private: 내부에서만 사용하며 외부에 노출되지 않는 것
- 자바스크립트는 기본적으로 변수 자체에 접근 권한을 직접 부여하도록 설계돼 있지 않다. 
- 하지만 클로저를 이용하면 함수 차원에서 public한 값과 private한 값을 구분하는 것이 가능하다.

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
- outer함수를 종료할 때, inner함수를 반환함으로써 outer함수의 지역변수인 a의 값을 외부에서도 읽을 수 있게 된다.
- 클로저를 활용하여 외부 스코프에서 함수 내부의 변수에 대한 접근 권한을 부여할 수 있다.
- 외부에 제공하고자 하는 정보들을 모아 return하고, 내부에서만 사용할 정보들은 return하지 않는 것으로 접근 권한 제어가 가능하다. 
- return한 변수들은 공개멤버(public member), 그렇지 않은 변수들은 비공개멤버(private member)라고 부른다.

**예시) 자동차 객체**
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
```

```js
car.fuel = 10000
car.power = 100
car.moved = 1000
```
- 이런 식으로 바꿔버리지 않게 클로저를 활용하여 방어할 수 있다.
- 객체가 아닌 함수로 만들고, 필요한 멤버만을 return한다.

**예시) 클로저로 변수를 보호한 자동차 객체**
```js
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
car.run();
car.fuel = 1000;
```
![image](https://user-images.githubusercontent.com/76730867/141715968-4f6ba45c-4150-4e3c-82bb-3b049452e0b6.PNG)
- moved 변수는 getter만을 부여함으로써 읽기 전용 속성을 부여했다.
- fuel, power 값을 변경할 수 없게 된다.
- car.fuel을 하면 object.prototype.fuel에 값이 들어간다. 이는 run 메서드의 fuel은 createCar의 클로저 값을 참조하고 있으므로 값을 수정할 수 없게 된다.

**예시) 클로저로 변수를 보호한 자동차 객체**
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
- 이와 같이 객체를 return하기 전에 미리 변경할 수 없게끔 조치를 취할 수 있다.

**정리**
- 클로저를 활용해 접근권한을 제어하는 방법은 다음과 같다
  - 1) 함수에서 지역변수 및 내부함수 등을 생성한다.
  - 2) 외부에 접근권한을 주고자 하는 대상들로 구성된 참조형 데이터를 return한다.
  - (대상이 여럿일 때는 객체 또는 배열, 하나일 때는 함수를 리턴한다.)
  - return한 변수들은 공개 멤버가 되고, 그렇지 않은 변수들은 비공개 멤버가 된다.

### 3) 부분 적용 함수
- n개의 인자를 받는 함수에 미리 m개의 인자만 넘겨 기억시켰다가, 나중에 n-m개의 인자를 넘기면 원래 함수의 실행 결과를 얻을 수 있게끔 하는 함수
- bind 메서드의 실행 결과와 비슷하다.
  ```js

  ```

### 3) 커링 함수
- 여러 개의 인자를 받는 함수를 하나의 인자만 받는 함수로 나눠서 순차적으로 호출될 수 있게 체인 형태로 구성한 것.
- 한 번에 하나의 인자만 전달하는 것을 원칙으로 함
- 중간 과정상의 함수를 실행한 결과는 그다음 인자를 받기 위해 대기만 할 뿐으로, 마지막 인자가 전달되기 전까지는 원본 함수가 실행되지 않는다. 
- (부분 적용 함수는 여러개의 인자를 전달할 수 있고, 실행 결과를 재실행할 때 원본 함수가 무조건 실행된다. )
  ```js
  
  ```

## 정리
- 클로저란 어떤 함수에서 선언한 변수를 참조하는 내부함수를 외부로 전달할 경우, 함수의 실행컨텍스트가 종료된 이후에도 해당 변수가 사라지지 않는 현상이다. 
- 내부 함수를 외부로 전달하는 방법에는 함수를 return하는 경우뿐 아니라 콜백으로 전달하는 경우도 포함된다.
- 클로저는 그 본질이 메모리를 계속 차지하는 개념이므로 더는 사용하지 않게 된 클로저에 대해서는 메모리를 차지하지 않도록 관리해줄 필요가 있다.