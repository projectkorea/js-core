# 07 클래스
- 자바스크립트는 `프로토타입 기반 언어`라 `상속`개념이 존재하지 않는다. 
  1. ES5 이하의 `클래스를 흉내내기 위한 구현방식`을 학습해보자.
  2. ES6에 추가된 `syntatic sugar` 클래스 문법을 통해 간단하게 클래스를 구현해보자.

## 1. 클래스와 인스턴스

![](https://user-images.githubusercontent.com/76730867/141934645-785909c0-99ed-4a04-aa0f-c9713428c098.jpg)

- **추상화**: 핵심적인 개념을 간추려 내는 것
- **클래스**
  - `공통 요소를 지니는 집단`을 분류하기 위한 개념
  - 인스턴스들로부터 공통점을 발견해서 클래스를 정의하는 현실과 달리, **클래스가 먼저 정의돼야만 그로부터 공통적인 요소를 지니는 개체들을 생성**할 수 있다.
  - 클래스는 사용하기에 따라 추상적인 대상도, 구체적인 개체도 될 수 있다.
- **인스턴스**
  - 클래스 속성을 지니는 실존하는 개체
  - 조건에 부합하는 구체적인 예시

## 2. 자바스크립트 클래스

![](https://user-images.githubusercontent.com/76730867/142974262-86d900ea-bd6e-4676-b570-0b75bebe9cea.jpg)


**예시) 인스턴스에서는 스태틱 메서드를 참조할 수 없다.**
```js
// 생성자
var Rectangle = function(width, height) {
    ...
}

// 스태틱 메서드
Rectangle.isRectangle = function(instance) {
    ...
}

// 프로토타입 메서드
Rectangle.prototype.getArea = function() {
    ...
}
```

```js
var rect = new Rectangle(3,4)
rect.getArea())              // OK
rect.isRectangle(rect1))     // Error!!! 인스턴스는 스태틱 메서드를 참조할 수 없다.
Rectangle.isRectangle(rect1)) // OK
```

---

## 3. 클래스 상속 흉내내기(ES5)

### 1) <배열을 상속하는 유사배열객체>

- **클래스에 있는 값이 인스턴스의 동작에 영향을 주는** 예시를 살펴볼 것이다.
- `Array`클래스를 상속하는 `Grade` 클래스

```js
var Grade = function() {
  var args = Array.prototype.slice.call(arguments);
  for(var i = 0; i<args.length; i++){
    this[i] = args[i];
  }
  this.length = args.length
}

Grade.prototype = [];
var g = new Grade(100, 80);
```

- `Grade`를 통해 인스턴스를 생성하면, 전달받은 값을 이용하여 유사배열객체를 반환한다.
- 이 유사배열객체를 배열의 메서드를 활용하기 위해 `Grade.prototype = [];`를 선언했다.
##### 문제는 `Grade.length`를 삭제하면 발생한다.


```js
g.push(90) // Grade {0:100, 1:80, 2:90, length:3}
// 배열 메서드 push()가 유사배열객체에서도 작동이 잘 되는 점을 확인할 수 있다.

delete g.length
g.push(70) // Grade {0:70, 1:80, 2:90, length:0}

// 문제1: push한 값이 0번째 인덱스에 들어갔음.
// 문제2: length가 1이 됐음.
```

- `g.length`, `2`: 인스턴스 `g`의 프로퍼티
- `g.__proto__.length`, `0`: 체이닝한 `[]`의 프로퍼티
- `g.length`는 삭제되지만, `g.__proto__.length`는 `configurable:false`이다. 
- 따라서 `g.length`는 `g`의 프로퍼티에서 검색할 수 없어 `__proto__`를 체이닝하여 `g.__proto__.length` 즉, `[].length`를 참조하게 된다.


<img src="https://user-images.githubusercontent.com/76730867/142976023-2472cb58-e47d-4ae0-a76d-57d6f2e89d9f.jpg" width="500px"/>

- 클래스는 인스턴스와의 관계에서 **구체적인 데이터를 지니지 않고** 오직 인스턴스가 사용할 메서드만을 지닌 추상적인 틀로서만 작용하게끔 **클래스 추상성**을 지켜야한다.
---
### 2) <`Rectangle`을 상속하는 `Square`>
### (1) 상위 클래스의 인스턴스를 할당

- `SubClass.prototype = new SuperClass()`
- 하위 클래스로 삼을 생성자 함수의 `prototype`에 상위 클래스의 인스턴스를 할당해 **메서드 상속**을 구현해보자.

```js
var Rectangle = function(width, height) {
    this.width = width
    this.height = height
}

Rectangle.prototype.getArea = function() {
    return this.width * this.height
}

var Square = function (width) {
    Rectangle.call(this, width, width) // (1) 생성자 함수
}

Square.prototype = new Rectangle() // (2) 메서드 상속

var sq = new Square(5)         
```

- (1): `Square` 생성자 함수 내부에서 `Rectangle`의 생성자 함수를 함수로써 호출
- (2): **메서드 상속을 위해** `Square.prototype`에 `Rectangle` 인스턴스 할당

<img src="https://user-images.githubusercontent.com/76730867/142981632-ea83077c-0e0d-4261-a6da-726beb86021c.jpg" width="500px"/>

- **문제점**
  1. **클래스가 구체적인 데이터를 지닌다.**
    `Square.prototype.width`에 값을 할당 후, `sq.width`값을 지운다면 프로토타입 체이닝에 의해 `getArea` 반환값이 다르게 나온다.
  2. **`constructor`가 SuperClass를 바라본다.**
     `sq.constructor`로 접근하면 프로토타입 체이닝을 따라 `sq.__proto__.__proto__.constructor`를 참조하며, 이는 `Rectangle`을 가리키게 된다.


### (2) 해결 방법: 클래스가 구체적인 데이터를 지니지 않게!

#### i. 프로퍼티를 직접 제거한다.


```js
var Square = function (width) {
    Rectangle.call(this, width, width)
}

Square.prototype = new Rectangle()
```

```js
delete Square.prototype.width
delete Square.prototype.height
```

```js
Object.freeze(Square.prototype)
```
- `Object.freeze()`:새로운 프로퍼티를 추가할 수 없게 한다.


##### 범용성 함수 만들기

```js
var extendClass = function(SuperClass, SubClass, subMethods){
  SubClass.prototype = new SuperClass();
  for (var prop in SubClass.prototype){
    if(SubClass.prototype.hasOwnProperty(prop)){
      delete SubClass.prototype[prop];
    }
  }
  if(subMethods){
    for (var method in subMethods){
      SubClass.prototype[method] = subMethod[method];
    }
  }
}
```

```js
var Sqaure = extendClass(Rectanggle, function(width){
  Rectangle.call(this, width, width)
})
```

#### ii. 빈 생성자 함수, 브릿지 활용

- `SubClass.prototype`에 `SuperClass` 인스턴스를 할당하는 대신, 아무런 프로퍼티를 생성하지 않는 빈 생성자 함수를 하나 만들어서 `SuperClass.prototype`을 참조할 수 있게 한다.

```js
var Bridge = function() {};

Bridege.prototype = Rectangle.prototype;
Square.prototype = new Bridge();
Object.freeze(Square.prototype);
```

- Q: 그냥 `Square.prototype = Rectangle.prototype`으로 할당하면 안되나? 왜 브릿지를 사용하지?
- A: `Square`클래스가 `Rectangle` 클래스의 메서드를 **상속**하는 것을 원하는 것이지, `Rectangle`클래스의 메서드를 그대로 복제하는 것을 원하는 것이 아니기 때문이다. `Square.prototype`에 메서드를 추가하면 `Rectangle.prototype`도 변경되는 간단한 이유 때문이다.

![](https://user-images.githubusercontent.com/76730867/142983307-39e0b19a-faec-497e-bb3d-070a4960a4d2.png)


##### 범용성 함수 만들기

```js
var extendClass = (function(){
  var Bridge = function() {};
  return function (SuperClass, SubClass, SubMethods){
    Bridge.prototype = SuperClass.prototype;
    SubClass.prototype = new Bridge();
    if(subMethods){
      for(var method in SubMethods){
        Subclass.prototype[method] = subMethods[method];
      }
    }
    Object.freeze(SubClass.prototype);
    return SubClass;
  }
})()
```
- 즉시실행함수 내부에서 `Bridge`를 선언해서 이를 클로저로 활용함으로써 메모리에 불필요한 함수 선언을 줄였다.

#### iii. `Object.create()`활용

```js
Square.prototype = Object.create(Rectangle.prototype)
Object.freeze(Square.prototype)
```

- 앞서 살펴봤던 세 가지 방법 모두, `SubClass.prototype`의 `__proto__`가 `SuperClass.prototype`를 참조하고, `SubClass.prototype`에는 불필요한 인스턴스 프로퍼티가 남아있지 않게하는 방법이다.


### (3) 해결 방법: `constructor`가 SubClass를 바라볼 수 있게!

- 기본적인 상속엔 성공해도, `SubClass` 인스턴스의 `constructor`는 여전히 `SuperClass`를 가리킨다.
- `Subclass.prototype`에 `constructor` 프로퍼티를 따로 만들지 않았기 때문에 프로토타입 체인상에 가장 먼저 등장하는 `SuperClass.prototype`의 `constructor`가 가리키는 대상, `SuperClass`가 나온다.
- `SubClass.prototype.constructor`가 `SubClass`를 바라보도록 하자.

```js
SubClass.prototype.constructor = SubClass
```


### 4) Access to 상위 클래스 from 하위 클래스

- 하위 클래스 메서드에서 상위 클래스 메서드의 실행 결과를 바탕으로 추가적인 작업을 하기 위해 매번, `SuperClass.prototype.method.applay(this,arguments)`를 하기엔 가독성이 떨어진다.
- 하위 클래스에서 상위 클래스의 프로토타입 메서드에 접근하기 위한 별도의 수단을 마련해보자. 이런 수단은 다른 객체지향 언어들의 클래스 문법 중 하나인 `super`를 통해 흉내 낼 수 있다.

```js
var extendClass = function(SuperClass, SubClass, subMethods){
  // ...
  // 기능추가
  SubClass.prototype.super = function(propName) {
    var self = this;
    
    // 인자가 비어있는 경우, SuperClass 생성자 함수에 접근하는 것으로 간주
    if (!propName) return function(){
      SuperClass.apply(self,arguments);
    }

    var prop = SuperClass.prototype[propName];
    
    // 메서드가 아니고, 프로퍼티일 경우 프로퍼티 조기 반환
    if (typeof prop !== 'function') return prop;

    // 메서드 반환
    return function() {
      return prop.apply(self,arguments);
    }
  }
  // ...
  return SubClass;
}
```


```js
var Rectangle = function (width, height) {
  this.width = width
  this.height = height
}

Rectangle.prototype.getArea = function(){
  return this.width * this.height
}
```

```js
var Square = extendClas(Rectangle, 
  function(width){
    this.super()(width,width); // = Rectangle.call(this, width, width) 
  }, 
  {
    getArea: function() {
      console.log('size is :', this.super('getArea')());
    }
       // Rectanlge의 getArea 메서드 확장
  })
```

```js
var sq = new Square(10);
sq.getArea()          // size is : 100 // SubClass의 메서드
console.log(sq.super('getArea')())  // 100           // SuperClass의 메서드
```


## 4. 클래스 문법 활용하기(ES6)

### 1) ES5, ES6 클래스 문법 비교

- **ES5 클래스 문법**

```js
var ES5 = function (name){
  this.name = name
}

ES5.staticMethod = function() {
  return this.name + 'staticMethod';
}

ES5.prototype.prototypeMethod = function() {
  return this.name + 'prototypeMethod'
}

var es5Instance = new ES5('es5')
console.log(ES5.staticMethod());   // es5 staticMethod
console.log(es5Instance.prototypeMethod()); // es5 prototypeMethod
```

- **ES6 클래스 문법**

```js
var ES6 = class{
  constructor(name){
    this.name = name;
  }
  static staticMethod () {
    return this.name + 'staticMethod';
  }
  prototypeMethod() {
    return this.name + 'prototypeMethod';
  }
}
```

### 2) ES6의 클래스 상속

```js
var Rectangle = class{  
  constructor(width, height){
    this.width = width;
    this.height = height;
  }
  getArea() {
    return this.width * this * height;
  }
}

var Square = class extends Rectangle {
  constructor(width){
    super(width, width);
  }
  getArea() {
    console.log('Squre size is: ', super.getArea());
  }
}
```
- `extends`
  - `class extends SuperClass{...}` 키워드를 통해 상속 관계를 설정할 수 있다.
- `super`
  - `constructor` 내부에서 사용할 때: 함수처럼 사용하며, `super(width,width)`, `SuperClass`의 `constructor`를 실행한다.
  - `constructor` 외부에서 사용할 때: 객체처럼 사용하며, `super.getArea()`, `SuperClass.prototype`을 바라보며 메서드는 SubClass에서 호출했으므로 this는 `super`가 아니라 원래의 `this` 그대로 따른다.

## 정리
1. **클래스를 흉내내다**
   - 자바스크립트는 프로토타입 기반 언어이기 때문에 클래스 및 상속 개념은 존재하지 않지만, **프로토타입을 기반으로 클래스와 비슷하게 동작하게끔 하는 다양한 기법**들이 도입돼 왔다.
2. **클래스의 정의**
   - **클래스**: 어떤 사물의 공통 속성을 모아 정의한 추상적인 개념
   - **인스턴스**: 클래스의 속성을 지니는 구체적인 사례
   - 상위 클래스의 조건을 충족하면서 더욱 구체적인 조건이 추가된 것이 하위 클래스다.
3. **프로토타입 메서드, 스태틱 메서드**
   - **프로토타입 메서드**: 클래스(생성자 함수)의 prototype 내부에 정의된 메서드이며, 인스턴스가 자신의 것처럼 호출할 수 있다.
   - **스태틱 메서드**: 클래스(생성자 함수)에서 직접 정의한 메서드이며, 인스턴스가 직접 호출할 수 없고 클래스(생성자 함수)에 의해서만 호출할 수 있다.
4. **클래스 상속을 흉내내기 위한 세 가지 방법**
   1) `SubClass.prototype`에 `SuperClass`의 인스턴스를 할당 후 프로퍼티 모두 삭제
   2) 빈 함수(Bridge)를 활용하는 방법
   3) `Object.create` 이용 방법
   - 세 가지 방법 모두 `constructor` 프로퍼티를 원래 생성자 함수를 바라보도록 조정해야한다.