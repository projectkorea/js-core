## 01 클로저의 의미 및 원리 이해
클로저는 여러 함수형 프로그래밍 언어에서 등장하는 보편적인 특성이다. 

`클로저`를 한문장으로 요약해서 설명하는 부분들
- 자신을 내포하는 함수의 컨텍스트에 접근할 수 있는 함수 
- 함수가 특정 스코프에 접근할 수 있도록 의도적으로 그 스코프에서 정의하는 것
- 함수를 선언할 때 만들어지는 유효범위가 사라진 후에도 호출할 수 있는 함수
- 이미 생명 주기상 끝난 외부 함수의 변수를 참조하는 함수
- 자유변수가 있는 함수와 자유변수를 알 수 있는 환경의 결합
- 클로저는 함수와 그 함수가 선언될 당시의 `lexical environment`의 상호관계에 따른 현상

**어떤 함수에서 선언한 변수를 참조하는 내부함수에서만 발생하는 현상**

**예제 외부함수의 변수를 참조하는 내부 함수**
```js
var outer = function(){
    var a = 1
    var inner = function(){
        console.log(++a)
    }
    inner()
}
outer()
```
- outer 함수에서 변수 a 선언
- outer 함수 내부함수인 inner 함수에서 a의 값을 1만큼 증가시킨 다음 출력
- inner 함수 내부에서는 a를 선언하지 않았기 때문에 environmentRecord에서 값을 찾지 못하므로 outerEnvironmentReference에 지정된 상위 컨텍스트인 outer의 LexicalEncironement에 접근해서 다시 a를 찾는다. 
- outer 함수의 실행컨텍스트가 종료되면 LexicalEnvironment에 저장된 식별자들(a, inner)에 대한 참조를 지운다. 
- 그러면 각 주소에 저장돼 있던 값들은 자신을 참조하는 변수가 하나도 없게 되므로 가비지 컬렉터의 수집 대상이 될 것 이다.


**예제 외부 함수의 변수를 참조하는 내부함수 2**
```js
var outer = function(){
    var a = 1
    var inner = function(){
        return ++a
    }
    return inner()
}
var outer2 = outer()
console.log(outer2)
```
- 이번에도 inner 함수 내부에서 외부변수인 a를 사용했다.
- inner 함수를 실행한 결과를 리턴하고 있으므로 결과적으로 outer 함수의 실행 컨텍스트가 종료된 시점에는 a 변수를 참조하는 대상이 없어진다. 
- 위의 예제와 마찬가지로 a,inner 변수의 값들은 언젠가 가비지 컬렉터에 의해 소멸한다. 

1,2번 예제는 outer함수의 실행 컨텍스트가 종료되기 이전에 inner 함수의 실행컨텍스트가 종료돼 있으며 이후 별도로 inner 함수를 호출할 수 없다는 공통점이 있다. 

**outer의 실행 컨텍스트가 종료된 후에도 inner 함수를 호출할 수 있게 만들면?**

```js
var outer = function(){
    var a = 1
    var inner = function(){
        return ++a
    }
    return innner
}

var outer2 = outer()
console.log(outer2())//2
console.log(outer2())//3
```
- 함수의 실행 결과가 아닌 inner 함수 자체를 반환했다.
- outer 함수의 실행 컨텍스트가 종료될 때 outer2 변수는 outer의 실행 결과인 inner 함수를 참조하게 될 것이다. 
- 이후에 outer2를 호출하면 앞서 반환된 함수인 inner가 실행된다. 

