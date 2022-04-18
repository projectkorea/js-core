#  03 this
  
  
- 다른 객체지향 언어에서의 this는 클래스로 생성한 인스턴스 객체만을 말하며, 클래스에서만 사용할 수 있다. **자바스크립트에서의 this는** 어디서든 사용할 수 있으며, 상황에 따라 this가 바라보는 대상이 달라진다. 또한 **함수와 메서드는 this를 통해서만 구분할 수 있다.**

---
##  1. 상황에 따라 달라지는 this
  
### this 값이 결정되는 과정 

- 함수 호출 → 실행 컨텍스트 생성 → this값 결정
  - **this는 함수를 호출할 때 결정된다.**
  - 함수를 **어떤 방식으로 호출하냐에 따라** this 값이 달라진다.

### 6가지 상황

1. 전역공간에서의 `this`
2. 메서드 호출의 `this`
3. 함수 호출의 `this`
4. 콜백함수 호출의 `this`
5. 생성자 함수 내부의 `this`
6. 화살표함수의 `this`
  
### 1) 전역 공간에서의 `this`
  
- `this`는 전역 객체를 가리킨다. 
- 전역 컨텍스트를 **생성하는 주체**가 `전역 객체`이기 때문이다. 
- 전역 객체는 자바스크립트 런타임 환경에 따라 다르다.   
  - 브라우저 전역공간
  ```js
  this === Window
  ```
  - Node.js 환경의 전역공간
  ```js
  this === Global
  ```
  
#### `var`로 선언한 전역 변수는 전역객체의 프로퍼티로 할당된다.
  ```js
  var a =1
  console.log(a)            // 1
  console.log(this.a)       // 1
  console.log(window.a)     // 1
  ```
  
1. 실행 컨텍스트는 변수를 수집해서 L.E의 프로퍼티로 저장한다.
2. 이후 변수를 호출하면 L.E를 조회해서 일치하는 프로퍼티가 있을 경우 그 값을 반환한다.
3. 전역 컨텍스트의 경우 L.E는 전역객체를 그대로 참조한다.
<br>
  
#### 실행 컨텍스트의 L.E의 프로퍼티로 저장하니깐 this.a가 1이 나온다. 그럼, a를 직접 호출 해도 1이 나오는 이유는?
- 변수 a에 접근하고자 하면 스코프 체인에서 a를 검색하다가 가장 마지막에 도달하는 전역 스코프의 L.E, 즉 전역객체에서 해당 프로퍼티 a를 발견해서 그 값을 반환하기 때문이다.  
→ window가 생략해도 되는 이유는 여기에 있다.
  
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
  
- **삭제 명령**
```js
var a = 1
delete window.a // 삭제 실패
console.log(a, window.a, this.a)   // 1 1 1
  
var b = 2
delete b // 삭제 실패
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
→ 즉, **전역변수를 선언하면 JS 엔진이 자동으로 전역객체의 프로퍼티로 할당하면서, 추가적으로 해당 프로퍼티의 configurable속성을 false로 정의한다.** 
  (configurable 속성 = 변경 및 삭제 가능성)
→ 전역변수로 선언한 것과 전역객체의 프로퍼티로 선언한 것의 차이는 **호이스팅 여부 및 configurable 여부**이다.
  

  
###  2) 메서드로서 호출할 때 그 메서드 내부에서의 this
  
**함수 vs 메서드**
- 함수를 실행하는 방법은 두 가지다.
  1. 함수로서 호출
  2. 메서드로서 호출
- 함수는 그 자체로 **독립적인** 기능을 수행하는 반면,  메서드는 자신을 **호출한 대상 객체**에 관한 동작을 수행한다. 즉, **메서드는 객체의 메서드로서 호출할 경우에만 메서드로 동작하고, 그렇지 않으면 함수로 동작한다.**
  
```js
var func = function (x) {
    console.log(this, x)
}
  
var obj = {
    method: func
}

