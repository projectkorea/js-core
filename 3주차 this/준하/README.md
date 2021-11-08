# 03 this

- 다른 객체지향 언어에서의 this
  - 클래스로 생성한 인스턴스 객체를 말한다.
  - this는 클래스에서만 사용할 수 있기 때문에 혼란의 여지가 없다.
- 자바스크립트에서의 this
  - 어디서든 사용할 수 있다. 
  - 상황에 따라 this가 바라보는 대상이 달라진다.
  - 그렇기 때문에 JS에서 가장 혼란스러운 개념이다.
- 특히, 함수와 객체(메서드)의 구분이 느슨한 자바스크립트에서 this는 실질적으로 이 둘을 구분하는 거의 유일한 기능이다. 
- 이번 단원에서는
  - 상황별로 this가 어떻게 달라지는지,
  - 왜 그렇게 되는지, 
  - 예상과 다른 대상을 바라보고 있을 경우, 그 원인을 효과적으로 추적하는 방법을 살펴보자

---
## 1. 상황에 따라 달라지는 this
  - 함수 호출 → 실행 컨텍스트 생성 → this값 결정
→ **this는 함수를 호출할 때 결정된다.**
→ 함수를 **어떤 방식으로 호출하냐에 따라** 값이 달라진다.

### 1-1 전역 공간에서의 this
- this는 전역 객체를 가리킨다. 
- 전역 컨텍스트를 생성하는 주체가 전역 객체이기 때문이다. 
- 전역 객체는 자바스크립트 런타임 환경에 따라 다르다. 
  ex) window(browser), global(node,js)

  브라우저 전역공간에서의 this
  ```js 
  console.log(this == window) //true
  ```
  Node.js환경의 전역공간에서의 this
  ```js
  console.log(this == global) //true
  ```

  **JS의 모든 변수는 특정 객체의 프로퍼티이다**
  전역변수를 선언하면 JS엔진은 이를 전역객체의 프로퍼티로 할당한다. 
  ```js
  var a =1
  console.log(a)            // 1
  console.log(this.a)       // 1
  console.log(window.a)     // 1
  ```
    
   - 특정 객체란 실행 컨텍스트의 L.E를 말한다.
   - 실행 컨텍스트는 변수를 수집해서 L.E의 프로퍼티로 저장한다.
   - 이후 어떤 변수를 호출하면 L.E를 조회해서 일치하는 프로퍼티가 있을 경우 그 값을 반환한다.
   - 전역 컨텍스트의 경우 L.E는 전역객체를 그대로 참조한다.
<br>

- **Q** 실행 컨텍스트의 L.E의 프로퍼티로 저장한다니깐, this.a가 1이 나오는 이유는 알겠는데, a를 직접 호출 해도 1이 나오는 이유는?
→ 변수 a에 접근하고자 하면 스코프 체인에서 a를 검색하다가 가장 마지막에 도달하는 전역 스코프의 L.E, 즉 전역객체에서 해당 프로퍼티 a를 발견해서 그 값을 반환하기 때문이다.  
→ window가 생략된 것이라고 이해했던 원리는 이런 것이였다.

<br>

```js
var a = 1
window.b = 2
console.log(a, window.a, this.a)   // 1 1 1
console.log(b, window.b, this.b)   // 2 2 2

window.a =  3
b = 4
console.log(a, window.a, this.a)   // 3 3 3
console.log(b, window.b, this.b)   // 4 4 4
```
→ 전역 공간에서 var로 변수를 선언하는 대신, window의 프로퍼티에 직접 할당하더라도 같은 동작을 한다.

<br>

