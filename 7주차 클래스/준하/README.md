# 07 클래스
- 자바스크립트는 `프로토타입 기반 언어`라 `상속`개념이 존재하지 않는다. 
- ES5 이하의 `클래스를 흉내내기 위한 구현방식`을 학습해보자.
- ES6에는 클래스 문법이 추가되어, 간단하게 클래스를 구현할 수 있다.
- `상속` = `프로토타입 체이닝 참조`

## 1. 클래스와 인스턴스
![](https://user-images.githubusercontent.com/76730867/141934645-785909c0-99ed-4a04-aa0f-c9713428c098.jpg)
- **추상화**: 핵심적인 개념을 간추려 내는 것
- **인스턴스**:
  - 클래스 속성을 지니는, 실존하는 개체,
  - 조건에 부합하는 구체적인 예시라고도 한다.
- **클래스**: `공통 요소를 지니는 집단`을 분류하기 위한 개념이다.
  - 인스턴스들로부터 공통점을 발견해서 클래스를 정의하는 현실과 달리, **클래스가 먼저 정의돼야만** 그로부터 공통적인 요소를 지니는 개체들을 생성할 수 있다.
  - 클래스는 사용하기에 따라 추상적인 대상도, 구체적인 개체도 될 수 있다.

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

// (프로토타입)메서드
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

## 3. 클래스 상속


### 1) 클래스가 인스턴스에 영향을 미치는 경우

<img src="https://user-images.githubusercontent.com/76730867/142976023-2472cb58-e47d-4ae0-a76d-57d6f2e89d9f.jpg" width="500px"/>

#### 1-1) Array를 상속할 때의 `.length`

- 이해하기 힘들었던 문장
```
문장1) Array / 내장 클래스를 / 상속하는 /  Grade / 클래스
비유1) 김준하 / 사람을       / 태우는 /  벤츠 / 승용차 
해설1) Array는 JS에서 제공d=하는(=내장된) 클래스(=생성자 함수)이다.
```

```js
var Grade = function () {
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < args.length; i++) {
        this[i] = args[i];
    }
    this.length = args.length;
};
// 유사배열객체 만드는 생성자 함수

Grade.prototype = [];
// Array의 인스턴스에 __proto__를 참조할 수 있다는 점을 활용해,
// Grade에서 Array를 상속하는 코드

var g = new Grade(100, 80);
```
- 프로토타입으로 클래스를 모방하면 다음과 같은 문제가 생긴다.

```js
g.push(90) // Grade {0:100, 1:80, 2:90, length:3}
delete g.length
g.push(70) // Grade {0:70, 1:80, 2:90, length:0}
```

- `g.length`: 인스턴스 g의 프로퍼티
- `g.__proto__.length`: 상속받은 Array 클래스의 프로퍼티
- `g.length`는 삭제되지만, `g.__proto__.length`는 `configurable:false`이다. 
- 따라서 `g.length`는 `g.__proto__.length` 즉, `[].length`를 참조하게 된다.


```js
Grade.prototype = ['a','b','c','d']
var g = new Grade(100,80)

g.push(90)
delete g.length
g.push(70) 
```
- g를 출력하면 아래와 같다.
![](https://user-images.githubusercontent.com/76730867/142977513-edeba7c0-7ff6-487b-a556-d0aa7e4b1937.PNG)
- `g.length`가 없으니 `g.__proto__.length`를 찾고, 값이 4이므로 push 후 5가 된 것이다.

#### 1-2) 사용자 정의 클래스 사이에서의 상속 관계
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
var rect = new Rectangle(3,4)  
var sq = new Square(5)         
```
- (1): Square 생성자 함수 내부에서 Rectangle의 생성자 함수를 함수로써 호출
- (2): 메서드 상속을 위해 Square의 프로토타입 객체에 Rectangle 인스턴스 부여
![](https://user-images.githubusercontent.com/76730867/142981632-ea83077c-0e0d-4261-a6da-726beb86021c.jpg)

### 2) 클래스가 구체적인 데이터를 지니지 않게 하는 방법

#### (1) 인스턴스 생성 후 프로퍼티 제거
```js
delete Square.prototype.width
delete Square.prototype.height
Object.freeze(Square.prototype)
```
```js
var extendClass1 = function(SuperClass, SubClass, subMethods){
    
    // 서브클래스의 프로토타입에 수퍼클래스의 인스턴스 할당
    SubClass.prototype = new SuperClass()

    // 서브클래스의 프로퍼티를 삭제하여, 인스턴스에 개입하지 않게함
    for(var prop in SubClass.prototype){
        if(SubClass.prototype.hasOwnProperty(prop)){
            delete SubClass.prototype[prop]
        }
    }

    if(subMethods){
        for(var method in subMethods){
            SubClass.prototype[method] = subMethods[method]
        }
    }
    Object.freeze(SubClass.prototype)
    return SubClass
}

var Square = extendClass1(Rectangle, fucntion(width){
    Rectangle.call(this,width,width)
})
```

#### (2) 빈 함수를 활용
```js
var Rectangle = function(width, height){
    this.width = width
    this.height = height
}
Rectangle.prototype.getArea = function(){
    return this.width * this.height
}
var Square = function (width) {
    Rectangle.call(this, width, width)
}
var Bridge = fucntion(){}

Bridge.prototype = Rectangle.prototype
Square.prototpye = new Bridge()
Object.freeze(Square.prototype)
```
![](https://user-images.githubusercontent.com/76730867/142983307-39e0b19a-faec-497e-bb3d-070a4960a4d2.png)
```js
var extendClass2 = (function(){
    var Bridge = function(){}
    return function(SuperClass, SubClass, subMethods){
        Bridge.prototype = superClass.prototype
        SubClass.prototype = new Bridge()
        if(subMethods){
            for(var method in subMethods){
                SubClass.prototype[method] = subMethods[method]
            }
        }
        Object.freeze(SubClass.prototype)
        return SubClass
    }
})()
```
#### (3) Object.create 활용
```js
Square.prototype = Object.create(Rectangle.prototype)
Object.freeze(Square.prototype)
```
- 세 가지 방법 모두, SubClass.prototype의 `__proto__`가 SuperClass.prototype을 참조하고, SubClass.prototype에는 불필요한 인스턴스 프로퍼티가 남아있지 않게 하는 방법이다.
  
### 3) constructor 복구하기
- 기본적인 상속엔 성공해도, SubClass 인스턴스의 constructor는 여전히 SuperClass를 가리킨다.
- SubClass 인스턴스와,  Subclass.prototype에는 constructor가 없다.
- 프로토타입 체인상에 가장 먼저 등장하는 SuperClass.prototype의 constructor에서 가리키는 대상, SuperClass가 나오기 마련이다.
- SubClass.prototype.constructor가 원래 SubClass를 바라보도록 하면 된다. 

#### (1) 인스턴스 생성 후 프로피터 제거
#### (2) 빈 함수 활용
#### (3) Object.create 활용

### 4) 상위 클래스에의 접근 수단 제공

### 5) ES6 클래스 사용
```js
```

## 정리
- 자바스크립트는 프로토타입 기반 언어이기 때문에 클래스 및 상속 개념은 존재하지 않지만, 프로토타입을 기반으로 클래스와 비슷하게 동작하게끔 하는 다양한 기법들이 도입돼 왔다.
- 클래스는 어떤 사물의 공통 속성을 모아 정의한 추상적인 개념, 인스턴스는 클래스의 속성을 지니는 구체적인 사례이다. 상위 클래스의 조건을 충족하면서 더욱 구체적인 조건이 추가된 것이 하위 클래스다.
- 클래스의 prototype 내부에 정의된 메서드를 프로토타입 메서드라고 하며, 인스턴스가 자신의 것처럼 호출할 수 있다. 클래스(생성자 함수)에서 직접 정의한 메서드를 스태틱 메서드라고 하며, 인스턴스가 직접 호출할 수 없고 클래스(생성자 함수)에 의해서만 호출할 수 있다.

<br>

- 클래스 상속을 흉내내기 위한 세 가지 방법
  1) SubClass.prototype에 SuperClass의 인스턴스를 할당 후 프로퍼티 모두 삭제
  2) 빈 함수(Bridge)를 활용하는 방법
  3) Object.create 이용 방법
    => constructor 프로퍼티를 원래 생성자 함수를 바라보도록 조정할 것
- 추가로 상위 클래스에 접근할 수 있는 수단 super를 구현


