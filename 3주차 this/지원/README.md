## this

다른 대부분의 객체지향 언어에서 `this`는 클래스로 생성한 인스턴스의 객체를 의미한다.
그러나 자바스크립트에서의 `this`는 클래스에서만이 아니라 어디서든 사용할 수 있다.

## 01 상황에 따라 달라지는 this
자바스크립트 `this`는 기본적으로 실행 컨텍스트가 생성될 때 함께 결정된다.
실행 컨텍스트는 함수를 호출할 때 생성되므로, 
즉 `this`는 **함수를 호출할 때 결정된다.**

### 전역 공간에서의 this
전역 공간에서 `this`는 전역 객체를 가리킨다. 
전역 컨텍스트를 생성하는 주체가 바로 전역 객체이기 때문이다.
전역 객체는 자바스크립트 런타임 환경에 따라 다른 이름과 정보를 가진다.
- 브라우저 환경에서 전역객체는 `window`
- Node.js 환경에서는 `global`이다.

**참고**
전역 변수를 선언하면 자바스크립트 엔진은 이를 전역 객체의 프로퍼티로도 할당한다.
변수이면서 객체의 프로퍼티이기도 한 셈이다.
```js
var a = 1
console.log(a) //1
console.log(window.a) //1
console.log(this.a) //1
```

전역공간에서 선언한 변수 a에 1을 할당하면 window.a와 this.a 모두 1 출력된다.
전역공간에서의 `this`는 전역객체를 의미하므로 두 값이 같은 값을 출력하는 것은 당연하다.
자바스크립트의 모든 변수는 실은 **특정 객체의 프로퍼티**로서 동작하기 때문에 1을 출력한다.

특정 객체란 실행 컨텍스트의 LE이다.
실행 컨텍스트는 변수를 수집해서 L.E의프로퍼티로 저장한다.
어떤 변수를 호출하면 L.E를 조회해서 일치하는 프로퍼티가 있을 경우 그 값을 반환한다
전역 컨텍스트의 경우 L.E는 전역객체를 그대로 참조한다.

**전역 변수를 선언하면 자바스크립트 엔진은 이를 전역 객체의 프로퍼티로 할당한다**
그러면 window.a랑 this.a가 1이 나오는 이유는 설명이 되는데 a를 직접 호출할때도 1이 나오는 이유는?
이는 변수 a에 접근하고자 하면 스코프 체인에서 a를 검색하다가 가장 마지막에 도달하는 전역 스코프의 L.E 즉 전역 객체에서 해당 프로퍼티 a를 발견해서 그 값을 반환하기 때문이다. 

전역 공간에서 var로 변수를 선언하는 것과 window 프로퍼티에 직접 할당하는 것의 차이
```js
var a = 1
delete window.a //false
delete a //false
console.log(a, window.a, this.a) //1 1 1 

winodw.b = 2
delete window.b //true
delete b //true
console.log(b, window.b, this.b) //Uncaught ReferenceError: b is not defined
```

변수에 `delete` 연산자를 쓰는 것이 이상해보일 수 있지만 window.을 생략한 것으로 이해하면 된다. 

- 처음부터 전역객체의 프로퍼티로 할당한 경우에는 삭제가 된다.
- 처음에 전역변수로 선언한 경우에는 삭제가 되지 않는다.

### 메서드로서 호출할 때 그 메서드 내부에서의 this

함수 vs 메서드
둘의 차이: `독립성`
- 함수: 그 자체로 독립적인 기능을 수행한다.
- 메서드: 자신을 호출한 대상 객체에 관한 동작을 수행한다.

객체의 메서드로서 호출한 경우에만 메서드로 동작하고 그렇지 않으면 함수로 동작한다.

```js
var func = function(x){
    console.log(this, x)
}
func(1) //Window {...} 1

var obj = {
    method: func
}
obj.method(2) // {method: f} 2
```
 원래의 익명함수는 그대로인데 이를 변수에 담아 호출한 경우와 obj 객체의 프로퍼티에 할당해서 호출한 경우에 `this`가 달라지는 것이다.

'함수로서 호출'과 '메서드로서 호출' 어떻게 구분할까?
- 함수 앞에 점(.)이 있는지 여부만으로 간단하게 구분할 수 있다.
- 앞에 객체가 명시돼 있는 경우에는 메서드로 호출한것이고, 그렇지 않은 모든 경우에는 함수로 호출한 것이다.

**메서드 내부에서의 this**
`this`에는 호출한 주체에 대한 정보가 담긴다.

```js
var obj = {
    methodA: function() {console.log(this)}
    inner: {
        methodB: function() {console.log(this)}
    }
}
obj.methodA() //{methodA:f, inner:{...}} (=== obj)
obj['mehthodA']()

obj.inner.methodB() //{methodB:f} (===obj.inner)
obj.inner['methodB']
```

