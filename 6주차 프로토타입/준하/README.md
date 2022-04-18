# 06 프로토타입

-   `JavaScript`는 프로토타입 기반 언어다. 
-  클래스 기반 언어는 `상속`을 사용하지만, 프로토타입 기반 언어는 어떤 객체를 `원형`으로 삼고 이를 복제함으로써 `상속`과 비슷한 효과를 낸다.


## 1. Constructor, prototype, instance


### 인스턴스 생성 과정

```js
var newInstance = new Constructor();
```

1. `Constructor`를 `new` 연산자와 함께 호출한다.
2. `Constructor`에서 정의된 내용을 바탕으로 새로운 인스턴스가 생성된다.
3. 인스턴스에는 프로퍼티 `__proto__`가 자동으로 부여된다.
4. `__proto__`는 `Constructor`의 `prototype`를 참조한다.

![image](https://user-images.githubusercontent.com/76730867/141883614-4a43f4d3-86c6-47f8-beb2-c8b9539093ef.png)

- `prototype` 객체: `Constructor` 내부에 있으며, 인스턴스가 사용할 메서드를 저장하는 곳
- `__proto__` 객체: `instance` 내부에 숨겨져 있으며, `prototype`에 정의된 메서드들을 접근할 수 있는 곳

---
**참고) `__proto__`라는 명칭**
- 실무에서는 `__proto__`라고 직접 쓰지 않는다.
- `Object.getPrototypeof()`, `Object.create()`등을 이용해 접근하는 것을 권장한다.
  - `Object.getPrototypeOf(객체)`: 프로토타입을 반환
  - `Object.create(custom_proto)`: 지정된 프로토타입을 갖는 새 객체 반환
- `var obj = Object.create(Object.prototype)` VS  `new Object()` 
  - 생성자 함수를 실행하지 않고 객체를 생성한다는 점이다.
- ES5.1 명세에서는 `__proto__`가 아니라 `[[prototype]]`로 정의돼 있다.

---

#### 예시1) 인스턴스에서 `Constructor.prototype` 접근하기

```js
var Person = function (name) {
    this._name = name; 
};

Person.prototype.getName = function () {
    return this._name; 
};
```

```js
var suzi = new Person('suzi');

suzi.getName();
// suzi

suzi.__proto__.getName();
// undefined
```

<br>

##### 1. `__proto__`는 생략할 수 있다.

- 인스턴스에 `getName`이 없다면 자동적으로 `__proto__`를 체이닝한다.
- 따라서 인스턴스의 숨겨진 프로퍼티 `__proto__`를 굳이 명시하지 않아도 된다.

```js
1) suzi.__proto__.getName
2) suzi.(__proto__.)getName
```

<br>

##### 2. `this`가 서로 다른 객체를 바라본다.

- `__proto__`의 생략 유무의 차이는 **this가 서로 다른 객체를 바라본다**는 차이가 있다.
- 함수를 `메서드`로서 호출할 때는 **메서드 명 바로 앞 객체**가 this가 된다.


```js
1) suzi.__proto__.getName
2) suzi.getName
```

- `suzi`는 `_name`프로퍼티가 있다.
- `suzi.__proto__`는 `_name`프로퍼티가 없기 때문에 `undefined`가 나온다.

##### 결론

- 1번, 2번 모두 `prototype`에 있는 `getName` 메소드에 접근할 수 있지만, this가 바라보는 대상이 달라지게 된다.
- `Constructor.prototype`에 메서드, 프로퍼티를 정의하면, 인스턴스에서도 동일하게 접근할 수 있다.

![image](https://user-images.githubusercontent.com/76730867/141886399-180dd52c-9332-41a7-969f-b2a132c2c33c.png)

---
**참고) `Constructor`와 `Instance` 내부 살펴보기**

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

- 옅은 색: `{enumerable:false}`
- 짙은 색: `{enumerable:true}`
  - **열거 가능**한 프로퍼티
  - `for in` 등으로 **객체 프로퍼티에 접근할 수 있음**
---

### 예시2) Constructor의 다른 프로퍼티

<p align='center'><img src="https://user-images.githubusercontent.com/76730867/141904952-63f936fc-5098-4481-a20a-2d8211f58282.png" width="400" height="300"/></center></p>