**삭제 명령**
```js
var a = 1
delete window.a
console.log(a, window.a, this.a)   // 1 1 1

var b = 2
delete b
console.log(b, window.b, this.b)   // 2 2 2

window.c =  3
delete window.c
console.log(c, window.c, this.c)   // Uncaught ReferenceError: c is not defined

window.d =  4
delete d
console.log(d, window.d, this.d)   // Uncaught ReferenceError: d is not defined
```
→ 처음부터 전역객체의 프로퍼티로 할당한 경우에는 삭제가 된다.
→ 하지만 전역변수 선언한 경우에는 삭제가 되지 않는다.
→ 이는 사용자가 의도치 않게 삭제하는 것을 방지하는 차원에서 마련한 방어 전략이다. 
→ 즉, **전역변수를 선언하면 JS 엔진이 자동으로 전역객체의 프로퍼티로 할당하면서, 추가적으로 해당 프로퍼티의 configurable속성을 false로 정의한다.** (configurable 속성 = 변경 및 삭제 가능성)
→ 이처럼 전역변수로 선언한 것과 전역객체의 프로퍼티는 호이스팅 여부 및 configurable 여부에서 차이를 보인다.



### 1-2 메서드로서 호출할 때 그 메서드 내부에서의 this
**함수 vs 메서드**
- 함수를 실행하는 방법 두 가지 
  - 함수로서 호출
  - 메서드로서 호출
- 둘의 차이는 독립성이다.
- 함수는 그 자체로 **독립적인** 기능을 수행한다.
- 메서드는 자신을 **호출한 대상 객체**에 관한 동작을 수행한다.

- JS초보들은 메서드를 '객체의 프로퍼티에 할당된 함수'로 이해하곤 한다. 반은 맞고 반은 틀리다.
- 어떤 함수를 객체의 프로퍼티에 할당한다고해서 무조건 메서드가 되는 것이 아니다. 객체의 메서드로서 호출할 경우에만 메서드로 동작하고, 그렇지 않으면 함수로 동작한다. ?????(당연한거 아닌가)

```js
var func = function (x) {
    console.log(this, x)
}
func(1)        // window { ...} 1

var obj = {
    method: func
}
obj.method(2)  // { method: f } 2
```

→ 원래의 익명함수는 그대로인데, 이를 변수에 담아 호출한 경우와 obj 객체의 프로퍼티에 할당해서 호출한 경우에 this가 달라진다. 
→ 그렇다면 '함수로서 호출'과 '메서드로서 호출'은 어떻게 구분하나? 
<br>


```js
var obj = {
    method: function(x) {
        consoe.log(this,x)
    }
}
obj.method(1) // {method: f } 1
obj['mehtod'] // {method: f } 2
```
'점 표기법' 또는 '대괄호 표기법'과 같이 함수 이름 앞에 객체가 명시돼 있는 경우 메서드로 호출한 것이다.

**메서드 내부에서의 this**

```js
var obj = {
    methodA: function () { console.log(this) }
    inner: {
        methodB: function (){ console.log(this) }
    }
}
obj.methodA()             // { methodA: f, inner: {...} } ( ===obj)
obj['methodA']()          // { methodA: f, inner: {...} } ( ===obj)

obj.inner.methodB()       // { methodB: f }  ( ===obj.inner)
obj.inner['methodB']()    // { methodB: f }  ( ===obj.inner)
obj.['inner'].methodB()   // { methodB: f }  ( ===obj.inner)
obj.['inner']['methodB']  // { methodB: f }  ( ===obj.inner)
```
- this에는 호출한 주체에 대한 정보가 담긴다.
- 어떤 함수를 메서드로서 호출하는 경우 호출 주체는 바로 함수명(프로퍼티명) 앞의 객체이다.
- 점 표기법의 경우 마지막 점 앞에 명시된 객체가 곧 this가 된다.



### 1-3 함수로서 호출할 때 그 함수 내부에서의 this

#### 함수 내부에서의 this
**함수를 함수로서 호출할 경우에는 this가 지정되지 않는다.**
- this에는 호출한 주체에 대한 정보가 담긴다. 객체지향 언어에서는 함수로서 호출하는 것은 호출 주체를 명시하지 않고 개발자가 코드에 직접 관여하여 실행한 것이기 때문에 호출 주체의 정보를 알 수 없다.
- 실행 컨텍스트를 활성화할 당시에 this가 지정되지 않은 경우 this는 전역 객체를 바라본다. 
- 따라서 함수에서의 this는 전역객체를 가리킨다. 
- 이는 설계상의 오류이긴 하다.