**inner 함수의 실행 시점에는 outer 함수는 이미 실행이 종료된 상태인데 outer 함수의 LexicalEnvironment에 어떻게 접근할 수 있는 걸까요?**
-> 이는 `가비지 컬렉터의 동작 방식`때문이다.
- 가비지 컬렉터는 어떤 값을 참조하는 변수가 하나라도 있다면 그 값은 수집 대상에 포함시키지 않는다. 
- outer 함수는 실행 종료 시점에 inner 함수를 반환한다. 
- 외부함수인 outer의 실행이 종료되더라도 내부 함수인 inner 함수는 언젠가 outer2를 실행함으로써 호출될 가능성이 생겼다.
- 언젠가 inner 함수의 실행 컨텍스트가 활성화되면 outerEnvironmentReference가 outer 함수의 LexicalEnvironment를 필요로 할 것이므로 수집 대상에서 제외된다. 그 덕에 inner 함수가 이 변수에 접근할 수 있다. 

-----

예제 1,2번에서는 일반적인 함수의 경우와 마찬가지로 outer의 `LexicalEnvironment`에 속하는 변수가 모두 **가비지 컬렉팅** 대상에 포함된 반면, 예제3의 경우 변수 **a가 대상에서 제외**되었다.


이처럼 함수의 실행 컨텍스트가 종료된 후에도 `LexicalEnvironment`가 가비지 컬렉터의 수집 대상에서 제외되는 경우는 **지역변수를 참조하는 내부함수가 외부로 전달된 경우**가 유일하다.

- 클로저는 어떤 함수에서 선언한 변수를 참조하는 내부함수에서만 발생하는 현상
- 외부 함수의 `LexicalEnvironment`가 가비지 컬렉팅되지 않는 현상

**클로저란 어떤 함수 A에서 선언한 변수 a를 참조하는 내부함수 B를 외부로 전달할 경우 A의 실행 컨텍스트가 종료된 이후에도 변수 a가 사라지지 않는 현상**을 말한다.

**주의할 점**
'외부로 전달'이 곧 `return`만을 의미하는 것은 아니다. 

return 없이도 클로저가 발생하는 다양한 경우
```js
//(1) setInterval/setTimeout
(function(){
    var a = 0
    var intervalId = null
    var inner = funcion(){
        if(++a >= 10){
            clearInterval(intervalId)
        }
        console.log(a)
    }
    intervalId = setInterval(inner, 1000)
})()
```
```js
//(2) eventListener
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
- (1)은 별도의 외부객체인 window의 메서드(setTimeout 또는 setInterval)에 전달할 콜백 함수 내부에서 지역변수를 참조한다.
- (2)는 별도의 외부객체인 DOM의 메서드 (addEventListener)에 등록할 handler 함수 내부에서 지역변수를 참조한다. 
- 두 상황 모두 지역변수를 참조하는 내부함수를 외부에 전달했기 때문에 클로저이다. 

## 02 클로저와 메모리 관리
어떤 이들은 **메모리 누수의 위험**을 이유로 클로저 사용을 조심해야한다고 주장한다.
메모리 소모는 클로저의 본질적인 특성일 뿐이다.

`메모리 누수`는 개발자의 의도와 달리 어떤 값의 참조 카운트가 0이 되지 않아 GC(garbage collector)의 수거 대상이 되지 않는 경우에는 맞는 표현이지만 개발자가 의도적으로 참조 카운트를 0이 되지 않게 설계한 경우는 '누수'라고 할 수 없다. 

**관리 방법**
- 클로저는 어떤 필요에 의해 의도적으로 함수의 지역변수 메모리를 소모하도록 함으로써 발생한다.
- 그렇다면 그 필요성이 사라진 시점에는 더는 메모리를 소모하지 않게 해주면 된다. 
- 참조 카운트를 0 으로 만들면 언젠가 GC가 수거해 갈것이고, 이때 소모됐던 메모리가 회수된다.

**참조 카운트를 0으로 만드는 방법은?**
- 식별자에 참조형이 아닌 기본형 데이터 (보통 `null`이나 `undefined`)를 할당하면 된다. 

```js
//(1) return에 의한 클로저의 메모리 해제
var outer = (function(){
    var a = 1
    var inner = function(){
        return ++a
    }
    return inner
})()