1) func(1)        // window { ...} 1
2) obj.method(2)  // { method: f } 2
```
  
- 1), 2)모두 원래의 익명함수를 호출한다.
- 하지만 이를 **변수에 담아 호출**한 경우와 **obj 객체의 프로퍼티**에 할당해서 호출한 경우에 `this`가 달라진다. 
→ 그렇다면 '함수로서 호출'과 '메서드로서 호출'은 어떻게 **구분**하나? 
<br>
  
##### '함수로서 호출'과 '메서드로서 호출'의 구분

```js
var obj = {
    method: function(x) {
        consoe.log(this,x)
    }
}
obj.method(1) // {method: f } 1
obj['mehtod'](2) // {method: f } 2
```
- **함수 이름 앞에 객체가 명시돼 있는 경우만** 메서드로 호출한 것이다.
  
##### 메서드 내부에서의 this
  
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
- **this에는 호출한 주체에 대한 정보**가 담긴다.
- 함수를 메서드로서 호출하는 경우, 호출 주체는 바로 **함수명 앞의 객체**이다.

<br>
  
###  1-3 함수로서 호출할 때 그 함수 내부에서의 this  

####  1) 함수 내부에서의 this
  
**함수를 함수로서 호출할 경우에는 this가 지정되지 않는다.**
- `this`에는 호출한 주체에 대한 정보가 담긴다. 객체지향 언어에서는 함수로서 호출하는 것은 호출 주체를 명시하지 않고 개발자가 코드에 직접 관여하여 실행한 것이기 때문에 호출 주체의 정보를 알 수 없다.
- **실행 컨텍스트를 활성화할 당시에 this가 지정되지 않은 경우 this는 전역 객체를 바라본다.** 따라서 함수에서의 `this`는 전역객체를 가리킨다. 이는 실제 동작과 다르게 예측될 때, 즉 설계상의 오류라고 부르기도 한다.
  
####  2) 메서드 내부함수에서의 this
  
- 메서드 내부에서 정의하고 실행한 함수에서의 this가 가장 햇갈린다.
- this라는 단어 자체가 주는 느낌 그대로 코드를 바라보면 예상과 다른 결과가 나온다. 
```js
var obj1 = {
    outer: function () {
        console.log(this); // (1)
        var innerFunc = function () {
            console.log(this); // (2) (3)
        };
        innerFunc();
        var obj2 = {
            innerMethod: innerFunc,
        };
        obj2.innerMethod();
    },
};

obj1.outer()
```
**실행 결과**
```
(1) {outer:f} obj1
(2) 전역객체(Window)
(3) {innerMethod:f} obj2
```
  
- (2)는 함수로서 호출한 것이기 때문에 this가 지정되지 않았고, 자동으로 스코프 체인상의 최상위 객체인 전역객체가 바인딩 된다.
- (3)은 (2)와 같은 함수를 사용했지만, 메서드로서 호출했기 때문에 바인딩되는 this의 대상이 obj2가 된 것이다.
→ this 바인딩에 관해서는 함수를 실행하는 당시의 주변 환경(**메서드 내부인지, 함수 내부인지)는 중요하지 않다**. 오직 해당 함수를 **호출하는 구만 앞에 점 또는 대괄호 표기가 있는지 없는지가 관건**이다. ✨✨✨

  
#### 3) 직전 컨텍스트의 this를 바라보게 하는 방법 (1)
  
- **호출 주체가 없을 때** 자동으로 전역객체를 바인딩 하지 않고, 호출 당시 주변 환경의 `this`를 그대로 상속받게 해보자.
- 💛 변수를 검색하면 가장 가까운 스코프의 L.E를 찾고 **상위 스코프를 탐색**하듯, `this` 역시 현재 컨텍스트의 바인딩된 대상이 없으면 직전 컨텍스트의 `this`를 바라보도록 하자.

#### 호출 주체가 없으면 `this`는 자동으로 전역객체 바인딩

```js
var obj = {
    outer:function() {
        var innerFunc = function() {
            console.log(this)  //  window {...}
        }
        innerFunc()
    }
}
obj.outer()
```

#### 방법1: 클로저
```js
var obj = {
    outer:function() {
        var self = this // ✅
        var innerFunc = function () {
            console.log(self)   // {outer : f}
        }
        innerFunc()
    }
}
obj.outer()
```
- 상위 스코프의 this를 따로 저장해서 내부함수에서 사용한다.
- 
<br>

#### 방법2: 화살표 함수

```js
var obj ={
    outer: function() {
        var innerFunc = () => {
            console.log(this)  //  {outer : f}
        }

        innerFunc()
    }
}
obj.outer()
```
- 화살표 함수는 실행 컨텍스트를 생성할 때, **this 바인딩 과정 자체가 빠지게 되어**, 상위 스코프의 `this`를 그대로 활용할 수 있다. 
<br>

###  1-4 콜백 함수 호출 시 그 함수 내부에서의 this
  
- 함수 A의 제어권을 다른 함수 또는 메서드 B에게 넘겨주는 경우,
A를 콜백함수 라고 한다. 
- 함수 A는 함수 B의 내부 로직에 따라 실행되며, `this`역시 함수 B내부 로직에서 정한 규칙에 따라 값이 결정된다.
- **콜백 함수도 함수이기 때문에 this가 전역객체를 참조**한다. 
- 하지만 제어권을 받은 함수에서 콜백함수에 별도로 `this`가 될 대상을 지정하는 경우에 한정하여, 그 대상을 참조한다. 
  
```js
// (1)
setTimeout(function(){console.log(this)},300)
  