#### 메서드 내부함수에서의 this
메서드 내부에서 정의하고 실행한 함수에서의 this가 가장 혼란스러운 지점이다.
설계상의 오류 때문이다. 설계상의 오류는 실제 동작과 다르게 예측될 때를 말한다.
this라는 단어 자체가 주는 느낌 그대로 코드를 바라모면 예상과 다른 결과가 나온다. 
```js
var obj1 = {
    outer: function() {
        console.log(this)            // (1)
        var innerFunc = function() {
            console.log(this)        // (2) (3)
        }
        innerFunc()
        var obj2 = {
            innerMethod: innerFunc
        }
        obj2.innerMethod()
    }
}
obj1.outer()
```
실행 결과
```
(1) obj1
(2) 전역객체(Window)
(3) obj2

출력 결과를 보면 실제로는 아래와 같다.
(1) {outer:f}
(2) Window {parent:...}
(3) {innerMethod:f} 
이것은 obj1, window, obj2를 출력한 것과 동일한 결과다.
```

- (2)은 함수로서 호출한 것이기 때문에 this가 지정되지 않았고, 자동으로 스코프 체인상의 최상위 객체인 전역객체가 바인딩 된다.
- (3)은 (2)와 같은 함수를 사용했지만, 메서드로서 호출했기 때문에 바인딩되는 this의 대상이 obj2가 된 것이다.
→ this 바인딩에 관해서는 함수를 실행하는 당시의 주변 환경(메서드 내부인지, 함수 내부인지)는 중요하지 않다. 오직 해당 함수를 호출하는 구만 앞에 점 또는 대괄호 표기가 있는지 없는지가 관건이다. 

#### 메서드 내부 함수에서의 this를 우회하는 방법
- 호출 주체가 없을 때 자동으로 전역객체를 바인딩 하지 않는 방법이 없을까?
- 호출 당시 주변 환경의 this를 그대로 상속받아 사용할 수 있었으면 좋겠다. 
- 변수를 검색하면 우선 가장 가까운 스코프의 L.E를 찾고 상위 스코프를 탐색하듯, this 역시 현재 컨텍스트의 바인딩된 대상이 없으면 직전 컨텍스트의 this를 바라보도록 하고 싶다.

```js
var obj = {
    outer:function() {
        console.log(this)      // (1) {outer : f}
        var innerFunc1 = function() {
            console.log(this)  // (2) window {...}
        }
        innerFunc1()
        
        var self = this
        var innerFunc2 = function () {
            console.log(self)   // (3) {outer : f}
        }
        innerFunc2()
    }
}
obj.outer()
```
- ES5에서 우회하는 방법
- 상위 스코프의 this를 저장해서 내부함수에서 활용하려는 수단이다.
<br>

```js
var obj ={
    outer: function() {
        console.log(this)      // (1) {outer : f}
        var innerFunc = () => {
            console.log(this)  // (2) {outer : f}
        }
        innerFunc()
    }
}
obj.outer()
```
- ES6에서 사용하는 화살표 함수
- 화살표 함수는 실행 컨텍스트를 생성할 때 this 바인딩 과정 자체가 빠지게 되어, 상위 스코프의 this를 그대로 활용할 수 있다. 
<br>


### 1-4 콜백 함수 호출 시 그 함수 내부에서의 this
함수의 A의 제어권을 다른 함수 또는 메서드 B에게 넘겨주는 경우,
함수 A를 콜백함수 라고 한다. 
함수 A는 함수 B의 내부 로직에 따라 실행되며, this역시 함수 B내부 로직에서 정한 규칙에 따라 값이 결정된다.
콜백 함수도 함수이기 때문에 1-3과 마찬가지로 this가 전역객체를 참조하지만, 제어권을 받은 함수에서 콜백함수에 별도로 this가 될 대상을 지정한 경우 그 대상을 참조한다. 