console.log(outer())
console.log(outer())
outer = null
```
```js
//(2)setInterval에 의한 클로저의 메모리 해제
(function(){
    var a = 0
    var intervalId = null
    var inner = function(){
        if(++a >= 10) {
            clearInterval(intervalId)
            inner = null //inner 식별자의 함수 참조를 끊음
        }
        console.log(a)
    }
    intervalId = setInterval(inner, 1000)
})()
```
```js
//(3)eventListener에 의한 클로저의 메모리 해제
(function(){
    var count = 0 
    var button = document.createElement('button')
    button.innerText = 'click'

    var clickHandler = function(){
        console.log(++count, 'times clicked')
        if(count >= 10){
            button.removeEventListener('click', clickHandler)
            clickHandler = null //clickHnadler 식별자의 함수 참조를 끊음
        }
    }
    button.addEventListener('click', clickHandler)
    document.body.appendChild(button)
})()
```

## 03 클로저 활용 사례

### 콜백 함수 내부에서 외부 데이터를 사용하고자 할때
다음은 대표적인 콜백 함수 중 하나인 이벤트 리스너에 관한 예시이다.

```js
var fruits = ['apple','banana','peach']
var $ul = document.createElement('ul')

fruits.forEach(function(fruit){
    var $li = document.createElement('li')
    $li.innerText = fruit
    $li.addEventListener('click', function(){
        alert('your choice is' + fruit)
    })
    $ul.appendChild($li)
})
document.body.appendChild($ul)
```
- fruits 변수를 순회하며 li를 생성하고, 각 li를 클릭하면 해당 리스너에 기억된 콜백 함수를 실행하게 했다. 
- forEach 메서드에 넘겨준 익명의 콜백 함수(A)는 그 내부에서 외부 변수를 사용하지 않고 있으므로 클로저가 없지만
- addEventListener에 넘겨준 콜백함수(B)에는 `fruit`이라는 외부 변수를 참조하고 있으므로 클로저가 있다. 
- (A)는 fruits의 개수만큼 실행되며, 그때마다 새로운 실행 컨텍스트가 활성화 될것 이다. 
- (A)의 실행 종료 여부와 무관하게 클릭 이벤트에 의해 각 컨텍스트의 (B)가 실행될 때는  (B)의 outerEnvironmentReference가 (A)의 LexicalEnvironment를 참조하게 된다.
- 따라서 최소한 (B) 함수가 참조할 예정인 변수 fruit에 대해서는 (A)가 종료된 후에도 GC 대상에서 제외되어 계속 참조 가능할 것이다. 

(B)함수의 쓰임새가 콜백 함수에 국한되지 않는 경우라면 반복을 줄이기 위해 (B)를 외부로 분리하는 편이 나을 수 있다.

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
alertFruit(fruits[1])
```
- alertFruit를 실행하면 정상적으로 'banana'에 대한 alert이 실행된다. 
- 그런데 각 li를 클릭하면 클릭한 대상의 과일명이 아닌 [object MouseEvent]라는 값이 출력된다. 
- 콜백 함수의 인자에 대한 제어권을 addEventListener가 가진 상태이며, addEventListener는 콜백 함수를 호출할 때 첫번째 인자에 `이벤트 객체`를 주입하기 때문이다.
- 이문제는 `bind` 메서드를 활용하면 해결할 수 있다.

```js
fruits.forEach(function (fruit){
    var $li = document.createElement('li')
    $li.innerText = fruit
    $li.addEventListener('click',alertFruit.bind(null, fruit))
    $ul.appendChild($li)
})
```
- 다만 이렇게 하면 이벤트 객체가 인자로 넘어오는 순서가 바뀌는 점 및 함수 내부에서의 this가 원래의 그것과 달라지는 점은 감안해야 한다. 
- 이러한 변경사항이 발생하지 않게끔 이슈를 해결하기 위해서는 다른 방식으로 풀어내야 한다.
- 여기서는 `고차 함수`를 활용하는 것으로 함수형 프로그래밍에서 자주 쓰이는 방식이기도 하다. 

