# 실행 컨텍스트

## 01 실행 컨텍스트란?
**실행 컨텍스트** : 실행할 코드에 제공할 환경 정보들을 모아놓은 객체

동일한 환경에 있는 코드들을 실행할때 필요한 환경 정보들을 모아 컨텍스트를 구성하고, 이를 콜 스택에 쌓아올렸다가, 가장 위에 쌓여있는 컨텍스트와 관련 있는 코드들을 실행하는 식으로 전체 코드의 환경과 순서를 보장한다.

`동일한 환경`: 하나의 실행 컨텍스트를 구성할 수 있는 방법으로 전역공간, eval()함수, 함수 등

흔히 실행 컨텍스트를 구성하는 방법은 **함수를 실행**하는 것뿐이다.

### 실행 컨텍스트와 콜 스택 예시
```js
//--------------------------(1)
var a  = 1
function outer() {
    function inner(){
        console.log(a) //undefined
        var a = 3
    }
    inner() //--------------(2)
    console.log(a) //1
}
outer() //------------------(3)
console.log(a) //1
```
1. 처음 자바스크립트 코드를 실행하는 순간(1) 전역 컨텍스트가 콜 스택에 담긴다.
2. 콜 스택에는 전역 컨텍스트 외에 다른 덩어리가 없으므로 전역 컨텍스트와 관련된 코드들을 순차로 진행한다.
3. 그러다가 (3)에서 `outer` 함수를 호출하면 자바스크립트 엔진은 `outer`에 대한 환경 정보를 수집해서 `outer` 실행 컨텍스트를 생성한 후 콜 스택에 담는다. 
4. 스택의 맨위에 `outer` 실행 컨텍스트가 놓인 상태가 됐으므로 `전역 컨텍스트`와 관련된 코드의 실행을 일시중단하고 대신 `outer` 실행 컨텍스트와 관련된 코드 (outer 함수 내부의 코드)들을 순차로 실행한다.
5. 다시 (2)에서 `inner` 함수의 실행 컨텍스트가 콜 스택의 가장 위에 담기면 `outer` 컨텍스트와 관련된 코드의 실행을 중단하고 `inner` 함수 내부의 코드를 순서대로 진행 한다. 
6. `inner` 함수 내부에서 `a` 변수에 값 3을 할당하고 나면 `inner` 함수의 실행이 종료되면서 `inner` 실행 컨텍스트가 콜 스택에서 제거된다. 
7. 그러면 아래에 있던 `outer` 실행 컨텍스트가 콜 스택의 맨 위에 존재하게 되므로 중단했던 (2)의 다음 줄 부터 이어서 실행한다. 
8. a 변수의 값을 출력하고 `outer` 함수의 실행이 종료되어 `outer` 실행 컨텍스트가 콜 스택에서 제거되고, 콜 스택에는 `전역 컨텍스트`만 남아 있게 된다.
9. 실행을 중단했던 (3)의 다음 줄부터 이어서 실행한다. `a` 변수의 값을 출력하고 나면 전역 공간에는 더는 실행할 코드가 남아 있지 않아 전역 컨텍스트도 제거되고, 콜 스택에는 아무것도 남지 않는 상태로 종료된다. 


한 실행 컨텍스트가 콜 스택의 맨 위에 쌓이는 순간이 곧 현재 실행할 코드에 관여하게 되는 시점임을 알 수 있다.
이렇게 어떤 실행 컨텍스트가 활성화될 때 자바스크립트 엔진은 해당 컨텍스트에 관련된 코드들을 실행하는데 필요한 환경 정보들을 수집해서 실행 컨텍스트 객체에 저장한다.
이 객체는 자바스크립트 엔진이 활용할 목적으로 생성할 뿐 개발자가 코드를 통해 확인할 수는 없다.

**담기는 정보들**
- VariableEnvironment: 현재 컨텍스트 내의 식별자들에 대한 정보 + 외부 환경 정보. 선언 시점의 LexicalEnvironmet의 스냅샷으로 변경 사항은 반영되지 않음
- LexicalEnvironment: 처음에는 VariableEnvironment와 같지만 변경 사항이 실시간으로 반영됨
- ThisBinding: this 식별자가 바라봐야 할 대상 객체