```js
setTimeout(function(){console.log(this)},300) // (1)

[1,2,3,4,5].forEach(function (x) {            // (2)
    console.log(this,x)
})

// (3)
document.body.innerHTML += '<button id='a'>클릭</button>' 
document.body.querySelector('#a')
    .addEventListener('click',function (e){
        console.log(this,e)
    })
```
- (1)와 (2)는 콜백 함수를 호출할 때 대상이 될 this를 지정하지 않는다.
- 따라서 콜백 함수 내부에서의 this는 전역객체를 참조한다.
- (3)의 `addEventListener 메서드`는 콜백 함수를 호출할 때 자신의 this를 상속하도록 정의돼 있다.
- 따라서 메서드 명의 점 앞부분이 곧 this가 된다.
→ 콜백 함수의 제어권을 가지는 함수가 콜백 함수에서의 this를 무엇인지 결정하며, 특별히 정의 하지 않은 경우는 함수와 마찬가지로 전역객체를 바라본다.


### 1-5 생성자 함수 내부에서의 this
- 생성자 함수는 **공통된 성질을 지니는 객체들을 생성**하는 데 사용되는 함수다. 
- 객체지향 언어에서는 생성자를 클래스, 클래스를 통해 만드는 객체를 인스턴스라고 한다. 
- **생성자는 구체적인 인스턴스를 만들기 위한 일종의 틀이다.**
- 이 틀에는 해당 클래스의 공통 속성들이 미리 준비돼있고, 여기에 구체적인 인스턴스의 개성을 더해 개별 인스턴스를 만들 수 있다.

- 자바스크립트는 함수에 생성자로서의 역할을 함께 부여했다.
- new 명령어와 함께 함수를 호출하면 해당 함수가 생성자로서 동작한다.
- 어떤 함수가 생성자 함수로서 호출된 경우 내부에서의 this는 곧 새로 만들 구체적인 인스턴스 자신이 된다. 

생성자 함수를 호출하면 우선 생성자의 prototype프로퍼티를 참조하는 __proto__라는 프로퍼티가 있는 객체를 만든다.
미리 준비된 공통 속성 및 개성을 해당 객체에 부여한다.
이렇게 해서 구체적인 인스턴스가 만들어진다.

```js
var Cat = function(name,age){
    this.sort = '고양이'
    this.name = name
    this.age = age
}

var choco = new Cat('초코',7)
var nabi = new Cat('나비',5)
console.log(choco, nabi)
```
실행 결과
```
Cat {sort:'고양이', name:'초코', age:7}
Cat {sort:'고양이', name:'나비', age:5}
```

- Cat이란 변수에 익명 함수를 할당했다.
- 이 함수 내부에서는 this에 접근해서 sort,name,age 프로퍼티에 각각 대입한다.
- new 명령어와 함께 Cat함수를 호출해서 변수 choco, nabi에 각각 할당한다.
- 출력 결과, 각각 Cat클래스의 인스턴스 객체가 출력된다.
- **생성자 함수 내부에서의 this는 각각 choco, nabi 인스턴스를 가리킨다.**

## 2. 명시적으로 this를 바인딩하는 방법
상황별로 this에 어떤 값이 바인딩되는지 살펴보았다.
하지만 이런 규칙을 깨고 this에 별도의 대상을 바인딩 하는 방법도 있다.

### 2-1 call 메서드
```js
Function.prototype.call(thisArg[,arg1[,arg2[,...]]])
```

**call 메서드 예제1**
```js
var func = function (a,b,c) {
    console.log(this, a, b, c)
}

func(1,2,3)              // Window{...} 1 2 3
func.call({x:1}, 4,5,6)  // {x:1} 4 5 6
```
- call 메서드는 메서드의 호출 주체인 함수를 즉시 실행하도록 하는 명령이다. 
- 이때 call메서드의 첫 번째 인자를 this로 바인딩한다.
- 이후의 인자들을 호출할 함수의 매개변수로 한다.
- 함수를 그냥 실행하면 this는 전역객체를 참조하지만, call메서드를 이용하면 임의의 객체를 this로 지정할 수 있다.

**call 메서드 예제2**
```js
var obj = {
    a:1,
    method: function(x,y) {
        console.log(this.a, x, y)
    }
}

obj.method(2,3)            // 1 2 3
obj.method.call({a:4},5,6) // 4 5 6
```
- 메서드에 대해서도 마찬가지로 객체의 메서드를 그냥 호출하면 this는 객체를 참조하지만 call 메서드를 이용하면 임의의 객체를 this로 지정할 수 있다.
---