### 함수로서 호출할 때 그 함수 내부에서의 this
**함수 내부에서의 this**
어떤 함수를 함수로서 호출할 경우에는 this가 지정되지 않는다.
this에는 호출한 주체에 대한 정보가 담긴다. 그런데 함수로서 호출하는 것은 호출 주체를 명시하지 않고 개발자가 코드에 직접 관여해서 실행한 것이기 때문에 호출 주체의 정보를 알 수 없다.
실행컨텍스트를 활성화할 당시에 this가 지정되지 않은 경우 this는 전역 객체를 바라본다. 


**메서드의 내부함수에서의 this**

```js
var obj1 = {
    outer: function () {
        console.log(this) //(1) obj1
        var innerFunc = function (){
            console.log(this) //(2) window (3)obj2
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
- (2): innerFunc를 호출한 결과
- (3): obj2.innerMethod를 호출한 결과

(2)는 호출할때 함수명 앞에 점(.)이 없었다.
즉 함수로서 호출한 것이므로 this가 지정되지 않았고, 따라서 자동으로 스코프 페인상의 최상위 객체인 전역객체(window)가 바인딩된다.

**메서드의 내부 함수에서의 this를 우회하는 방법**
호출 주체가 없을 때는 자동으로 전역 객체를 바인딩하지 않고 호출 당시 주변 환경의 this를 그대로 상속받아 사용할 수 있으면 좋겠다. 
아쉽게도 es5까지는 자체적으로 내부함수에 this를 상속할 방법이 ㅇ벗지만 이를 우회할 방법이 있다.
바로 `변수를 활용`하는 것이다.

```js
var obj = {
    outer: function () {
        console.log(this) //{outer:f}
        var innerFunc1 = function () {
            console.log(this)  //Window {...}
        }
        innerFunc1()

        var self = this
        var innerFunc2 = function () {
            console.log(self) //{outer:f}
        }
        innerFunc2()
    }
}
obj.outer()
```
outer 스코프에서 self라는 변수에 this를 저장한 상태에서 호출한 innerFunc2의 경우 self에는 객체 obj가 출력된다. 
상위 스코프의 this를 저장해서 내부함수에서 활용하려는 수단이다.

**this를 바인딩하지 않는 함수**
ES6에서는 함수 내부에서 this가 전역객체를 바라보는 문제를 보완하고자, this를 바인딩하지 않는 화살표 함수를 새로 도입했다. 

화살표 함수는 실행 컨텍스트를 생성할 때 this 바인딩 과정 자체가 빠지게 되어, 상위 스코프의 this를 그대로 활용할 수 있다. 

```js
var obj = {
    outer: function() {
        console.log(this) //(1) {outer: f}
        var innerFunc = () => {
            console.log(this) //(2) {outer: f}
        }
        innerFunc()
    }
}
obj.outer()
```
그 밖에도 `call`, `apply` 등의 메서드를 활용해 함수를 호출할 때 명시적으로 this를 지정하는 방법이 있다.

### 콜백 함수 호출 시 그 함수 내부에서의 this
함수 A의 제어권을 다른 함수 B에게 넘겨주는 경우 함수 A를 콜백 함수라 한다. 
이때 함수 A는 함수 B의 내부 로직에 따라 실행되며, this 역시 함수 B 내부 로직에서 정한 규칙에 따라 값이 결정된다. 

콜백 함수도 함수이기 때문에 기본적으로 this가 전역객체를 참조하지만, 제어권을 받은 함수에서 콜백 함수에 별도로 this가 될 대상을 지정한 경우에는 그 대상을 참조하게 된다.

```js
setTimeout(function() {console.log(this)}, 300) // (1)

[1,2,3,4,5].forEach(function(x){
    console.log(this, x) // (2)
})

document.body.innerHTML += `<button id="a">클릭</button>`
document.body.querySelector('#a')
    .addEventListener('click', function(e){
        console.log(this, e) //(3)
    })
