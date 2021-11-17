# 06 프로토타입

- JavaScript는 프로토타입 기반 언어다.
- 클래스 기반 언어는 `상속`을 사용하지만, 
- 프로토타입 기반 언어는 **어떤 객체를 `원형`으로 삼고 이를 복제**함으로써 `상속`과 비슷한 효과를 낸다.

## 1. constructor, prototype, instance
```js
var instance = new Constructor()
```
1) 생성자 함수(Consturctor)를 new 연산자와 함께 호출한다.
2) Constructor에서 정의된 내용을 바탕으로 새로운 instance가 생성된다.
3) instance에는 __proto__라는 프로퍼티가 자동으로 생성된다.
4) __proto__프로퍼티는 Costructor의 prototype 프로퍼티를 참조한다.


![image](https://user-images.githubusercontent.com/76730867/141883614-4a43f4d3-86c6-47f8-beb2-c8b9539093ef.png)

  - prototype 객체에는 인스턴스가 사용할 메서드를 저장한다.
  - 그러면 인스턴스에서도 숨겨진 프로퍼티 __proto__를 통해 이 메서드들에 접근할 수 있게 된다.
---
**참고**
- 실무에서는 `__proto__`라고 직접 쓰지 않는다.
-  `Object.getPrototypeof()`, `Object.create()`등을 이용해 접근하는 것을 권장한다.
- ES5.1 명세에서는 `__proto__`가 아니라 `[[prototype]]`로 정의돼 있다.
- ---

**예시) Person.prototype**
```js
var Person = function(name){
    this._name = name
}
Person.prototype.getName = function(){
    return this._name; // this는 누구를 가리키고 있을까?
}
```
Person의 인스턴스들은 `__proto__` 프로퍼티를 통해 getName을 호출할 수 있다.

```js
var suzi = new Person('suzi')
suzi.__proto__.getName() // undefined
```
**실행결과** 
- 메서드 호출 결과로 undefined가 나왔다.
- 오류가 발생하지 않고, undefined가 나왔다는 것은 이 변수가 '호출 할 수 있는 함수'에 해당한다는 것이다.
- 문제는 함수 내부에서 반환하는 값이 잘못 된 것이다!
- 함수를 `메서드`로서 호출할 때는 **메서드 명 바로 앞 객체가 this**가 된다.
- getName 함수 내부에서의 **this는 `suzi`가 되지 않고, `suzi.__proto__`라는 객체**가 된다.
- 식별자가 정의돼 있지 않기 때문에 Error대신 undefined를 반환한다.
<br>

**수정 후 코드**
```js
var suzi = new Person('suzi')
suzi.getName() // suzi
```
- `__proto__`를 빼면 this는 instance가 되어 원하는 값을 출력할 수 있다.
- `__proto__`프로퍼티는 "Costructor의 prototype 프로퍼티를 참조한다."고 했지만,
- `__proto__`는 **생략 가능**한 프로퍼티이기 때문에 가능하다.


```js
1) suzi.__proto__.getName
2) suzi.getName
```
- 1,2 모두 `__proto__`에 있는 getName 메소드에 접근할 수 있다.
-  `__proto__`프로퍼티는 생략 가능하도록 구현돼 있기 때문에 **생성자 함수의 prototype에 어떤 메서드나 프로퍼티가 있다면 인스턴스에서도 동일하게 접근할 수 있다.**


![image](https://user-images.githubusercontent.com/76730867/141886399-180dd52c-9332-41a7-969f-b2a132c2c33c.png)

- 하지만 `__proto__`를 생략하지 않으면 **this는 서로 다른 객체를 바라본다**는 차이는 있다.
<br>

**예시) Constructor와 Instance 내부 살펴보기**
```js
var Constructor = function (name) {
    this.name = name;
};

Constructor.prototype.method1 = function () {};
Constructor.prototype.property1 = `constructor prototype property`;

var instance = new Constructor('instance');
console.dir(Constructor);
console.dir(instance);
```

![image](https://user-images.githubusercontent.com/76730867/141901965-88bd77e4-9142-47e1-a32e-1bcfdc989444.PNG)
- 색상 차이는 `{enumerable:false}` 속성이 부여된 프로퍼티에 따라 다르다.
- 짙은 색은 enumerable, **열거 가능**한 프로퍼티를 의미한다.
- for in 등으로 **객체의 프로퍼티 전체에 접근 가능여부**를 구분했다.
<br>

**예시) Constructor의 다른 프로퍼티들**
```js
var arr = [1,2]
arr.forEach(function(){}) // O
Array.isArray(arr)        // O
ar.isArray()              // TypeError: arr.isArray is not a function
```

<p align='center'><img src="https://user-images.githubusercontent.com/76730867/141904952-63f936fc-5098-4481-a20a-2d8211f58282.png" width="400" height="300"/></center></p>

- Array의 prototype 프로퍼티 내부에 있지 않은 `from()`과 같은 메서드들은,
  1) 인스턴스가 직접 호출할 수 없다.
  2) 생성자 함수(Array)에서 직접 접근해야 실행이 가능하다.