### 2-2 apply 메서드
```js
Function.prototype.apply(thisArg[,argsArray])
```

```js
var func = function(a, b, c){
    console.log(this, a, b, c)
}
func.apply({x:1}, [4,5,6])   // {x:1} 4 5 6

var obj = {
    a:1,
    method:function(x,y) {
        console.log(this.a, x, y)
    }
}
obj.method.apply({a:4},[5,6])  // 4 5 6 
```


- apply 메서드는 call메서드와 기능적으로 완전히 동일하다.
- call메서드는 첫 번째 인자를 제외한 나머지 모든 인자들을 호출할 함수의 메개변수로 지정한다.
- 반면, apply메서드는 **두 번째 인자를 배열**로 받아 그 **배열의 요소들을 호출할 함수의 매개변수**로 지정한다.
---
### 2-3 call/apply 메서드 활용
**1) 유사배열객체에 배열 메서드 적용**
**예시 1-1) 유사배열 객체에 배열 메서드를 적용**
```js
var obj ={
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
}
```

```js
Array.prototype.push.call(obj,'d')
console.log(obj) // {0:'a', 1:'b', 2:'c', 3:'d', length:4}
```
- 객체에는 배열 메서드를 직접 적용할 수 없다.
- 하지만 키가 0또는 양의 정수인 프로퍼티가 존재하고, length 프로퍼티 값이 0 또는 양의 정수인 객체, 즉 배열의 구조와 유사한 객체의 경우(=유사배열객체) call 또는 apply메서드를 이용해 배열 메서드를 차용할 수 있다. 
- 배열 메서드인 push를 객체 obj에 적용해 프로퍼티 3에 'd'를 추가했다.

```js
var arr = Array.prototype.slice.call(obj)
console.log(arr) // ['a', 'b', 'c', 'd']
```
- slice메서드를 적용해 객체를 배열로 전환했다.
- slice메서드는 원래 시작 인덱스값과 마지막 인덱스값을 받아 시작값부터 마지막값 앞의 부분/가지 배열 요소를 추출하는 메서드인데, 매개변수를 아무것도 넘기지 않을 경우에 원본 배열의 얕은 복사본을 반환한다. 
- call 메서드를 이용해 원본인 유사배열객체의 얕은 복사를 수행한 것이다.
- slice메서드가 배열 메서드이기 때문에 복사본은 배열로 반환하게 된다. 

**예시 1-2) arguments.NodeList에 배열 메서드를 적용**
```js
function a() {
    var argv = Array.prototype.slice.call(arguments)
    argv.forEach(function(arg) {
        console.log(arg)
    })
}
a(1, 2, 3)

document.body.innerHTML = '<div>a</div><div>b</div><div>c</div>'
var nodeList = document.querySelectorAll('div')
var nodeArr = Array.prototype.slice.call(nodeList)
nodeArr.forEach(function (node) {
    console.log(node)
})
```
- 함수 내부에서 접근할 수 있는 arguments 객체도 유사배열객체이므로 배열로 전환해서 사용할 수 있다.
- querySelectorAll, getElementsByClassName등의 Node 선택자로 선택한 결과인 NodeList도 마찬가지다.

**예시 1-3) 문자열에 배열 메서드 적용 예시**
```js
var str='abc def'
Array.prototype.push.call(str, ', pushed string')
// Error: Cannot assign to read only property 'length' of object

Array.prototype.concat.call(str,'string')
// [String {"abc def"}, "string"]

Array.prototype.every.call(str, function(char) { return char !== ' '})
// false

Array.prototype.some.call(str, function(char) { return char === ' '})
// true

var newStr = Array.prototype.map.call(str, [
    function(char){return char + '~'},
    ''
])
console.log(newStr)  //"a0b1c2 3d4e5f6" 
```