// (2)
[1,2,3,4,5].forEach(function (x) {
    console.log(this,x)
})
  
// (3)
document.body.innerHTML += '<button id='a'>클릭</button>' 
document.body.querySelector('#a')
    .addEventListener('click',function (e){
        console.log(this,e)
    })
```
- (1)와 (2)는 콜백 함수를 호출할 때 대상이 될 this를 지정하지 않는다. 따라서 콜백 함수 내부에서의 this는 전역객체를 참조한다.
- (3)의 `addEventListener 메서드`는 콜백 함수를 호출할 때 자신의 this를 상속하도록 정의돼 있다. 따라서 메서드 명의 점 앞부분이 곧 this가 된다.
- **정리**: 콜백 함수의 제어권을 가지는 함수가 콜백 함수에서의 this를 무엇인지 결정하며, 특별히 정의하지 않은 경우는 함수와 마찬가지로 전역객체를 바라본다.
  
  
###  1-5 생성자 함수 내부에서의 this
  
#### 생성자 함수란?
- **공통된 성질을 지니는 객체들을 생성**하는 데 사용되는 함수
- 객체지향 언어에서는 생성자를 클래스, 클래스를 통해 만드는 객체를 인스턴스라고 한다. 

#### 함수 앞에 new 키워드를 붙이면 생성자로써 동작한다.
- `const 인스턴스 = new 생성자()`
-  함수가 생성자 함수로서 호출된 경우 내부에서의 **this는 곧 새로 만들 구체적인 인스턴스 자신**이 된다. 
- 생성자 함수를 호출하면, `__proto__` 객체를 만든다. 이를 통해 미리 준비된 공통 속성 및 개성을 해당 객체에 부여하여, 구체적인 인스턴스가 만들어진다.
  
**인스턴스의 this 예시**
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
**실행 결과**
```
Cat {sort:'고양이', name:'초코', age:7}
Cat {sort:'고양이', name:'나비', age:5}
```
  
- Cat이란 변수에 익명 함수를 할당했다.
- 이 함수 내부에서는 this에 접근해서 sort,name,age 프로퍼티에 각각 대입한다.
- new 명령어와 함께 Cat함수를 호출해서 변수 choco, nabi에 각각 할당한다.
- 출력 결과, 각각 Cat클래스의 인스턴스 객체가 출력된다.
- ★**생성자 함수 내부에서의 this는 각각 choco, nabi 인스턴스를 가리킨다.**
---

##  2. 명시적으로 this를 바인딩하는 방법
  
지금까지 상황별로 this에 어떤 값이 바인딩되는지 살펴보았다.
이런 규칙을 깨고 this에 별도의 대상을 바인딩하는 방법을 알아보자.
  
###  2-1 call 메서드
  
```js
Function.prototype.call(thisArg[,arg1[,arg2[,...]]])
```
  
#### call 메서드 예제1
```js
var func = function (a,b,c) {
    console.log(this, a, b, c)
}
  
func(1,2,3)              // Window{...} 1 2 3
func.call({x:1}, 4,5,6)  // {x:1} 4 5 6
```
- 함수를 실행하면 `this`는 전역객체를 참조한다.
- 하지만 **call메서드**를 이용하면 **임의의 객체를 this로** 지정할 수 있다.
- call메서드의 특징
  1. 호출 주체인 함수를 **즉시 실행**한다. 
  2. 첫 번째 인자를 **this로 바인딩**한다.
  3. 이후의 인자들을 호출할 **함수의 매개변수**로 한다.
  
#### call 메서드 예제2
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
  
- 객체의 메서드를 그냥 호출하면 this는 객체를 참조하지만, call 메서드를 이용하면 임의의 객체를 this로 지정할 수 있다.
---
  
###  2-2 apply 메서드
  
```js
Function.prototype.apply(thisArg[,argsArray])
```

#### apply 메서드 예제1

```js
var func = function(a, b, c){
    console.log(this, a, b, c)
}
func.apply({x:1}, [4,5,6])   // {x:1} 4 5 6
```

#### apply 메서드 예제2

```js
var obj = {
    a:1,
    method:function(x,y) {
        console.log(this.a, x, y)
    }
}
obj.method.apply({a:4},[5,6])  // 4 5 6 
```
- `apply` 메서드
  - 두 번째 인자를 **배열**로 받아 그 **배열의 요소들을 호출할 함수의 매개변수**로 지정
---
###  2-3 call/apply 메서드 활용
  
####  1) 유사배열객체에 배열 메서드 적용
  
```js
var obj ={
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
}
```
**예시 1-1) 유사배열 객체에 배열 메서드를 적용**

```js
Array.prototype.push.call(obj,'d') === obj.push('d')