```
- (1): setTimeout 함수는 300ms만큼 시간 지연을 한 뒤 콜백함수를 실행하라는 명령이다. 0.3초 뒤 전역객체가 출력된다.
- (2): forEach 메서드는 배열의 각 요소를 앞에서부터 차례로 하나씩 꺼내어 그 값을 콜백 함수의 첫번째 인자로 삼아 함수를 실행하라는 명령이다. 전역객체와 배열의 각 요소가 총 5회 출력된다.
- (3): addEventListener는 지정한 HTML 엘리먼트에 'click' 이벤트가 발생할 때마다 그 이벤트 정보를 콜백 함수의 첫 번째 인자로 삼아 함수를 실행하라는 명령이다. 버튼을 클릭하면 앞서 지정한 엘리먼트와 클릭 이벤트에 관한 정보가 담긴 객체가 출력된다. 

setTimeout 함수와 forEach 메서드는 그 내부에서 콜백 함수르 호출할 때 대상이 될 this를 지정하지 않는다. 따라서 콜백 함수 내부에서의 this는 전역 객체를 참조한다. 
addEventListener 메서드는 콜백 함수를 호출할때 자신의 this를 상속하도록 정의되어있다.
메서드명의 점(.) 앞부분이 this가 되는 것이다. 

### 생성자 함수 내부에서의 this
생성자 함수는 어떤 공통된 성질을 지니는 객체들을 생성하는 데 사용하는 함수이다. 
객체지향 언에서는 생성자를 클래스, 클래스를 통해 만든 객체를 인스턴스라고 한다.

'생성자': 구체적인 인스턴스를 만들기 위한 일종의 틀

자바스크립트는 함수에 생성자로서의 역할을 함께 부여했다.
new 명령어와 함께 함수를 호출하면 해당 함수가 생성자로서 동작하게 된다. 
어떤 함수가 생성자 함수로서 호출된 경우 내부에서의 this는 곧 새로 만들 구체적인 인스턴스 자신이 된다. 

생성자 함수를 호출(new 명령어와 함께 함수를 호출)하면 우선 생성자의 protot;ype 프로퍼티를 참조하는 `__proto__`라는 프로퍼티가 있는 객체를 만들고, 미리 준비된 공통 속성 및 개성을 해당 객체(this)에 부여한다. 

```js
var Cat = function(name, age){
    this.bark = '야옹'
    this.name = name
    this.age = age
}
var choco = new Cat('초코', 7)
var nabi = new Cat('나비',5)
console.log(choco, nabi)
/*
결과
Cat{bark:'야옹',name:'초코',age:7}
Cat{bark:'야옹',name:'나비',age:5}
*/
```

## 02 명시적으로 this를 바인딩하는 방법

### call 메서드
`Function.prototype.call(thisArg[,arg1,arg2[,...]])`
call 메서드는 메서드의 호출 주체인 함수를 즉시 실행하도록 하는 명령이다. 
이때 call 메서드의 첫번째 인자를 this로 바인딩하고, 이후의 인자들은 호출할 함수의 매개변수로 한다. 
함수를 그냥 실행하면 this는 전역객체를 참조하지만 call 메서드를 이용하면 임의의 객체를 `this`로 지정할 수 있다.

```js
var func = function (a,b,c){
    console.log(this, a,b,c)
}

func(1,2,3) //Window{...} 1 2 3
func.call({x:1},4,5,6) // {x:1} 4 5 6
```

### apply 메서드
`Function.prototype.apply(thisArg,[,argsArray])`
apply 메서드는 call 메서드와 기능적으로 완전히 동일하다.
call 메서드는 첫번째 인자를 제외한 나머지 모든 인자들을 호출할 함수의 매개변수로 지정하는 반면,
apply 메서드는 두번째 인자를 배열로 받아 그 배열의 요소들을 호출할 함수의 매개변수로 지정한다는 점에서만 차이가 있다. 

```js
var func = function(a,b,c) {
    console.log(this, a, b, c)
}
func.apply({x:1}, [4,5,6]) // {x:1} 4 5 6

var obj = {
    a: 1,
    method: function(x,y) {
        console.log(this.a, x, y)
    }
}
obj.method.apply({a:4},[5,6]) //4 5 6 
```
### call/apply 메서드의 활용

**유사배열객체에 배열 메서드를 적용**

```js
var obj = {
    0:'a',
    1:'b',
    2:'c',
    length:3
}
Array.prototype.push.call(obj, 'd')
console.log(obj) //{0:'a',1:'b',2:'c',3:'d',length:4}

var arr = Array.prototype.slice.call(obj)
console.log(arr) //['a','b','c','d']
```

객체에는 배열 메서드를 직접 적용할 수 없다.
그러나 키가 0또는 양의 정수인 프로퍼티가 존재하고, length 프로퍼티의 값이 0 또는 양의 정수인 객체(즉 배열의 구조와 유사한 객체)의 경우 `call` 또는 `apply` 메서드를 이용해 배열 메서드를 차용할 수 있다.

```js
function a(){
    var argv = Array.prototype.slice.call(arguments)
    argv.forEach(function (arg){
        console.log(arg)
    })
}
a(1,2,3)