## 02 VariableEnvironment
`VariableEnvironment`에 담기는 내용은 `LexicalEnvironment`와 같지만 **최초 실행 시의 스냅샷을 유지한다**는 점이 다르다. 
실행 컨텍스트를 생성할 때 `VariableEnvironment`에 정보를 먼저 담은 다음, 이를 그대로 복사해서 `LexicalEnvironment`를 만들고, 이후에는 `LexicalEnvironment`를 주로 활용하게 된다.

`VariableEnvironment`와 `LexicalEnvironment`의 내부는
- environmentRecord와 outerEnvironmentReference로 구성돼 있다.
- 초기화 과정 중에는 사실 상 완전히 동일하고 이 후 코드 진행에 따라 서로 달라지게 된다.

## 03 LexicalEnvironment
'사전'과 비슷하다.
예를 들어 "현재 컨텍스트의 내부에는 a,b,c와 같은 식별자들이 있고 그 외부 정보는 D를 참조하도록 구성돼있다." 라는 컨텍스트를 구성하는 환경 정보들을 사전에서 접하는 느낌으로 모아놓은 것이다.

### environmentRecord와 호이스팅
`environmentRecord`:
    -  현재 컨텍스트와 관련된 코드의 식별자 정보들이 저장된다.
    - 컨텍스트를 구성하는 함수에 지정된 매개변수 식별자, 선언한 함수가 있을 경우 그 함수 자체, var로 선언된 변수의 식별자 등이 식별자에 해당한다.
    - 컨텍스트 내부 전체를 처음부터 끝까지 쭉 훑어나가며 순서대로 수집한다.

**참고**
`전역 실행 컨텍스트`는 변수 객체를 생성하는 대신 자바스크립트 구동 환경이 별도로 제공하는 객체, 즉 전역 객체를 활용한다. 
전역 객체에는 브라우저의 `window`, Node.js의 global 객체 등이 있다. 
이들은 자바스크립트 내장 객체가 아닌 호스트 객체로 분류된다.


변수 정보를 수집하는 과정을 모두 마쳤더라도 아직 실행 컨텍스트가 관여할 코드들은 실행되기 전의 상태이다.
코드가 실행되기 전임에도 불구하고 자바스크립트 엔진은 이미 해당 환경에 속한 코드의 변수명들을 모두 알고 있게 되는 셈이다.

그렇다면 엔진의 실제 동작 방식 대신에 `자바스크립트 엔진은 식별자들을 최상단으로 끌어올려놓은 다음 실제 코드를 실행한다`라고 생각해도 문제될 것이 없다.

여기서 **호이스팅**이라는 개념이 등장한다.
**호이스팅**: 변수 정보를 수집하는 과정을 더욱 이해하기 쉬운 방법으로 대체한 가상의 개념이다.
(자바스크립트 엔진이 실제로 끌어올리지는 않지만 편의상 끌어올린 것으로 간주하자는 것이다.)

### 호이스팅 규칙
`environmentRecord`에는 매개변수의 이름, 함수 선언, 변수명 등이 담긴다.

```js
function a(x) { //수집 대상 1(매개변수)
    console.log(x) //(1)
    var x //수집 대상 2(변수 선언)
    console.log(x) //(2)
    var x = 2 //수집 대상 3(변수 선언)
    console.log(x) //(3)
}
```

1. 호이스팅이 되지 않았을 때 예상 출력 값
 - (1)에는 함수 호출 시 전달한 1 출력
 - (2)에는 선언된 변수 x에 할당한 값이 없으므로 undefined가 출력
 - (3)에는 2가 출력

 arguments에 전달된 인자를 담는 것을 제외하면 코드 내부에서 변수를 선언한 것과 다른 점이 없다.
 특히 `LexicalEnvironment` 입장에서는 완전히 같다. 
 따라서 인자를 함수 내부의 다른 코드보다 먼저 선언 및 할당이 이뤄진 것으로 간주할 수 있다.

```js
function a () {
    var x = 1 //수집 대상 1(매개변수 선언)
    console.log(x) //(1)
    var x // 수집 대상 2(변수 선언)
    console.log(x) //(2)
    var x = 2 //수집 대상 3(변수 선언)
    console.log(x) //(3)
}
a()
```
이 상태에서 변수 정보를 수집하는 과정, 즉 **호이스팅**을 처리해보자!