obj
// {0:'a', 1:'b', 2:'c', 3:'d', length:4}
```

- 객체에는 배열 메서드를 직접 적용할 수 없다.
- 하지만 **유사배열객체**일 경우, `call`, `apply`를 이용해 **배열 메서드**를 차용할 수 있다.


**예시 1-2) slice 메서드를 적용해 객체를 배열로 전환**
```js
var arr = Array.prototype.slice.call(obj) === obj.slice()

arr 
// ['a', 'b', 'c', 'd']
```

- call 메서드를 이용해 원본인 유사배열객체의 얕은 복사 수행
- `call`, `apply`를 이용해 형변환하는 것은 **this를 원하는 값으로 지정해서 호출한다** 라는 본래의 메서드 의도와는 다르기 때문에, 코드의 의도를 잘 파악해야한다.
  
**예시 1-3) arguments.NodeList에 배열 메서드를 적용**
```js
function a() {
    var argv = Array.prototype.slice.call(arguments)
    argv.forEach(function(arg) {
        console.log(arg)
    })
}
a(1, 2, 3)
// 1 2 3 
```

```js
document.body.innerHTML = '<div>a</div><div>b</div><div>c</div>'

var nodeList = document.querySelectorAll('div')
var nodeArr = Array.prototype.slice.call(nodeList)
nodeArr.forEach(function (node) {
    console.log(node)
})
```

- 함수 내부에서 접근할 수 있는 `arguments`, `querySelectorAll`, `getElementsByClassName`등의 반환값인 `NodeList`도 유사배열객체이기 때문에 **배열로 전환**해서 사용할 수 있다.
  
  
**예시 1-4) 문자열에 배열 메서드 적용 예시**
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
  
- 문자열의 경우 length 프로퍼티가 **읽기 전용**이기 때문에 원본 문자열에 변경을 가하는 메서드(push, pop, shift, upshift, splice 등)는 에러를 던진다.
- concat처럼 대상이 반드시 배열이어야 하는 경우에는 에러는 나지 않지만 원하는 결과를 얻을 수 없다.
  
**예시 1-5) Array.from()메서드 from ES6**
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
  - 유사배열객체 또는 순회 가능한 모든 종류의 데이터 타입을 **배열로 전환**한다.
    
  
####  2) 생성자 내부에서 다른 생성자를 호출
  
```js
function Person(name, gender) {
    this.name = name
    this.gender = gender
}
  
function Student(name, gender, school) {
    Person.call(this, name, gender)
    this.school = school
}
  
function Employee(name, gender, company){
    Person.apply(this, [name,gender])
    this.company = company
}
  
var yj = new Student('윤정', 'female', '단국대')
var jh = new Employee('준하', 'male', '구글')
```
- 생성자 내부에 다른 생성자와 공통된 내용이 있을 경우 사용
  
  
####  3) 여러 인수를 묶어 하나의 배열로 전달하고 싶을 때
  
**예시1 - apply**
```js
// const maxValue = Math.max(1, 2, 3, 4, 5); 
var numbers = [10, 20, 3, 16, 45]
var max = Math.max.apply(null,numbers)
var min = Math.min.apply(null,numbers)
console.log(min, max)
```
  
**예시2 - ES6 펼치기 연산자**
```js
const numbers = [10, 20, 3, 16, 45]
const max = Math.max(...numbers)
const min = Math.min(...numbers)
console.log(min, max)
```
- call/apply 메서드는 명시적으로 별도의 this를 바인딩하면서, 함수or메서드를 실행하는 훌륭한 방법이다
- 하지만 this를 예측하기 어렵게 만든다는 단점이 있다.
- 그럼에도 불구하고 ES5에선 마땅한 대안이 없기 때문에 실무에서 많이 사용되고 있다.
  
  
###  2-4 bind 메서드
  
```js
Function.prototype.bind(thisArg[, arg1[,arg2[, ...]]])
```

#### bind 메서드의 목적

1. `this`를 미리 적용하여, **새로운 함수 반환**
2. **부분적용함수** 구현

```js
var func = function(a, b, c, d) {
    console.log(this, a, b, c, d)
}
func(1, 2, 3, 4) // Window{...} 1 2 3 4
```

```js
var bindFunc1 = func.bind({x:1}) // this 지정
bindFunc1(5,6,7,8) //{x:1} 5 6 7 8 
  