```js
var alertFruitBuilder = function (fruit){
    return function(){
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
- alertFruitBuilder 함수는 함수 내부에서 다시 익명 함수를 반환한다. 
- alertFruitBuilder 함수를 실행하면서 fruit 값을 인자로 전달했다. 
- 그러면 이 함수의 실행 결과가 다시 함수가 되며, 이렇게 반환된 함수를 리스너에 콜백 함수로써 전달할 것이다.
- 이후 언젠가 클릭 이벤트가 발생하면 이 함수의 실행 컨텍스트가 열리면서 alertFruitBuilder의 인자로 넘어온 fruit를 outerEnvironmentReference에 의해 참조할 수 있다.
- 즉 alertFruitBuilder의 실행 결과로 반환된 함수에는 클로저가 존재한다. 

### 접근 권한 제어(정보 은닉)
정보 은닉: 어떤 모듈의 내부 로직에 대해 외부로의 노출을 최소화해서 모듈간의 결합도를 낮추고 유연성을 높이고자 하는 현대 프로그래밍 언어의 중요한 개념 중 하나이다. 

흔히 접근 권한에는 `public`, `private`, `protected`의 세 종류가 있다.
- public: 외부에서 접근 가능한 것
- private: 내부에서만 사용하며 외부에 노출되지 않는 것을 의미

자바스크립트는 기본적으로 변수 자체에 이러한 접근 구너한을 직접 부여하도록 설계돼 있지 않는다. 
**클로저**를 이용하면 함수 차원에서 public한 값과 private한 값을 구분하는 것이 가능하다.
```js
var outer = function(){
    var a = 1
    var inner = function(){
        return ++a
    }
    return inner
}
var outer2 = outer()
console.log(outer2())
console.log(outer2())
```

outer 함수를 종료할 때 inner 함수를 반환함으로써 outer 함수의 지역변수인 a의 값을 외부에서도 읽을 수 있게 됐다.

이처럼 클로저를 활용하면 외부 스코프에서 함수 내부의 변수들 중 선택적으로 일부의 변수에 대한 접근 권한을 부여할 수 있다. 
-> 바로 `return`을 활용해서!

`closusre`라는 영어단어의 뜻: 닫혀있음, 폐쇄성, 완결성

외부에 제공하고자 하는 정보들을 모아서 return하고, 내부에서만 사용할 정보들은 return하지 않는 것으로 접근 권한 제어가 가능한 것이다. 

return한 변수들은 public member가 되고, 그렇지 않은 변수들은 private member가 된다. 

**클로저로 변수를 보호한 자동차 객체**
```js
var createCar = functoin(){
    var fuel = Math.ceil(Math.random()*10+10)//연료(L)
    var power = Math.ceil(Math.random()*3+2)//연비(km/L)
    var moved = 0
    return {
        get moved(){
            return moved
        },
        run: function(){
            var km = Math.ceil(Math.random()*6)
            var wasteFuel = km/power
            if(fuel < wasteFule){
                console.log('이동불가')
                return
            }
            fuel -= wasteFuel
            moved += km
            console.log(km + 'km이동(총'+moved+'km). 남은연료:'+fuel)
        }
    }
}
var car = createCar()
```
- createCar라는 함수를 실행함으로써 객체를 생성하게 했다.
- fuel, power 변수는 비공개 멤버로 지정해 외부에서의 접근을 제한했고
- moved 변수는 getter만을 부여함으로써 읽기 전용 속성을 부여했다.
- 이제 외부에서는 오직 run 메서드를 실행하는 것과 현재의 moved 값을 확인하는 두 가지 동작만 할 수 있다.
- car.moved, car.fuel, car.power의 값을 변경하고자하는 시도는 실패하게 된다. 
- 비록 run 메서드를 다른 내용으로 덮어씌우는 어뷰징은 여전히 가능하다.
- 이러한 어뷰징까지 막기 위해서는 객체를 return 하기 전에 미리 변경할 수 없게끔 조치를 취해야 한다.

```js
var createCar = function(){
    ...
    var publicMembers={
        ...
    }
    Object.freeze(publicMembers)
    return publicMembers
}
```
- 이제 안전한 객체가 되었다.

**클로저를 활용해 접근권한을 제어하는 방법**
1. 함수에서 지역변수 및 내부함수 등을 생성한다.
2. 외부에 접근권한을 주고자 하는 대상들로 구성된 참조형 데이터(대상이 여럿일 때는 객체 또는 배열, 하나일 때는 함수)를 return한다. 
-> return한 변수들은 공개 멤버가 되고, 그렇지 않은 변수들은 비공개 멤버가 된다. 

### 부분 적용 함수
부분 적용 함수(`partially applied function`): n개의 인자를 받는 함수에 미리 m개의 인자만 넘겨 기억시켰다가, 나중에 (n-m)개의 읜자를 넘기면 비로소 원래 함수의 실행결과를 얻을 수 있게끔 하는 함수이다.

this를 바인딩해야 하는 점을 제외하면 앞서 살펴본 bind 메서드의 실행 결과가 바로 부분 적용 함수이다. 

**bind 메서드를 활용한 부분 적용 함수**
```js
var add = function (){
    var result = 0
    for(var i=0;i<arguments.length;i++){
        result += arguments[i]
    }
    return result
}
var addPartial = add.bind(null,1,2,3,4,5)
console.log(addPartial(6,7,8,9,10))//55
```
addPartial 함수는 인자 5개를 미리 적용하고, 추후 추가적으로 인자들을 전달하면 모든 인자를 모아 원래의 함수가 실행되는 부분 적용 함수이다.
add 함수는 this를 사용하지 않으므로 bind 메서드만으로도 문제없이 구현되었다.
그러나 this의 값을 변경할 수 밖에 없기 때문에 메서드에서는 사용할 수 없을 것 같다.

**부분적용 함수 구현(1)**
```js
var partial = function () {
    var originalPartialArgs = arguments
    var func = originalPartialArgs[0]
    if (typeof func !== 'function'){
        throw new Error('첫번째 인자가 함수가 아닙니다')
    }
    return function(){
        var partialArgs = Array.prototype.slice.call(originalPartialArgs, 1)
        // call의 두번째 파라메터는 slice의 아규먼트로 들어간다.
        // 따라서 slice(1)이 되고 이는 arguments[1:]을 의미한다.
        var restArgs = Array.prototype.slice.call(arguments)
        return func.apply(this, partialArgs.concat(restArgs))
    }
}