`environmentRecord`는 현재 실행될 컨텍스트의 대상 코드 내에 어떤 `식별자`들이 있는지에만 관심이 있고,
각 식별자에 어떤 값이 할당될 것인지는 관심이 없다.

**호이스팅을 마친 상태로 바꾸면**
```js
function a(){
    var x // 수집 대상 1의 변수 선언 부분
    var x // 수집 대상 2의 변수 선언 부분
    var x // 수집 대상 3의 변수 선언 부분

    x = 1 // 수집 대상 1의 할당 부분
    console.log(x) // (1) 1
    console.log(x) // (2) 1
    x = 2 // 수집 대상 3의 할당 부분
    console.log(x) //(3) 2
}
```

### 호이스팅 두번째 예시

```js
function a() {
    console.log(b) // (1)
    var b = 'bbb' // 수집 대상 1(변수 선언)
    console.log(b) // (2)
    function b() {} // 수집 대상 2(함수 선언)
    console.log(b)
}
```
`a 함수`를 실행하는 순간 a 함수의 실행 컨텍스트가 생성된다.
이때 변수명과 함수 선언 정보를 끌어올린다(수집한다).

```js
function a() {
    var b
    function b() {} //함수 선언은 전체를 끌어올린다

    console.log(b) //(1) b함수
    b = 'bbb'
    console.log(b) //(2) 'bbb'
    console.log(b) //(3) 'bbb'
}

a()
```

1. 변수 b 선언
2. 다시 변수 b를 선언하고 함수 b를 선언된 변수 b에 할당한다.
3. 변수 b에 할당된 함수 b를 출력
4. 변수 b 에 'bbb' 할당
7. 'bbb' 출력


### 함수 선언문과 함수 표현식
- 함수 선언문: function 정의부만 존재하고 별도의 할당 명령이 없는 것을 의미한다. 함수명이 정의되어야 한다.
- 함수 표현식: 정의한 function을 별도의 변수에 할당하는 것을 의미한다. 함수명이 없어도 된다.

```js
function a() { } //함수 서언문 함수명 a가 곧 변수명
a()

var b = function() { }//익명 함ㅅ 표현식 변수명 b가 곧 함수명
b()

var b = function d() { } //기명 함수 표현식 변수명은 c 함수명은 d
c()//실행 ok
d() // 에러!
```

`함수 선언문`은 전체를 호이스팅한 반면 `함수 표현식`은 변수 선언부만 호이스팅한다.

### 스코프, 스코프 체인, outerEnvironmentReference

**스코프**: 식별자에 대한 유효범위이다.
ES5까지의 자바스크립트는 특이하게도 전역공간을 제외하면 **오직 함수에 의해서만** 스코프가 생성된다.

이러한 '식별자의 유효범위'를 안에서부터 바깥으로 차례대로 검색해나가는 것을 `스코프 체인`이라고 한다.
이를 가능하게 하는 것이 바로 `LexicalEnvironment`의 두번째 수집 자료인 `outerEnvironmentReference`이다.

### 스코프 체인
outerEnvironmentReference는 현재 호출된 함수가 선언될 당시의 LexicalEnvironment를 참조한다.
과거 시점인 **선언될 당시**에 주목!

예를 들어 A 함수 내부에 B 함수를 선언하고 다시 B 함수 내부에 C 함수를 선언한 경우,
함수 C의 outerEnvironmentReference는 함수 B의 LexicalEnvironment를 참조한다.
함수 B의 outerEnvironmentReference는 다시 함수 B가 선언되던 때(A)의  LexicalEnvironment를 참조한다.

이처럼 `outerEnvironmentReference`는 연결리스트 형태를 띈다. 
선언 시점의 LexicalEnvironment를 계속 찾아 올라가면 마지막엔 전역 컨텍스트의 LexicalEnvironment가 있을 것 이다. 

또한 각 outerEnvironmentReference는 오직 자신이 선언된 시점의 LexicalEnvironment만 참조하고 있으므로 가장 가까운 요소부터 차례대로만 접근할 수 있고 다른 순서로 접근하는 것은 불가능 하다.

이런 구조적 특성 덕분에 여러 스코프에서 동일한 식별자를 선언한 경우 **무조건 스코프 체인 상에서 가장 먼저 발견된 식별자**에만 접근 가능 하게 된다.

```js
var a = 1
var outer = function () {
    var inner = function () {
        console.log(a)
        var a = 3
    }
    inner()
    console.log(a)
}
outer()
console.log(a)
```