var bindFunc2 = func.bind({x:1}, 4, 5) // this 지정 + 부분 적용 함수
bindFunc2(6,7) //{x:1} 4 5 6 7
bindFunc2(8,9) //{x:1} 4 5 8 9
```
- 다시 새로운 함수를 호출할 때 인수를 넘기면 그 인수들은 기존 bind 메서드를 호출할 때 전달했던 인수들의 뒤에 이어서 등록된다. 
  
####  name프로퍼티
  
- bind 메서드를 적용해서 새로 만든 함수는 `name` 프로퍼티에 `bound` 접두어가 붙는다.
```js
var func = function (a,b,c,d) {
    console.log(this, a, b, c, d)
}
var bindFunc = func.bind({x:1},4,5)
console.log(func.name)      // func
console.log(bindFunc.name)  // bound func
```
  
####  직전 컨텍스트의 this를 바라보게 하는 방법 (3)
  
- `call`, `apply`, `bind` 메서드를 이용하면, `self`를 이용한 클로저 방법보다 더 깔끔하게 처리할 수 있다.

**예시) call 이용**
  ```js
  var obj = {
      outer: function() {
          console.log(this)
          var innerFunc = function() {
              console.log(this)
          }
          innerFunc.call(this) // ✅
      }
  }
  obj.outer()
  ```
  **예시) bind 이용**
  ```js
  var obj = {
      outer: function() {
          console.log(this)
          var innerFunc = function() {
              console.log(this)
          }.bind(this) // ✅
          innerFunc()
      }
  }
  obj.outer()
  ```
  ```js
  var obj = {
      logThis: function() {
          console.log(this)
      },
      logThisLater1: function() {
          setTimeOut(this.logThis,500)
      },
      logThisLater2: function() {
          setTimeOut(this.logThis.bind(this),1000) // ✅
      }
  }
  obj.logThisLater1() //Window {...}
  obj.logThisLater2() //obj {logThis:f, ...}
  ```

###  2-5 화살표 함수의 예외사항
  
- 화살표 함수는 실행 컨텍스트 생성 시 `this`를 바인딩하는 과정이 제외됐다. 
- 함수 내부에 this가 아예 없으며, 접근하고자 하면 **스코프체인상 가장 가까운 this에 접근**하게 된다.

  ```js
  var obj = {
      outer : function() {
          console.log(this)
          var innerFunc = () => {
              console.log(this)
          }
          innerFunc()
      }
  }
  obj.outer() // {outer:f}, {outer:f}
  ```
  
###  2-6 별도의 인자로 this를 받는 경우(콜백 함수 내에서의 this)
  
- 콜백 함수를 인자로 받는 메서드 중 일부는 추가로 this로 지정할 객체(thisArg)를 인자로 지장할 수 있는 경우가 있다.
- 이런 메서드의 thisArg 값을 지정하면 콜백 함수 내부에서 this값을 원하는 대로 변경할 수 있다.
- 이런 형태는 여러 내부 요소에 대해 같은 동작을 반복 수행해야 하는 배열 메서드에 많이 포진돼 있으며, `같은 이유로 ES6에서 새로 등장한 Set, Map 등의 메서드에서도 일부 존재한다. 
  
**예시) forEach메서드 - thisArg를 인자로 받는 경우**
 ```js
 var report = {
     sum :0,
     count :0,
     add:function() {
         var args = Array.prototype.slice.call(arguments)
         args.forEach(function (entry){
             this.sum += entry
             ++this.count
         }, this) // this 바인딩
     },
     average: function () {
         return this.sum / this.count
     }
 }
 report.add(60,85,95)
 console.log(report.sum, report.count, report.average())
 ```
- 코드 설명
   -  arguments를 배열로 변환해서 args를 변수에 담는다
   -  배열을 순회하면서 콜백함수를 실행한다.
   -  **콜백 함수 내부에서의 this는 forEach 함수의 두 번째 인자로 전달해준 this가 바인딩 된다.**
   -  콜백 함수 내부에서의 this는 add 메서드에서의 this가 전달된 상태이므로 add 메서드의 this(report)를 그대로 가리키고 있다.
  