var add = function () {
    var result = 0
    for (var i = 0; i < arguments.length; i++){
        result += arguments[i]
    }
    return result
}
var addPartial = partial(add,1,2,3,4,5)
console.log(addPartial(6,7,8,9,10)) //55
```
- 첫번째 인자에는 원본 함수를, 두번째 인자 이후부터는 미리 적용할 인자들을 전달하고
- 반환할 함수(부분 적용 함수)에서는 다시 나머지 인자들을 받아 이들을 한데 모아(concat) 원본 함수를 호출(apply)한다.
- 또한 실행 시점의 this를 그대로 반영함으로써 this에는 아무런 영향을 주지 않게 되었다. 

**부분 적용 함수 구현(2)**
인자들을 원하는 위치에 미리 넣어놓고 나중에는 빈 자리에 인자를 채워넣어 실행
```js
Object.defineProperty(window, '_',{
    value: 'EMPTY_SPACE',
    writeable: false,
    configurable: false,
    enumerable: false
})

var partial2 = function () {
    var originalPartialArgs = arguments
    var func = originalPartialArgs[0]
    if(typeof func !== 'function'){
        throw new Error('첫번째 인자가 함수가 아닙니다')
    }
    return function(){
        var partialArgs = Array.prototype.slice.call(originalPartialArgs, 1)
        var restArgs = Array.prototype.slice.call(arguments)
        for(var i = 0; i < partialArgs.length; i++){
            if(partialArgs[i] === _){
                partialArgs[i] = restArgs.shift()
            }
        }
        return func.apply(this, partialArgs.concat(restArgs))
    }
}

