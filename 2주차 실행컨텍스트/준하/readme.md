# 02. 실행 컨텍스트

- JS가 동적 언어임을 파악할 수 있는 개념이다.
- JS는 어떤 실행 컨테스트가 활성화되는 시점에
  1) 선언된 변수를 위로 끌어올리고(호이스팅),
  2) 외부환경 정보를 구성하고, 
  3) this 값을 설정하는 등의 동작을 수행한다. 
-  이런 과정에서 다른 언어와 다르게 특이한 현상이 발생한다. 
---
## 1. 실행 컨텍스트란?
- 실행 컨텍스트: 실행할 코드에 제공할 **환경 정보들을 모아놓은 객체**
  - **동일한 환경에 있는 코드들을 실행할 때, 필요한 환경 정보들을 모아 컨텍스트를 구성**하고, 이를 콜 스택에 쌓아올렸다가, 가장 위에 쌓여있는 컨텍스트와 관련 있는 코드들을 실행하는 식으로 전체 코드의 환경과 순서를 보장한다. 
- 실행 컨텍스트를 구성할 수 있는 방법: **`전역공간`** , **`함수`**
  - 자동으로 생성되는 전역공간을 제외하면 흔히 실행 컨텍스트를 구성하는 방법은 **함수를 실행하는 것**이다.

##### 참고

- 전역 실행 컨텍스트는 변수 객체를 생성하는 대신, 자바스크립트 구동환경이 별도로 제공하는 객체, 전역 객체를 활용한다.
- 전역 객체에는 브라우저의 `window`, node.js의 `global`객체 등이 있다.
이들은 자바스크립트 내장 객체가 아닌 호스트 객체로 분류된다.

##### 예시) 실행 컨텍스트와 콜 스택
 ```js
var a =1

function outer(){
    function inner(){
        var a =3
    }
    inner()
}

outer()
 ```

1. 처음 JS 코드를 실행하면, **전역 컨텍스트가 콜 스택에 담긴다.**
    - 전역 컨텍스트는 실행 컨텍스트랑 같은 말이지만, 전역 컨텍스트가 관여하는 대상은 함수가 아닌 전역공간이기 때문에 `arguments`가 없다. 전역 공간을 둘러싼 외부 스코프란 존재할 수 없기 때문에 스코프체인 상에는 전역 스코프 하나만 존재한다.
   - 최상단의 공간은 코드 내부에서 별도의 실행 명령 없이도 브라우저에서 자동으로 실행하므로 JS 파일이 열리는 순간 전역 컨텍스트가 활성화 된다고 이해하면 된다.

2. `outer`함수를 호출하면 `JS엔진`은 `outer`에 대한 환경 정보를 수집해서 `outer` 실행 컨텍스트를 생성한 후 콜 스택에 담는다. 콜 스택의 맨 위에 `outer` 실행 컨텍스트가 놓인 상태가 됐으므로 전역 컨텍스트와 관련된 코드의 실행을 일시 중단하고 `outer`함수 내부의 코드들을 순차로 실행한다.

<img width="700" alt="1" src="https://user-images.githubusercontent.com/76730867/138984912-1ffc430a-e89a-491e-85f4-7bc72fb60006.png">


실행 컨텍스트가 활성활 될 때 `JS엔진`은 해당 컨텍스트에 관련된 코드들을 실행하는데 필요한 환경 정보들을 수집해서 실행 컨텍스트 객체에 저장한다. 이 객체는 `JS엔진`이 활용할 목적으로 생성할 뿐 개발자가 코드를 통해 확인할 수는 없다. 이 객체에 담기는 정보들은 다음과 같다.

- **`Execution context`**
  1) `VariableEnvironment`
  2) `LexicalEnvironment`: `EnvironmentRecord`, ``outerEnvironmentReference``
  3) `ThisBinding` (this 식별자가 바라봐야 할 대상 객체)