**예시) 콜백 함수와 함께 thisArg를 인자로 받는 메서드**
```js
Array.prototype.forEach(callback[, thisArg])
Array.prototype.map(callback[, thisArg])
Array.prototype.filter(callback[, thisArg])
Array.prototype.some(callback[, thisArg])
Array.prototype.every(callback[, thisArg])
Array.prototype.find(callback[, thisArg])
Array.prototype.findIndex(callback[, thisArg])
Array.prototype.findMap(callback[, thisArg])
Array.prototype.from(arraylike[, callback[,thisArg]])
Set.prototype.forEach(callback[,thisArg])
Map.prototype.forEach(callback[, thisArg])
```
  
##  정리
  
명시적 `this` 바인딩이 없을 시 항상 만족하는 것들
```
- 전역공간에서의 this는 전역객체를 참조한다.
→ 브라우저에서는 window, Node.js에서는 global
- 어떤 함수를 메서드로서 호출한 경우 this는 메서드 호출 주체를 참조한다. 
→ 메서드 호출 주체: 메서드명 앞의 객체
- 어떤 함수를 함수로서 호출한 경우 this는 전역객체를 참조한다. 메서드의 내부함수에서도 같다.
- 콜백 함수 내부에서의 this는 해당 콜백 함수의 제어권을 넘겨받은 함수가 정의한 바에 따르며,
 정의하지 않은 경우에는 전역객체를 참조한다.
- 생성자 함수에서의 this는 생성될 인스턴스를 참조한다. 
```
  
명시적 this 바인딩 규칙
```
- call, apply 메서드는 this를 명시적으로 지정하면서 함수 또는 메서드를 호출한다.
- bind 메서드는 this 및 함수에 넘길 인수를 일부 지정해서 새로운 함수를 만든다. 
- 요소를 순회하면서 콜백 함수를 반복 호출하는 내용의 일부 메서드는
별도의 인자로 this를 받기도 한다.
```


### Quiz 1. 실행결과를 순서대로 나타내보시오

```js
let glob;
const obj5 = {
  name: 'jh',
  getName: function () {
    function getFirstLetter() {
      return this;
    }
    glob = this;
    console.log('a', this);
    setTimeout(function () {
      console.log('b', this);
    });
    setTimeout(()=>{
      console.log('c', this);
    });
    console.log('d', getFirstLetter());
  },
};
obj5.getName();
console.log('e', this);
console.log('f', glob);
```

- `a: obj5`,`d: window`,`e: window`,`f: obj5`,`b: window`,`c: obj5`,
- `setTimeout` 안에 있는 콜백함수는 함수로써 호출되어, `this`는 `window`를 바라보지만, 화살표함수는 선언 당시(=실행컨텍스트 생성 당시) this를 갖지 않기 때문에 자동적으로 상위 스코프로 체이닝하여, `obj5`의 `this`를 바인딩하게 된다.


### Quiz 2
<img width="500" alt="1" src="https://user-images.githubusercontent.com/76730867/143515266-9c2d57af-55b9-44c6-a662-a164988e3f49.png">

- 오류가 발생한다.
- **new 키워드**를 붙이지 않아, 생성자 함수로 작동하지 않았기 때문이다.
- 따라서 `undefined`의 property를 참고하면 `undefined`가 나오지 않고 Error가 나온다.

### Quiz 3
<img width="600" alt="2" src="https://user-images.githubusercontent.com/76730867/143515270-3b728391-fd28-4d0e-b4df-542f89985b38.png">

- `band undefined roto play start`이 출력된다.
- `play()`메서드의 `this`는 호출주체, `roto`가 담긴다. 
- `roto`에는 `name` 프로퍼티는 없어서 `undefined`, `membername` 프로퍼티는 있기 때문에 `'roto'`가 출력된다.

**참고**
- Q. `this`는 체이닝해서 상위 스코프를 찾는 것이 아니였나?
- A. `this`는 실행 컨텍스트 생성시 하나의 값으로 바인딩 된다! 
  - 위의 예제에서 `play()`메서드 안의 `this`는 호출 주체인 `roto`가 바인딩 되었다. 따라서 `this`값 자체는 `roto`를 가리키며 `this` 값 자체가 체이닝되는 것은 **화살표함수 처럼 this를 갖지 않을 때 발생한다.**