```js
var arr = [1, 2];

arr.forEach(function () {}); // O
arr.isArray(); // X: TypeError: arr.isArray is not a function
Array.isArray(arr); // O
```

- **스태틱 메서드**: `Array.prototype` 내부에 있지 않은 변수는 인스턴스가 직접 호출할 수 없고, `생성자 함수(Array)`에서 직접 접근해야 실행할 수 있다.

---

## 2. `.constructor` 프로퍼티

### 1) `Constructor.prototype.constructor`

```js
var arr = [1, 2];

Array.prototype.constructor === Array;
arr.__proto__.constructor === Array;
arr.constructor === Array;
```
-   prototype 객체 내부에 `constructor` 프로퍼티가 있다.
-  `constructor` 프로퍼티를 통해 인스턴스로부터 그 원형이 무엇인지를 알 수 있다.

```js
var arr2 = new arr.constructor(3, 4); 
// == var arr2 = new Array(3,4)
// == var arr2 = [3,4] 
```


### 2) `constructor` 프로퍼티는 변경할 수 있다.

-  `constructor`는 `읽기 전용 속성`이 부여된 예외적인 경우를 제외하고는 값을 바꿀 수 있다.
-  기본형 리터럴 변수 `number`, `string`, `boolean`는 `읽기 전용 속성` 되어 있다.

```js
var newConstructor = function () {
    console.log('this is new constructor!');
};

var dataTypes = [
    1, // Number, false
    'test', // String false
    true, // Boolean false
    {}, // NewConstructor false
    [], // NewConstructor false
    function () {}, // NewConstructor false
    /test/, // NewConstructor false
    new Number(), // NewConstructor false
    new String(), // NewConstructor false
    new Boolean(), // NewConstructor false
    new Object(), // NewConstructor false
    new Array(), // NewConstructor false
    new Function(), // NewConstructor false
    new RegExp(), // NewConstructor false
    new Date(), // NewConstructor false
    new Error(), // NewConstructor false
];

dataTypes.forEach(function (item) {
    item.constructor = NewConstructor;
    console.log(item.constructor, item instanceof NewConstructor);
});
```
- `item instanceof NewConstructor` 값에서 알 수 있듯이, `constructor`를 변경하더라도 참조하는 대상이 변경될 뿐, 이미 만들어진 인스턴스의 원형이 바뀐다거나 데이터 타입이 변하는 것은 아니다.
- 따라서 어떤 인스턴스의 생성자 정보를 알아내기 위해 `constructor` 프로퍼티만 의존하는 것은 항상 안전하지 않다.
- 하지만 이를 이용하여 클래스 상속을 흉내낼 수 있다.

**예제) `constructor`에 접근할 수 있는 다양한 방법을 이용하여 인스턴스를 생성할 수 있다.**

```js
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

## 3. 프로토타입 체인

#### 1) 메서드 오버라이드

**예시) `Constructor.prototype.method`와 `instance.method`의 이름이 같다면?**

```js
var Person = function (name) {
    this.name = name;
};

Person.prototype.getName = function () {
    return this.name;
};

var junha = new Person('준하');

junha.getName = function (name) {
    return `${this.name} + 내가 돌아왔다.`;
};