document.body.innerHTML = `<div>a</div><div>b</div><div>c</div>`
var nodeList = document.querySelectorAll('div')
var nodeArr = Array.prototype.slice.call(nodeList)
nodeArr.forEach(function (node){
    console.log(node)
})
```
함수 내부에서 접근할 수 있는 arguments 객체도 유사배열객체이므로 위의 방법으로 배열로 전환해서 활용할 수 있다.
querySelectorAll, getElementsByClassName 등의 Node 선택자로 선택한 결과인 NodeList도 마찬가지이다. 

그 밖에도 유사배열객체에는 `call/apply` 메서드를 이용해 모든 배열 메서드를 적용할 수 있다.
배열처럼 인덱스와 length 프로퍼티를 지니는 문자열에 대해서도 마찬가지이다.
단 문자열의 경우 lenght 프로퍼티가 읽기 전용이기 때문에 원본 문자열에 변경을 가하는 메서드(push, pop, shift, unshift, splice 등)는 에러를 던지며, concat처럼 대상이 반드시 배열이어야하는 경우에는 에러는 나지 않지만 제대로 된 결과를 얻을 수 없다.

### 생성자 내부에서 다른 생성자를 호출
생성자 내부에 다른 생성자와 공통된 내용이 있을 경우 `call` 또는 `apply`를 이용해 다른 생성자를 호출하면 간단하게 반복을 줄일 수 있다. 

다음 예제는 Student, Employee 생성자 함수 내부에서 Person 생성자 함수를 호출해서 인스턴스의 속성을 정의하도록 구현했다.
```js
function Person(name, gender) {
    this.name = name
    this.gender = gender
}
function Student(name, gender, school) {
    Person.call(this,name,gender)
    this.school = school
}
function Employee(name, gender, company){
    Person.apply(this, [name,gender])
    this.company = company 
}

var by = new Student('보영', 'female', '단국대')
var jn = new Student('재난', 'male', '구골')
```

### 여러 인수를 묶어 하나의 배열로 전달하고 싶을 때 - apply 활용
여러 개의 인수를 받는 메서드에게 하나의 배열로 인수들을 전달하고 싶을 때 apply 메서드를 사용하면 좋다.

```js
var numbers = [10,20,30,40]
var max = Math.max.apply(null, numbers)
var min = Math.min.apply(null, numbers)
console.log(max, min) // 40 10
```
참고로 ES6에서는 spread 연산자를 이용하면 작성할 수 있다.
```js
const max = Math.max(...numbers)
```

`call/apply` 메서드는 명시적으로 별도의 this를 바인딩하면서 함수 또는 메서드를 실행하는 훌륭한 방법이지만 오히려 이로 인해 this를 예측하기 어렵게 만들어 코드 해석을 방해한다는 단점이 있다. 
그럼에도 불구하고 ES5 이하의 환경에서는 마땅한 대안이 없기 때문에 실무에서 매우 광범위하게 활용되고 있다. 

### bind 메서드
`Function.prototype.bind(thisArg[,arg1[,arg2[,...]]])`
bind 메서드는 ES5 에서 추가된 기능으로 call과 비슷하지만 즉시 호출하지는 않고 넘겨 받은 this 및 인수들을 바탕으로 새로운 함수를 반환하기만 하는 메서드이다. 

다시 새로운 함수를 호출할 때 인수를 넘기면 그 인수들은 기존 `bind` 메서드를 호출할 때 전달했던 인수들의 뒤에 이어서 등록된다. 

즉 bind 메서드는 함수에 this를 미리 적용하는 것과 부분 적용 함수를 구현하는 두 가지 목적을 모두 지닌다. 

```js
var func = function (a,b,c,d){
    console.log(this,a,b,c,d)
}
func(1,2,3,4) //Window{...} 1 2 3 4 

var bindFunc1 = func.bind({x:1}) 
bindFunc1(5,6,7,8) //{x:1} 5 6 7 8 

var binFunc2 = func.bind({x:1}, 4,5)
bindFunc2(6,7) //{x:1} 4 5 6 7
bindFunc2(8,9) //{x:1} 4 5 8 9
```

**name 프로퍼티**
bind 메서드를 적용해서 새로 만든 함수는 독특한 성질이 있다.
바로 `name 프로퍼티`에 동사 bind의 수동태인 `bound`라는 접두어가 붙는다는 점이다. 
기존의 call이나 apply보다 코드를 추적하기에 더 수월하다. 
```js
var func = function(a,b,c,d){
    console.log(this, a,b,c,d)
}
var bindFunc = func.bind({x:1},4,5)
console.log(func.name) //func
console.log(bindFunc.name) //bound func
```
## 퀴즈
### 1. 배열에 배열을 붙이기 위해 apply 사용하기
var array ['a','b']
var elements [0,1,2]
["a","b",0,1,2]