var add = function () {
    var result = 0
    for (var i = 0; i < arguments.length; i++){
        result += arguments[i]
    }
    return result
}

var addPartial = partial2(add, 1,2,_,4,5,_,_,8,9)
console.log(addPartial(3,6,7,10)) //55
```
- '비워놓음'을 표시하기 위해 미리 전역객체에 _라는 프로퍼티를 삭제 변경 등의 접근에 대한 방어 차원에서 여러가지 프로퍼티 속성을 설정
- **미리 일부 인자를 넘겨두어 기억하게끔하고 추후 필요한 시점에 기억했던 인자들까지 함께 실행하게 한다는 개념 자체가 클로저의 정의에 부합한다.**

**참고**
ES5 환경에서는 _를 '비워놓음'으로 사용하기 위해 어쩔수 없이 전역공간을 침범했다. 
ES6에서는 `Symbol.for`를 활용할 수 있다.
`Symbol.for` 메서드는 전역 심볼공간에 인자로 넘어온 문자열이 이미 있으면 해당 값을 참조하고, 선언돼 있지 않으면 새로 만드는 방식으로, 어디서든 접근 가능하면서 유일무이한 상수를 만들고자 할 때 적합하다.
```js
(function(){
    var EmptySpace = Symbol.for('EMPTY_SPACE')
    // 기존 전역 심볼공간에 'EMPTY_SPACE'라는 문자열을 가진 심볼이 없으므로 새로 생성
    console.log(EmptySpace)
})()

(function(){
    console.log(Symbol.for('EMPTY_SPACE'))
    //기존 전역 심볼공간에 'EMPTY_SPACE"라는 문자열의 심볼이 있으므로 해당 값을 참조
})()
```
```js
//...생략
var partial3 = function (){
    //....
    return funtion(){
        //....
        for (var i =0; i < partialArgs.length; i++){
            if(partialArgs[i] === Symbol.for('EMPTY_SPACE')){
                partialArgs[i] == restArgs.shift()
            }
        }
    }
}
var _ = Symbol.for('EMPTY_SPACE')
var addPartial = partial3(add,1,2,_,4,5,_,_,8,9)
console.log(addPartial(3,6,7,10))
```

실무에서 부분 함수를 사용하기에 적합한 예로 `디바운스(debounce)`를 소개하겠다.
**디바운스**: 짧은 시간 동안 동일한 이벤트가 많이 발생한 경우 이를 전부 처리하지 않고 처음 또는 마지막에 발생한 이벤트에 대해 한번만 처리하는 것으로, 프론트엔드 성능 최적화에 큰 도움을 주는 기능 중 하나이다.
scroll, wheel, mousemove, resize 등에 적용하기 좋다. 

`Lodash` 등의 라이브러리에서는 디바운스를 꽤 복잡하게 구현해 놓았지만, 최소한의 기능(마지막에 발생한 이벤트만 처리, 어느 정도의 시간 지연이 크게 문제되지 않는 경우)에 대한 구현은 생각보다 간단하다.

**디바운스**
```js
var debounce = function (eventName, func, wait){
    var timeoutId = null
    return function(event){
        var self = this
        console.log(eventName, 'event 발생')
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func.bind(self, event), wait)
    }
}

var moveHandler = function(e){
    console.log('move event 처리')
}

var wheelHandler = function(e){
    console.log('wheel event 처리')
}