- 그 밖에도 유사배열객체에는 call/apply 메서드를 이용해 모든 배열 메서드를 적용할 수 있다.
- 배열처럼 인덱스와 length 프로퍼티를 지니는 문자열에 대해서도 마찬가지다.
- 단, 문자열의 경우 length 프로퍼티가 읽기 전용이기 때문에 원본 문자열에 변경을 가하는 메서드(push, pop, shift, upshift, splice 등)는 에러를 던지며, concat처럼 대상이 반드시 배열이어야 하는 경우에는 에러는 나지 않지만 결과를 얻을 수 없다.

```js
var obj = {
    0:'a',
    1:'b',
    2:'c',
    length: 3
}
var arr = Array.from(obj)
console.log(arr)    //['a', 'b', 'c']
```
- call, apply를 이용해 형변환하는 것은 'this를 원하는 값으로 지정해서 호출한다'라는 본래의 메서드 의도와는 다소 동떨어진 방법일 수 있다.
- slice메서드는 오직 배열 형태로 복사하기 위해 차용됐을 뿐이니, 경험을 통해 숨은 뜻을 알고 있는 사람이 아닌 한 코드로만 의도를 파악하기 힘들다. 
- 이에 ES6에서는 유사배열객체 또는 순회 가능한 모든 종류의 데이터 타입을 배열로 전환하는 Array.from 메서드를 새로 도입했다.
  

**2) 생성자 내부에서 다른 생성자를 호출**


### 2-4 bind 메서드
```js
Function.prototype.bind(thisArg[, arg1[,arg2[, ...]]])
```
bind 메서드는 ES5에서 추가된 기능으로, call과 비슷하지만 즉시 호출하지는 않고 넘겨 받은 this 및 인수들을 바탕으로 새로운 함수를 반환하기만 하는 메서드이다.
다시 새로운 함수를 호출할 때 인수를 넘기면 그 인수들은 기존 bind 메서드를 호출할 때 전달했던 인수들의 뒤에 이어서 등록된다. 
즉, bind메서드는 함수에 this를 미리 적용하는 것과 부분 적용 함수를 구현하는 두 가지 목적을 모두 지닌다. 

### 2-5 화살표 함수의 예외사항
ES6에 새롭게 도입된 화살표 함수는 실행 컨텍스트 생성 시 this를 바인딩하는 과정이 제외됐다. 
이 함수 내부에는 this가 아예 없으며, 접근하고자 하면 스코프체인상 가장 가까운 this에 접근하게 된다.

### 2-6 별도의 인자로 this를 받는 경우(콜백 함수 내에서의 this)
콜백 함수를 인자로 받는 메서드 중 일부는 추가로 this로 지정할 객체(thisArg)를 인자로 지장할 수 있는 경우가 있다.
이런 메서드의 thisArg 값을 지정하면 콜백 함수 내부에서 this값을 원하는 대로 변경할 수 있다.
이런 형태는 여러 내부 요소에 대해 같은 동작을 반복 수행해야 하는 배열 메서드에 많이 포진돼 있으며, 같은 이유로 ES6에서 새로 등장한 Set, Map 등의 메서드에서도 일부 존재한다. 

## 정리

- 전역공간에서의 this는 전역객체를 참조한다.
→ 브라우저에서는 window, Node.js에서는 global
- 어떤 함수를 메서드로서 호출한 경우 this는 메서드 호출 주체를 참조한다. 
→ 메서드 호출 주체: 메서드명 앞의 객체
- 어떤 함수를 함수로서 호출한 경우 this는 전역객체를 참조한다. 메서드의 내부함수에서도 같다.
- 콜백 함수 내부에서의 this는 해당 콜백 함수의 제어권을 넘겨받은 함수가 정의한 바에 따르며, 정의하지 않은 경우에는 전역객체를 참조한다.
- 생성자 함수에서의 this는 생성될 인스턴스를 참조한다. 

다음은 명시적 this 바인딩 규칙이다. 위의 규칙에 부합하지 않은 경우 아래를 보고 this를 예측할 수 있다.
- call, apply 메서드는 this를 명시적으로 지정하면서 함수 또는 메서드를 호출한다.
- bind메서드는 this 및 함수에 넘길 인수를 일부 지정해서 새로운 함수를 만든다. 
- 요소를 순회하면서 콜백 함수를 반복 호출하는 내용의 일부 메서드는 별도의 인자로 this를 받기도 한다.





