---

## 2. constructor 프로퍼티

### 1) Constructor.prototype.constructor
```js
var arr = [1,2]
Array.prototype.constructor === Array
arr.__proto__.consturctor === Array
arr.constructor === Array
```

```js
var arr2 = new arr.constructor(3,4) //== var arr2 = [3,4]
```
- prototype 객체 내부에 constructor 프로퍼티가 있다.
- 인스턴스로부터 그 원형이 무엇인지를 알 수 있다.

### 2) constructor는 변경할 수 있다.
- constructor는 `읽기 전용 속성`이 부여된 예외적인 경우를 제외하고는 값을 바꿀 수 있다.
- `읽기 전용 속성`: 기본형 리터럴 변수: number, string, boolean

```js
var newConstructor = function(){
    console.log('this is new constructor!')
}
var dataTypes = [
    1,                  // Number false
    'test',             // String false
    true,               // Boolean false
    {},                 // NewConstructor false
    [],                 // NewConstructor false
    function() {},      // NewConstructor false
    /test/,             // NewConstructor false
    new Number(),       // NewConstructor false
    new String(),       // NewConstructor false
    new Boolean(),      // NewConstructor false
    new Object(),       // NewConstructor false
    new Array(),        // NewConstructor false
    new Function(),     // NewConstructor false
    new RegExp(),       // NewConstructor false
    new Date(),         // NewConstructor false
    new Error()         // NewConstructor false
]

dataTypes.forEach(function(item){
    item.constructor = NewConstructor
    console.log(item.constructor, item instanceof NewConstructor)
    // item instanceof NewConstructor: 
    // item이 newConstructor의 인터스턴스냐?
})
```
- constructor를 변경하더라도 참조하는 대상이 변경될 뿐, 이미 만들어진 인스턴스의 원형이 바뀐다거나 데이터 타입이 변하는 것은 아니다.
- 어떤 인스턴스의 생성자 정보를 알아내기 위해 constructor 프로퍼티만 의존하는 것은 항상 안전하지는 않음을 알 수 있다. 
- 하지만 이는 클래스 상속을 흉내 내는 기능도 가능하게 한다.

**예제) 다양한 constructor 접근 방법**
```js
ver Person = function(name){
    this.name = name
}
var p1 = new Person('사람1')
var p2 = new Person.prototype.constructor('사람2')
var p3 = new p1.__proto__.constructor('사람3')
var p4 = new p1.constructor('사람4')
var p1Proto = Object.getPrototypeof(p1)
var p5 = p1Proto.constructor('사람5')

[p1,p2,p3,p4,p5].forEach(function(item){
    console.log(item, item instanceof Person)
})
```

```js
// 아래는 모두 동일한 constructor를 가리킨다.
[Constructor]
[instance].__proto__.constructor
[instance].constructor
Object.getPrototypeof([instance]).constructor
[Constructor].prototype.constructor
```

```js
// 아래는 모두 동일한 prototype에 접근한다.
[Constructor].prototype
[instance].__proto__
[instance]
Object.getPrototypeof([instance])
```

## 3. 프로토타입 체인

### 1) 메서드 오버라이드
### 2) 프로토타입 체인
### 3) 객체 전용 메서드의 예외사항
### 4) 다중 프로토타입 체인

## 정리
- 어떤 생성자 함수를 new 연산자와 함께 호출하면 Consturctor에서 정의된 내용을 바탕으로 새로운 인스턴스가 생성된다.
- 이 인스턴스에는 __proto__라는, Constructor의 prototype 프로퍼티를 참조하는 프로퍼티가 자동으로 부여된다.
- __proto__는 생략 가능한 속성이기 때문에, 인스턴스는 Constructor.prototype의 메서드를 마치 자신의 메서드인 것처럼 호출할 수 있다.
<br>
- Constructor.prototype에는 constructor라는 프로퍼티가 있다.
- 이는 생성자 함수 자신을 가리킨다.
- 이 프로퍼티는 인스턴스가 자신의 생성자 함수가 무엇인지를 알고자 할 때 필요한 수단이다.
<br>
- 직각삼각형의 대각선 방향, 즉 __proto__ 방향을 계속 찾아가면 최종적으로 Object.prototype에 당도한다. 
- 이런식으로 __proto__안에 다시 __proto__를 찾아가는 과정을 프로토타입 체이닝이라고 한다.
- 이를 통해 각 프로토타입 메서드를 자신의 것처럼 호출할 수 있다.
- 이때 접근 방식은 자신으로부터 가장 가까운 대상부터 점차 먼 대상으로 나아가며, 원하는 값을 찾으면 검색을 중단한다.
- Object.prototype에는 모든 데이터 타입에서 사용할 수 있는 범용적인 메서드만이 존재하며, 객체 전용 메서드는 여느 데이터 타입과 달리 Object 생성자 함수에 스태틱하게 담겨있다.