document.body.addEventListener('mousemove',debounce('move', moveHandler, 500))
document.body.addEventListener('mousewheel', debounce('whell',wheelHandler,700))
```
- 출력 용도로 지정한 eventName과 실행할 함수(func), 마지막으로 발생한 이벤트인지 여부를 판단하기 위한 대기시간(wait)을 받는다.
- 내부에서는 timeoutId 변수를 생성하고, 클로저로 EventListenr에 의해 호출될 함수를 반환한다. 
- 반환될 함수 내부에서는 setTimeout을 사용하기 위해 `this`를 별도의 변수에 담고, (clearTimeout)무조건 대기큐를 초기화하게 했다.
- 마지막으로 setTimeout으로 wait 시간만큼 시연시킨 다음, 원래의 func를 호출하는 형태이다. 
- 최초 event가 발생하면 setTimeout줄에 의해 timeout의 대기열에 'wait 시간 뒤에 func를 실행할 것'이라는 내용이 담긴다.
- 그런데 wait 시간이 경과하기 이전에 다시 동일한 event가 발생하면 이번에는 (clearTimeout)줄에 의해 앞서 저장했던 대기열을 초기화하고, 다시 새로운 대기열을 등록한다.
- 결국 각 이벤트가 바로 이전 이벤트로부터 wait 시간 이내에 발생하는 한 마지막에 발생한 이벤트만이 초기화되지 않고 무사히 실행될 것이다. 

### 커링 함수
**커링 함수**: 여러 개의 인자를 받는 함수를 하나의 인자만 받는 함수로 나눠서 순차적으로 호출될 수 있게 체인 형태로 구성한 것을 말한다. 
앞서 살펴본 부분 적용 함수와 기본적인 맥락은 일치하지만 
- 커링은 **한번에 하나의 인자만 전달**하는 것을 원칙으로 한다. 
- 또한 **중간 과정상의 함수를 실행한 결과**는 **그 다음 인자를 받기 위해 대기**만 할 뿐으로, **마지막 인자가 전달되기 전까지는 원본 함수가 실행 되지 않는다.**
(부분 적용 함수는 여러 개의 인자를 전달할 수 있고, 실행 결과를 재실행할 때 원본 함수가 무조건 실행된다.)

```js
var crry3 = function (func) {
    return function (a) {
        return function (b) {
            return func(a, b)
        }
    }
}

var getMaxWith10 = curry3(Math.max)(10)
console.log(getMaxWith10(8)) //10
console.log(getMaxWith10(25)) //25

var getMinWith10 = curry3(Math.min)(10)
console.log(getMinWith10(8)) //8
console.log(getMinWith10(25)) //10
```
- 커링 함수는 필요한 상황에 직접 만들어 쓰기 용이하다.
- 필요한 인자 개수만큼 함수를 만들어 계속 리턴해주다가 마지막에만 짠!하고 조합해서 리턴해주면 되기 때문이다.
- 다만 인자가 많아질수록 가독성이 떨어진다는 단점이 있다. 

**커링 함수**
```js
var curry5 = function(func) {
    return function (a) {
        return function (b) {
            return function (c) {
                return function (d) {
                    return function (e) {
                        return func(a,b,c,d,e)
                    }
                }
            }
        }
    }
}
var getMax = crry5(Math.mx)
console.log(getMax(1)(2)(3)(4)(5))
```

ES6에서는 화살표 함수를 써서 같은 내용을 단 한줄에 표기할 수 있다.
`var curry5 = func => a => b => c => d => e => func(a,b,c,d,e)`
화살표 순서에 따라 함수에 값을 차례로 넘겨주면 마지막에 func가 호출될 거라는 흐름이 파악된다. 
**각 단계에서 받은 인자들**을 모두 **마지막 단계에서 참조**할 것이므로 **GC되지 않고 메모리에 차곡차곡 쌓였다가**, **마지막 호출로 실행 컨텍스트가 종료된 후에야 비로소 한꺼번에 GC의 수거 대상**이 된다. 

**커링 함수가 유용한 경우**
당장 필요한 정보만 받아서 전달하고 또 필요한 정보만 받아서 전달하고 또 필요한 정보가 들어오면 전달하는 식으로 하면 결국 마지막 인자가 넘어갈 때까지 함수 실행을 미루는 셈이 된다. 
이를 함수형 프로그래밍에서 `자연 실행(lazy execution)`이라고 칭한다.
1. 원하는 시점까지 지연시켰다가 실행하는 상황은 커링을 쓰기에 적합한 상황이다.
2. 프로젝트 내에서 자주 쓰이는 함수의 매개변수가 항상 비슷하고 일부만 바뀌는 경우

**예시**
```js
var getInformation = function (baseUrl) { //서버에 요청할 주소의 기본 URL
    return function (path) { //path 값
        return function (id) { //id 값
            return fetch(baseUrl + path +'/' + id) // 실제 서버에 정보를 요청
        }
    }
}