console.log(junha.getName()); // 준하야. 내가 돌아왔다. 
```

-   `getName`메서드는 원본을 제거하고 다른 대상으로 교체한 것이 아니라, 원본이 그대로 있는 상태에서 다른 대상을 그 위에 얹는 오버라이딩이 발생했다.
-   JS엔진은 `getName` 메서드를 찾기 위해 가장 가까운 대상인 인스턴스 자신의 프로퍼티를 먼저 검색한 후에, 해당 프로퍼티가 없다면 그 다음 가까운 대상인 생략가능한 `__proto__` 프로퍼티를 검색하는 순서로 진행되기 때문이다.

**Q. 인스턴스 메서드를 건너띄고 `Constructor.prototype`에 있는 메서드에 접근하려면?**

```js
junha.__proto__.getName(); // undefined
```

- 간단하다. `__proto__`에서 메서드를 호출하면 된다.
- 하지만 `__proto__`는 `name` 프로퍼티가 없기 때문에 `undefined`가 리턴된다.
- `name`프로퍼티가 있는 `junha`인스턴스를 this로 바라보게 하려면 `call` 함수를 이용해야한다.


**A. Call 함수 활용하여 this가 인스턴스를 바라보게 한다.**

```js
junha.__proto__.getName.call(junha)); // 준하
```
- `call` 함수를 활용한 결과, `prototype`에 정의한 `getName` 메소드 안의 `this`가 더이상 `__proto__`를 바라보지 않고 `junha`를 바라보게 된다.

### 2) 프로토타입 체인

#### (1) `__proto__`에도 `__proto__`가 있다

```js
var arr = [1, 2];
```
![](https://user-images.githubusercontent.com/76730867/142203678-929b18ac-25ce-4fa3-9b3a-9789f7738af4.PNG)

- `arr`의 구조를 살펴보면 `arr.__proto__` 뿐만아니라,  `arr.__proto__.__proto__`도 있다.
-  이는 `arr.__proto__`또한 **객체**이기 때문에, 생성될 때 `__proto__`가 자동으로 부여된 것이다.
-   따라서 `__proto__`를 포함한 모든 `객체.__proto__`는 `Object.prototype`이 연결된다.
-   이와 같은 프로토타입 체이닝을 그림으로 표현하면 아래와 같다.
<p style="display:flex">
    <img src="https://user-images.githubusercontent.com/76730867/142205344-0dfb7cdc-c8d6-48b3-87b5-bccd1af2b1c4.PNG" style="width:300px"/>
    <img src="https://user-images.githubusercontent.com/76730867/142761294-93a13e34-a76a-4cfb-b061-8ec3561ad75f.png" style="width:300px">
</p>


**예시) 프로토타입 체이닝**을 이용하여, 배열에서 `배열 메서드`와 **`객체 메서드`** 호출하기

```js
var arr =[1,2]

// .push(): 배열 메서드
arr(.__proto__).push(3) 

// .hasOwnProperty(): 객체 메서드
arr(.__proto__)(.__proto__).hasOwnProperty(2)
```

**예시) 프로토타입 체이닝 & 메서드 오버라이드**

```js
var arr = [1, 2];
arr.toString(); // 1,2
// Array.prtotype.toString() 사용

arr.toString = function () {
    return this.join('_');
};

arr.toString(); // 1_2
// arr.toString() 사용
```

**정리**
-   어떤 메서드를 실행하면, 찾을 때까지 `__proto__`를 거듭해 검색해서 실행한다.
-   데이터의 `__proto__` 내부의 `__proto__`가 연쇄적으로 이어진 것을 **프로토타입 체인**이라고 한다.
-   이 체인을 따라가며 검색하는 것을 **프로토타입 체이닝**이라고 한다.

#### (2) 객체 전용 메서드

- 어떤 생성자 함수든 `prototype`는 반드시 객체이기 때문에 Object.`prototype`은 언제나 프로토타입 체인의 최상단에 존재한다. 
- 그 결과 `Object.prototype`에 메서드를 정의하면 모든 데이터 타입에서 메서드를 사용할 수 있게 된다.
- 따라서 객체만을 대상으로 동작하는 객체 전용 메서드들은 `Object.prototype`이 아닌 Object에 스태틱 메서드로 부여해야한다.
- `Object.prototype`이 참조형 데이터뿐 아니라 기본형 데이터조차 `__proto__`에 반복 접근함으로써 도달할 수 있는 최사위 존재이기 때문에 객체 한정 메서드들은 `Object.prototype`이 아닌 `Object`에 직접 부여해야 한다.
- - 반대로 같은 이유에서 `Object.prototype`에는 어떤 데이터에서도 활용할 수 있는 범용적인 메서드가 있다. `toString`, `hasOwnProperty`, `valueOf`, `isPrototypeOf` 은 모든 변수가 마치 자신의 메서드인 것처럼 호출할 수 있다.


```js
var _proto = Object.create(null);
_proto.getValue = function(key) {
    return this[key]
}

var obj = Object.create(_proto)
obj.a = 1