1. 전역 컨텍스트가 활성화된다. 전역컨텍스트의 `environmentRecord`에 {a, outer} 식별자를 저장한다. 전역 컨텍스트는 선언 시점이 없으므로 전역 컨텍스트의 `outerEnvironmentReference`에는 아무것도 담기지 않는다.(this:전역객체)
2. 전역 스코프에 있는 변수 a에 1을 outer에 함수를 할당
3. outer 함수 호출한다. 이에 따라 전역컨텍스트는 임시 중단되고 outer 실행 컨텍스트가 활성화되어 2번째줄로 이동한다.
4. outer 실행 컨텍스트의 `environmentRecord`에 {inner} 식별자를 저장한다. `outerEnvironmentReference`에는 outer 함수가 선언될 당시 LexicalEnvironment가 담긴다. outer 함수는 전역 공간에서 선언됐으므로 전역 컨텍스트의 LexicalEnvironment를 참조복사한다. 이를 [GLOBAL, {a, outer}]라고 표기하자. 첫 번째는 실행 컨텍스트의 이름, 두번째는 
`environmentRecord` 객체 이다.
5. outer 스코프에 있는 변수 inner에 함수를 할당한다.
6. inner 함수를 호출한다. outer 실행 컨텍스트의 코드는 7번째 줄에서 임시 중단되고, inner 실행 컨텍스트가 활성화 되어 3번째 줄로 이동한다.
7. inner 실행 컨텍스트의 `environmentRecord`에 {a} 식별자를 저장한다. `outerEnvironmentReference`에는 inner 함수는 outer 함수 내부에서 선언됐으므로 outer 함수의 LexicalEnvironment, 즉 [outer, {inner}]를 참조복사한다.
8. 식별자 a에 접근하고자 한다. 현재 활성화 상태인 inner 컨텍스트의 `environmentRecord`에 a를 검색한다. a가 발견됐는데 여기에는 아직 할당된 값이 없습니다.(undefined 출력)
9. inner 스코프에 있는 변수 a에 3을 할당
10. inner 함수 실행이 종료된다. inner 실행 컨텍스트가 콜 스택에서 제거되고, 바로 아래의 outer 실행 컨텍스트가 다시 활성화된다.
11. 식별자 a에 접근하고자 한다. 이때 자바스크립트 엔진은 활성화된 실행 커넥스트의 LE에 접근한다. 첫 요소의 `environmentRecord`에 a가 있는지 찾아보고 없으면 `outerEnvironmentReference`로 넘어가는 식으로 계속해서 검색한다. 여기는 두번째, 즉 전역 LE에 A가 있으니 그 A에 저장된 값 1을 반환한다. 
12. outer 함수 실행이 종료된다. outer 실행 컨텍스트가 콜 스택에서 제거되고, 바로 아래의 전역 컨텍스트가 다시 활성화된다.
13. 식별자 a에 접근하고자 한다. 현재 활성화 상태인 전역 컨텍스트의 `environmentRecord`에서 a를 검색한다. 바로 a를 찾을 수 있다. 1 출력 이로써 모든 코드의 실행이 완료되고 전역 컨텍스트가 콜 스택에서 제거되고 종료한다. 


inner 함수 내부에서 a 변수를 선언했기 때문에 전역 공간에서 선언한 동일한 이름의 a 변수에는 접근할 수 없는 셈이다.
이를 **변수 은닉화** 라고 한다.

### 전역변수와 지역변수
- 전역변수: 전역 공간에서 선언한 변수
- 지역변수: 함수 내부에서 선언한 변수

## 04 this
실행 컨텍스트의 `thisBinding`에는 this로 지정된 객체가 저장된다.
실행 컨텍스트 활성화 당시에 this가 지정되지 않는 경우 this에는 전역 객체가 저장된다. 
그밖에는 함수를 호출하는 방법에 따라 this에 저장되는 대상이 다르다.
이에 대해서는 3장에서 자세히 다루겠다.


## 퀴즈
```js
var name = 'jiwon'
function log() {
    console.log(name)
}

function wrapper(){
    name = 'jiwon'
    log()
}

wrapper()
```

```js
var name = 'jiwon'
function log() {
    console.log(name)
}

function wrapper(){
    var name = 'jiwon'
    log()
}

wrapper()
```