//ES6
var getInformation = baseUrl => path => id => fetch(baseUrl + path + '/' + id)
```

- HTML5의 fetch 함수는 url을 받아 해당 url HTTP 요청을 한다. 
- 보통 REST API를 이용할 경우 baseUrl은 몇 개로 고정되지만 나머지 path나 id 값은 매우 많을 수 있다. 

```js
var imageUrl = 'http://imageAddress.com/'
var productUrl = 'http://productAddress.com/'

//이미지 타입별 요청 함수 준비 
var getImage = getInformation(imageUrl) //http://imageAddress.com/
var getEmoticon = getImage('emotion') //http://imageAddress.com//emotion
var getIcon = getImage('icon') //http://imageAddress.com/icon

//제품 타입별 요청 함수 준비
var getProduct = getInformation(productUrl) //http://productAddress.com/
var getFruit = getProduct('fruit') //http://productAddress.com//fruit
var getVegetable = getProduct('vegetable') //http://productAddress.com//vegetable
```
**커링을 사용한 Flux 아키텍처의 구현체 중 하나인 Redux의 미들웨어 예시**
```js
//Redux Middleware 'Logger'
const logger = store => next => action => {
    cconsole.log('dispatching', action)
    console.log('next state', store.getState())
    return next(action)
}
//Redux Middleware 'thunk'
const thunk = store => next => action => {
    return typeof action === 'function'
    ? action(dispatch, store.getState)
    : next(action)
}
```
- 두 미들웨어는 공통적으로 store, next, action 순서로 인자를 받는다. 
- store는 프로젝트 내에서 한번 생성된 이후로는 바뀌지 않는 속성이고 dispatch의 의미를 가지는 next 역시 마찬가지지만, action의 경우는 매번 달라진다.
- store와 next 값이 결정되면 Reudx 내부에서 logger 또는 thunk에 store,next를 미리 넘겨서 반환된 함수를 저장시켜놓고, 이후에는 action만 받아서 처리할 수 있게끔 한다.

## 04 정리
1. 클로저란 어떤 함수에서 선언한 변수를 참조하는 내부함수를 외부로 전달할 경우, 함수의 실행컨텍스트가 종료된 후에도 해당 변수가 사라지지 않는 현상이다. 
2. 내부함수를 외부로 전달하는 방법에는 함수를 return하는 경우뿐 아니라 콜백으로 전달하는 경우도 포함된다. 
3. 클로저는 그 본질이 메모리를 계속 차지하는 개념이므로 더는 사용하지 않게 된 클로저에 대해서는 메모리를 차지하지 않도록 관리해줄 필요가 있다.
4. 클로저는 이 책에서 소개한 활용 방안 외에도 다양한 곳에서 활용할 수 있는 중요한 개념이다. 


**퀴즈**
클로져(Closure)는 무엇이며, 어떻게/왜 사용하는가?
https://kmhan.tistory.com/355
https://velog.io/@hw8129/%EB%B0%94%EB%8B%90%EB%9D%BC%EC%BD%94%EB%94%A9-%ED%94%84%EB%A0%99-Closure-%EC%98%88%EC%A0%9C-%EB%AA%A8%EC%9D%8C