- ![image](https://user-images.githubusercontent.com/76730867/138984917-3254cfa4-cded-4ddc-b56d-cf4e7e99d1f1.png)

## 2. `VariableEnvironment`
- 최초 실행 시의 **스냅샷**을 유지한다.

- 실행 컨텍스트를 생성할 때 여기에 정보를 먼저 담은 다음, 이를 그대로 복사해서 `LexicalEnvironment`를 만들어 이후는 주로 `LexicalEnvironment`를 활용한다.

## 3. `LexicalEnvironment`

#### `EnvironmentRecord`, ``outerEnvironmentReference``

- 처음에는 `VariableEnvironment`와 같지만 **변경사항이 실시간으로 반영**된다.
- 사전적인 뜻을 내포: `현재 컨텍스트 내부에는 a,b,c와 같은 식별자들이 있고 그 외부 정보는 D를 참조하도록 구성돼 있다`라는 컨텍스트를 구성하는 환경 정보들을 사전처럼 모아놓은 것이다.

#### `EnvironmentRecord`
  - 현재 컨텍스트와 관련된 코드의 **식별자 정보들이 저장된다.**
    - 식별자: 함수에 지정된 매개변수, 함수 자체, 함수 안에 선언된 변수
  - 컨텍스트 내부 전체를 처음부터 끝까지 쭉 훑어나가며 순서대로 수집한다. 

### 1) `EnvironmentRecord`와 호이스팅
- 실행 컨텍스트가 관여할 코드들이 실행되기 전에 **변수 정보를 수집하는 과정이 먼저 일어났다**.
-  `JS엔진`은 코드를 실행하기 전에 이미 해당 환경에 속한 코드의 변수명들을 모두 알고있다. 이것을 추상적으로 **식별자들을 최상단으로 끌어올려놓았다**라고 표현해 **호이스팅**이라고 한다.

#### (1) 호이스팅의 규칙

- 지금부터는 `JS엔진`의 구동박식을 사람의 입장에서 이해하고자 코드를 변환할 것이다. 실제 엔진은 이러한 변환과정을 거치지 않는다.

##### 예제1) 매개변수와 변수에 대한 호이스팅

```js
function a(x) {     //식별자 수집 대상1: 매개변수
    console.log(x)  // 1??
    var x           //식별자 수집 대상2: 변수 선언
    console.log(x)  // undefined??
    var x = 2       //식별자 수집 대상3: 변수 선언
    console.log(x)  // 2??
}
a(1)
```
- 매개변수도 식별자 수집 대상이 되어 최상단에 선언된다

```js
function a() {
    var x = 1          // <<-----
    console.log(x)
    var x
    console.log(x)
    var x = 2
    console.log(x)
}
a()
```

- `environMentRecord`는 현재 실행될 컨텍스트의 대상 코드 내에 어떤 식별자들이 있는지에만 관심이 있고, 각 식별자에 어떤 값이 할당될 것인지는 관심이 없다. 따라서 변수를 호이스팅할 때 **변수명만 끌어올리고 할당 과정은 원래 자리에 그대로 남겨둔다.** 

```js
function a(x) {
    var x 
    var x
    var x

    x = 1 
    console.log(x)
    console.log(x)
    var x = 2
    console.log(x)
}
a(1)
```
- 선언과 동시에 할당된 부분은 분리된다.
- 호이스팅의 개념이 적용됐기 때문에 실행결과는 다음과 같다.
```
1
1
2
```

<br>

##### 예제2) 함수 선언의 호이스팅

```js
function a() {
    console.log(b) // undefined??
    var b = 'bbb' // 식별자 수집대상1 이유(변수 선언)
    console.log(b) // bbb ??
    function b() {} // 식별자 수집대상1 이유(함수 선언)
    console.log(b) /// function b ???
}
a()
```
- a함수를 실행하는 순간, a함수의 실행 컨텍스트가 생성된다.
- 변수명과 함수 선언의 정보를 위로 끌어올린다.(수집)
- 변수는 선언부와 할당부를 나누어 선언부는 끌어올리고, 할당부는 놔둔다.
- 함수 선언은 함수 전체를 끌어올린다.
```js
function a() {
    var b;
    function b() {}
    
    console.log(b)
    b = 'bbb' 
    console.log(b)
    console.log(b)
}
a()
```
- 호이스팅이 끝난 상태에서의 함수 선언문은 **함수명으로 선언한 변수에 함수를 할당한 것처럼 여길 수 있다.**
```js
function a() {
    var b;
    var b = function b() {}
    
    console.log(b)
    b = 'bbb' 
    console.log(b)
    console.log(b)
}
a()
```
- 호이스팅의 개념이 적용된 실행 결과는 아래와 같다.

```
function b
'bbb'
'bbb'
```

#### 함수 선언문과 함수 표현식
- **(1) 함수 선언문(Function declaration)**
   ```js
    function a() { }
    a() 
  ```
  - 함수 정의부만 존재한고, 함수를 변수에 넣는 별도의 할당 명령이 없다.
  
<br>

- **(2) 함수 표현식(Function expression)**
  - 변수에 함수를 할당하는 것을 말한다.
  - **익명 함수 표현식**
    ```js
    var b = function () {  }
    b()
    ```
    - 식별자 없이 바로 변수에 할당되기 때문에 `익명함수표현식`이라 한다.
  - **기명 함수 표현식**
    
    ```js
    var c = function d() {  }
    c()
    d() // error
    ```
    - 변수명: c, 함수명: d
    - 외부에서는 함수명으로 함수를 호출할 수 없는 대신, 내부에서는 접근할 수 있어, 재귀함수와 같이 사용할 수 있다.

- 과거 `익명 함수 표현식`에서, 함수명이 `undefined`가 나왔었다. 이 때문에 `기명 함수 표현식`이 디버깅 시 어떤 함수인지 추적하기에 유리한 측면이 있었다. 하지만 이젠 모든 브라우저들이 익명 함수 표현식의 변수명을 함수의 `name` 프로퍼티에 할당하고 있다.

<br>

##### 예제 3) 함수 선언문과 함수 표현식에 대한 호이스팅
```js
console.log((sum(1,2)))
console.log((multiply(3,4)))

function sum(a,b) {
    return a+b
}
var multiply = function (a,b) {
    return a*b
}
```
- 호이스팅을 마친 상태
```js
var sum = function sum(a,b) {
    return a+b
}
var multiply;

console.log((sum(1,2)))
console.log((multiply(3,4)))

multiply = function (a,b) {
    return a*b
}
```

- 함수 선언문은 전체를 호이스팅, **함수 표현식은 변수 선언부만 호이스팅**했다.
- 함수 표현식은 **함수를** 다른 변수에 **값으로써 할당**했기 때문이다.
<br>

- 실행 결과
```
3
'multiply is not a function'
```
- 하지만 선언한 후에 호출할 수 있다는 것은 인간의 자연스러운 인지 과정이다. 따라서 `함수 선언문`은 권장되지 않는다. 

##### 예제4) `함수 선언문`의 위험성
```js
console.log(sum(3,4))

function sum(x,y){
    return x+y
}

...

var a = sum(1,2)

// 새로 추가한 코드

function sum (x,y){
    return x + '+' + y + '=' + (x+y)
}

var c = sum(1,2)
console.log(c)
```

1. 전역 컨텍스트가 활성화 될 때 전역공간에 선언된 함수들이 모두 가장 위로 끌어올려진다. 
2. 동일한 변수명에 서로 다른 값을 할당할 경우 나중에 할당한 값이 먼저 할당한 값을 오버라이드한다. 
- **문제 발생**
  -  코드를 실행할 때 실제로 호출되는 함수는 마지막에 선언된 함수다. 새로 추가한 코드 때문에 숫자를 더하는 함수는 없어지고, 문자열만 반환하는 함수가 작동한다.
  - 함수가 바뀌어 여기저기 문제가 발생하고 있는데, 정작 이 함수는 그 어떤 오류도 내지 않고, 암묵적 형변환에 따라 오류 없이 통과된다. 오류 없는 디버깅은 끔직할 것이다.

##### 상대적으로 함수 표현식이 안전하다.
```js
console.log(sum(3,4)) // Uncaught Type error: sum is not a function

var sum = function (x,y){
    return x+y
}

...

var a = sum(1,2)

...

var sum = function (x,y){
    return x + '+' + y + '=' + (x+y)
}

var c = sum(1,2)
console.log(c)
```

- `sum`함수가 할당 되기 전에 `sum`함수를 호출하는 코드는 바로 검출되어 디버깅할 수 있다. A는 A의도대로 `sum`함수 작동하며, B는 B의도대로 `sum`함수 작동할 수 있다.
- 결론: 원활한 협업을 위해서는 전역공간에 함수를 선언하거나, 동명의 함수를 중복 선언하는 경우는 없어야 한다.

### 2) 스코프와 `OuterEnvironmentReferecne`

1. 스코프란 **식별자에 대한 유효범위**이다. 
   - 스코프: 어떤 경계 A의 외부에서 선언한 변수는 A의 외부뿐 아니라 A의 내부에서도 접근이 가능 하다. 하지만 A의 내부에서 선언한 변수는 오직 A의 내부에서만 접근할 수 있다.

2. ES5까지 JS는 전역공간을 제외하면 오직 함수에 의해서만 스코프가 생성되었다.  
   - ES6에서는 블록에 의해서도 스코프 경계가 발생하게 했다. 다만 블록은 `var`로 선언한 변수에 대해서는 적용하지 않고 `let`, `const`, `class`, `strict mode에서의 함수 선언`에 대해서만 역할을 수행한다. ES6에서는 스코프를 구분하기 위해 `함수 스코프`, `블록 스코프`라는 용어를 사용한다.

#### (1) 스코프 체인
- 스코프 체인: **식별자의 유효범위를 안에서부터 바깥으로 차례로 검색**해나가는 것
- `outerEnvironmentReference`
  - 스코프 체인을 가능하게 하는 `LexicalEnvironment`의 두 번째 수집자료이다.
  - **현재 호출된 함수의 `outerEnvironmentReference`는 선언될 당시의 `LexicalEnvironment`를 참조한다.**
```js
function A(){
  function B()  {
    function C() {
      ...
    }
  }
}
```
- 함수 C의 `outerEnvironmentReference`는 함수 B의 `LexicalEnvironment` 참조한다.
- 함수 B의 `LexicalEnvironment`에 있는 `outerEnvironmentReference`는 함수 B가 선언되던 때, A의 `LexicalEnvironment`를 참조한다. 

- 이처럼 `outerEnvironmentReference`는 연결리스트 형태를 띤다. 선언 시점의 `LexicalEnvironment`를 계속 찾아 올라가면 마지막엔 전역 컨텍스트의 `LexicalEnvironment`가 있다. 
- 또한 각 `outerEnvironmentReference`는 오직 자신이 선언된 시점의 `LexicalEnvironment`만 참조하고 있으므로 가장 가까운 요소부터 차례대로 접근할 수 있고 다른 순서로 접근하는 것은 불가능하다. 
- 이런 구조적 특성 덕분에 여러 스코프에서 **동일한 식별자를 선언한 경우에는 무조건 스코프 체인 상에서 가장 먼저 발견된 식별자에만 접근이 가능**하다.
<br>

**예시 코드**
```js
var a = 1
var outer = function() {
    var inner = function() {
        console.log(a)
        var a = 3
    }
    inner()
    console.log(a)
}
outer()
console.log(a)
```

<img width="600" alt="1" src="https://user-images.githubusercontent.com/76730867/140011793-061ab95f-1947-4338-925d-0af132660898.jpg">

- 용어
  - `L.E`: `LexcialEnvironment` 
    - 현재 컨텍스트 내부에는 a,b,c와 같은 식별자들이 있고 그 외부 정보는 D를 참조하도록 구성돼 있다
  - `e`:`environmnetRecord`
    - 현재 컨텍스트와 관련된 코드의 식별자 정보들이 저정된다.
  - `o`: `outerEnvironmentReference`
  
- `전역 컨텍스트` > `outer 컨텍스트` > `inner 컨텍스트`로 갈수록 컨텍스트 스코프 체인을 타고 접근 가능한 변수의 수는 늘어난다.
  - 전역 공간에서는 전역 스코프에서 생성된 변수에만 접근할 수 있다. 
  - `outer` 함수 내부에서는 `outer` 및 전역 스코프에서 생성된 변수에 접근할 수 있지만 inner 스코프 내부에서 생성된 변수에는 접근하지 못한다. 
  - `inner` 함수 내부에서는 `inner`,`outer`,전역 스코프 모두에 접근할 수 있다.

**변수은닉화**(variable shadowing)
- 스코프 체인 상에 있는 변수라해서 모조건 접근 가능한 건 아니다. 
- 만약, 코드 상의 식별자 `a`를 전역 공간과 `inner` 함수 내부에서도 선언했을 때, inner 함수 내부에서 a에 접근하려고 하면 무조건 스코프 체인 상의 첫번째 인자, `inner` 스코프의 `LexicalEnvironment`부터 검색하게 된다.
- inner 스코프의 LE에 a식별자가 존재하므로 스코프 체인 검색을 더이상 진행하지 않고 inner LE상의 a를 반환하게 된다. 
- inner 함수 내부에서는 a변수를 선언했기 때문에 전역 공간에서 선언한 동일 이름의 a변수에는 접근할 수 없고 이를 **변수 은닉화**라고 한다.

**참고**: 브라우저 개발자 모드 디버깅 기능을 이용하여 현재 컨텍스트에서의 스코프를 확인할 수 있다.

## 정리

- **실행 컨텍스트**는 실행할 코드에 제공할 **환경 정보들을 모아놓은 객체**다. 
- 실행 컨텍스트는 전역 공간에서 자동으로 생성되는 `전역 컨텍스트`와 `eval` 및 `함수 실행`에 의한 컨텍스트 등이 있다.
- 실행 컨텍스트 객체는 활성화되는 시점에 `VariableEnvironment`, `LexicalEnvironment`, `ThisBinding` 세 가지 정보를 수집한다.

#### `LexicalEnvironment`
- 실행 컨텍스트를 생성할 때는 `VariableEnvironment`와 `LexicalEnvironment`가 동일한 내용으로 구성되지만, `LexicalEnvironment`는 함수 실행 도중에 변경되는 사항이 즉시 반영되고, `VariableEnvironmnet`는 초기 상태를 유지한다. 
- `VariableEnvironment`와 `LexicalEnvironment`는 `EnvironmentRecord`와 `outerEnvironmentReference`로 구성되어 있다.
- `EnvironmentRecord`는 매개변수명, 변수의 식별자, 선언한 함수명 등을 수집한다.
- `outerEnvironmentReference`는 바로 직전 컨텍스트의 `LexicalEnvironment` 정보를 참조한다.

#### 호이스팅
- **호이스팅**은 코드 해석을 좀 더 수월하게 하기 위해 **`environmentRecord`의 수집 과정을 추상화한 개념**으로, 실행 **컨텍스트가 관여하는 코드 집단의 최상단으로 이들을 끌어올린다**고 해석한다.
- 변수 선언과 값 할당이 동시에 이뤄진 문장은 '선언부'만을 호이스팅하고, 할당 과정은 원래 자리에 있다. 여기서 함수 선언문과 함수 표현식의 차이가 발생한다.

#### 스코프
- 스코프는 **변수의 유효범위**를 말한다.
- `outerEnvironmentReference`는 해당 함수가 **선언**된 위치의 `LexicalEnvironment`를 참조한다.
-  코드 상에는 어떤 변수에 접근하려고 하면 현재 컨텍스트의 `LexicalEnvironment`를 탐색해서 발견되면 그 값을 반환하고, 발견하지 못할 경우 다시 `outerEnvironmentRefrence`에 담긴 `LexicalEnvironment`를 탐색하는 과정을 거친다. 전역 컨텍스트의 `LexicalEnvironment`까지 해당 변수를 찾지 못하면 `undefined`를 반환한다.

#### 전역변수, 지역변수
- **전역변수**는 전역 컨텍스트의 `LexicalEnvironment`에 담긴 변수를, 그밖에 함수에 의해 생성된 실행 컨텍스트의 변수들은 모두 **지역변수**이다.
- 안전한 코드 구성을 위해 전역변수는 가급적 사용을 최소화해야한다.

#### this
- `this`에는 실행 컨텍스트를 활성화하는 당시에 지정된 `this`가 저장된다. 함수를 호출하는 방법에 따라 그 값이 달라지는데, 지정되지 않은 경우 전역객체가 저장된다.

---

## Quiz) 다음 IIFE의 실행결과는?
```js
var foo = {
    bar: function () {
        return this.baz;
    },
    baz: 1,
};

(function () {
    return typeof arguments[0]();
})(foo.bar); // ???
```

- 전달된 인자, `foo.bar`는 함수`function(){}`일 뿐이다. 
- 함수를 실행한 컨텍스트는 즉시실행함수의 컨텍스트는 `window`이다.
```js
(function(){console.log(this)})() // window
```
- 메서드가 되려면 `foo.bar()`와 같이 `bar` 프로퍼티 앞에 점을 붙여야 `foo`의 컨텍스트에서 실행되어야 한다.

```js
function execFoo() {
    return console.log(typeof arguments[0]());
}
execFoo(foo.bar);
```
- 즉시실행함수 뿐만아니라, 전역공간에서 execFoo를 선언한 후 execFoo를 실행하면 실행주체는 전역객체이기 때문에 위의 결과값과 동일하게 `undefined`가 나온다.