console.log(obj) //{a, [__proto__,[getValue]}
```
- `Object.create(null)`은 `__proto__`가 없는 객체를 생성한다.
- 이 방식으로 만든 객체는 일반적인 데이터에서 반드시 존재하던 내장(built-in) 메서드 및 프로퍼티들이 제거됨으로써 기본 기능에 제약이 생긴 대신, 객체 자체의 무게가 가벼워짐으로써 성능상 이점이 생긴다. 

### 4) 다중 프로토타입 체인

- 자바스크립트의 기본 내장 데이터 타입들은 모두 프로토타입 체인이 1단계(객체)이거나, 2단계(그 외 나머지)로 끝난다. (사용자가 새롭게 만든다면 그 이상도 가능하다.)
- 대각선 `__proto__`를 연결해나가면 무한대로 체인 관계를 이어나가, 다른 언어의 클래스와 비슷하게 동작하는 구조를 만들 수 있다. 

```js
var Grade = function() {
    var args = Array.prototype.slice.call(arguments)
    for (var i = 0; i<args.length; i++){
        this[i] = args[i]
    }
    this.length = args.length
    // return this;  
    // 여기서 리턴되는 this는 this.0, this.1, ..., this.length 가 있는 유사배열객체이다.
}
var g1 = new Grade(100, 80)
```

```js
Grade.prototype = [] 
var g1 = new Grade(100, 80)

console.log(g.pop) // 80
g.push(90)
console.log(g) // Grade(2) [100, 90]
```

- `[]`는 `[].__proto__`, `Array.prototype` 순서로 참조하여, 인스터스인 `g`에서 직접 배열의 메서드를 사용할 수 있게 된다.
- 별개로 분리돼 있던 데이터가 연결되어 하나의 프로토타입 체인 형태를 띠게 된다.
- g 인스턴스 입장에서는 프로토타입 체인에 따라 g 객체 자신이 지니는 멤버, `Grade.prototype`에 있는 멤버, `Array.prototype`에 있는 멤버, `Object.prototype`에 있는 멤버에 접근할 수 있게 된다.

![](https://user-images.githubusercontent.com/76730867/142762946-55ecbc47-723a-46d6-a21d-8cc86a1fca3a.jpg)
![](https://user-images.githubusercontent.com/76730867/142762967-d1c43b92-5f57-456a-87d8-aa3e91eee203.png)

## 정리

- **`__proto__`**
  -  생성자 함수를 new 연산자와 함께 호출하면 Consturctor에서 정의된 내용을 바탕으로 새로운 인스턴스가 생성된다.
  -  이 인스턴스에는 `__proto__`라는, `Constructor.prototype`를 참조하는 프로퍼티가 자동으로 부여된다.
  - `__proto__`는 생략 가능한 속성이기 때문에, 인스턴스는 `Constructor.prototype`의 메서드를 마치 자신의 메서드인 것처럼 호출할 수 있다.
- **`constructor`**
  -   `Constructor.prototype`에는 `constructor`라는 프로퍼티가 있다.
  -   이는 생성자 함수 자신을 가리킨다.
  -   이 프로퍼티는 인스턴스가 자신의 생성자 함수가 무엇인지를 알고자 할 때 필요한 수단이다.
- **프로토타입 체이닝**
  -   직각삼각형의 대각선 방향, 즉 **proto** 방향을 계속 찾아가면 최종적으로 `Object.prototype`에 당도한다.
  -   이런식으로 **proto**안에 다시 **proto**를 찾아가는 과정을 프로토타입 체이닝이라고 한다. 이를 통해 각 프로토타입 메서드를 자신의 것처럼 호출할 수 있다.
  -   이때 접근 방식은 자신으로부터 가장 가까운 대상부터 점차 먼 대상으로 나아가며, 원하는 값을 찾으면 검색을 중단한다.
  -   `Object.prototype`에는 모든 데이터 타입에서 사용할 수 있는 범용적인 메서드만이 존재하며, 객체 전용 메서드는 여느 데이터 타입과 달리 Object 생성자 함수에 스태틱하게 담겨있다.

```
함수는 statements처럼 보이지만 객체다!
function Perstion() {}
var Person = new Function() 는 똑같은 거다 
객체이기 때문에 property를 가질 수 있다.
```