# 06 프로토타입

-   JavaScript는 프로토타입 기반 언어다.
-   클래스 기반 언어는 `상속`을 사용하지만, 프로토타입 기반 언어는 **어떤 객체를 `원형`으로 삼고 이를 복제**함으로써 `상속`과 비슷한 효과를 낸다.

## 1. Constructor, prototype, instance

```js
var instance = new Constructor();
```

1. 생성자 함수(Consturctor)를 new 연산자와 함께 호출한다.
    - 생성자는 기본적으로 함수다.
    - 함수 호출 시 new를 붙이면 생성자 함수가 된다.
2. Constructor에서 정의된 내용을 바탕으로 새로운 `instance`가 생성된다.
3. `instance`에는 `__proto__`라는 프로퍼티가 자동으로 생성된다.
4. `__proto__`는 `Costructor.prototype`를 참조한다.

![image](https://user-images.githubusercontent.com/76730867/141883614-4a43f4d3-86c6-47f8-beb2-c8b9539093ef.png)

- `prototype` 객체에 인스턴스가 사용할 메서드를 저장한다.
- 인스턴스는 숨겨진 프로퍼티 `__proto__`를 통해 prototype에 정의된 메서드들에 접근할 수  있다.

---
**참고**
- 실무에서는 `__proto__`라고 직접 쓰지 않는다.
- `Object.getPrototypeof()`, `Object.create()`등을 이용해 접근하는 것을 권장한다.
- ES5.1 명세에서는 `__proto__`가 아니라 `[[prototype]]`로 정의돼 있다.
---

#### 예시) Person.prototype

```js
var Person = function (name) {
    this._name = name; // this는 객체의 메서드로 호출될 때 인스턴스를 가리킨다.
};
Person.prototype.getName = function () {
    return this._name; // 이 this는 누구의 객체로 호출될까?
};
```

Person의 인스턴스들은 `__proto__` 프로퍼티를 통해 getName을 호출할 수 있다.

```js
var suzi = new Person('suzi');
suzi.__proto__.getName(); // undefined
```
**메서드 호출 결과**: undefined ?!?!
- undefined가 나왔다는 것은 **호출** 할 수 있지만, **반환하는 값**이 잘못됐다는 뜻이다.
- 이유는 함수를 `메서드`로서 호출할 때는 **메서드 명 바로 앞 객체가 this**가 된다.
- 따라서 getName 함수 내부에서의 **this**는
    -  `suzi`가 아니라,
    -  `suzi.__proto__` 객체이다.
- name 식별자가 정의되지 않았기 때문에 undefined를 반환한다.
    <br>

#### 수정 후 코드

```js
var suzi = new Person('suzi');
suzi.getName(); // suzi
```

-   `__proto__`를 생략하면 **this는 instance**가 되어 원하는 값을 출력할 수 있다.
- ⭐  `__proto__`를 **생략해도 prototype에 있는 프로퍼티에 접근**할 수 있기 때문이다.
-   `__proto__`의 생략 유무는,  **this가 서로 다른 객체를 바라본다**는 차이가 있다.

```js
1) suzi.__proto__.getName
2) suzi.getName
```

- 1,2 모두 `__proto__`에 있는 getName 메소드에 접근할 수 있다.
- 따라서 `생성자함수.prototype`에 어떤 메서드나 프로퍼티가 있다면, 인스턴스에서도 동일하게 접근**할 수 있다.

![image](https://user-images.githubusercontent.com/76730867/141886399-180dd52c-9332-41a7-969f-b2a132c2c33c.png)

---
**참고) Constructor와 Instance 내부 살펴보기**

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

-   색상 차이는 `{enumerable:false}` 속성이 부여된 프로퍼티에 따라 다르다.
-   짙은 색은 enumerable, **열거 가능**한 프로퍼티를 의미한다.
-   for in 등으로 **객체의 프로퍼티 전체에 접근 가능여부**를 구분했다.
---

**예시) Constructor의 다른 프로퍼티들**

```js
var arr = [1, 2];

arr.forEach(function () {}); // O
arr.isArray(); // X: TypeError: arr.isArray is not a function
Array.isArray(arr); // O
```

<p align='center'><img src="https://user-images.githubusercontent.com/76730867/141904952-63f936fc-5098-4481-a20a-2d8211f58282.png" width="400" height="300"/></center></p>

-   Array.prototype 내부에 있지 않은 `from()`과 같은 메서드들은,
    1. 인스턴스가 직접 호출할 수 없다
    2. 생성자 함수(Array)에서 직접 접근해야 실행이 가능하다.

---

## 2. Constructor 프로퍼티
### 1) Constructor.prototype.constructor

```js
var arr = [1, 2];

Array.prototype.constructor === Array;
arr.__proto__.consturctor === Array;
arr.constructor === Array;
```
-   prototype 객체 내부에 constructor 프로퍼티가 있다.
-   인스턴스로부터 그 원형이 무엇인지를 알 수 있다.

```js
var arr2 = new arr.constructor(3, 4); //== var arr2 = [3,4]
```
- instance`(.__proto__)`.constructor()

### 2) constructor는 변경할 수 있다.

-   constructor는 `읽기 전용 속성`이 부여된 예외적인 경우를 제외하고는 값을 바꿀 수 있다.
-   `읽기 전용 속성`: 기본형 리터럴 변수: number, string, boolean

```js
var newConstructor = function () {
    console.log('this is new constructor!');
};
var dataTypes = [
    1, // Number false
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
    // item instanceof NewConstructor:
    // item이 newConstructor의 인터스턴스냐?
});
```

-   constructor를 변경하더라도 참조하는 대상이 변경될 뿐, 이미 만들어진 인스턴스의 원형이 바뀐다거나 데이터 타입이 변하는 것은 아니다.
-   어떤 인스턴스의 생성자 정보를 알아내기 위해 constructor 프로퍼티만 의존하는 것은 항상 안전하지는 않음을 알 수 있다.
-   하지만 이는 클래스 상속을 흉내 내는 기능도 가능하게 한다.

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
[Constructor][instance].__proto__.constructor[instance].constructor;
Object.getPrototypeof([instance]).constructor[Constructor].prototype
    .constructor;
```

```js
// 아래는 모두 동일한 prototype에 접근한다.
[Constructor].prototype[instance].__proto__[instance];
Object.getPrototypeof([instance]);
```

## 3. 프로토타입 체인

## 1) 메서드 오버라이드

-   인스턴스가 동일한 이름의 프로퍼티를 가지고 있다면?

```js
var Person = function (name) {
    this.name = name;
};
Person.prototype.getName = function () {
    return this.name;
};
var junha = new Person('준하');
junha.getName = function (name) {
    return `SPECIAL HERO! + ${this.name}`;
};
console.log(junha.getName()); // SPECIAL HERO! + 김준하
```

-   원본을 제거하고 다른 대상으로 교체한 것이 아니라,
-   원본이 그대로 있는 상태에서 다른 대상을 그 위에 얹는 오버라이딩이 발생한 것이다.
-   JS엔진은 getName 메서드를 찾기 위해 가장 가까운 대상인 자신의 프로퍼티를 검색하고, 없으면 그 다음 가까운 대상인 **proto**를 검색하는 순서로 진행되기 때문이다.

**Q. 그렇다면 메서드 오버라이딩 상태에서 prototype의 메서드에 접근하려면 어떻게 할까?**

```js
console.log(junha.__proto__.getName()); // undefined
```

-   getName메소드의 this가 prototype객체를 가리키기 때문에 name프로퍼티가 없기 때문에 undefined가 나온다.

**A-1. Person prototype에 name 프로퍼티 생성**

```js
Person.prototype.name = '김준하';
console.log(junha.__proto__.getName()); // 김준하
```

-   prototype에 직접 name을 선정하는 것으로 급조했지만, this가 이미 생성한 인스턴스를 바라보도록 바꿔주면 더 좋을 것 같다.

**A-2. Persone prototype 메서드로 출력**

```js
console.log(junha.__proto__.getName.call(junha)); // 준하
```

### 2) 프로토타입 체인

```js
var arr = [1, 2];
```

-   다음 배열의 내부 구조를 살펴보면 아래와 같다.
    ![](https://user-images.githubusercontent.com/76730867/142203678-929b18ac-25ce-4fa3-9b3a-9789f7738af4.PNG)
-   Array의 `__proto__`안에 또 `__proto__`가 있다
-   그 이유는 `__proto__`또한 **객체**이기 때문에, 생성될 때 `__proto__`가 자동으로 부여된다.
-   따라서 모든 객체의 `__proto__`에는 `Object.prototype`이 연결되고, `__proto__`객체도 예외가 아닌 것이다.
-   이와 같은 프로토타입 체이닝을 그림으로 표현하면 아래와 같다.
    ![](https://user-images.githubusercontent.com/76730867/142205344-0dfb7cdc-c8d6-48b3-87b5-bccd1af2b1c4.PNG)
    ![](https://user-images.githubusercontent.com/76730867/142761294-93a13e34-a76a-4cfb-b061-8ec3561ad75f.png)


**예시) 배열에서 배열 메서드, 객체 메서드 실행**

```js
var arr =[1,2]
arr(.__proto__).push(3) // push: 배열 메서드
arr(.__proto__)(.__proto__).hasOwnProperty(2) // hasOwnProperty: 객체 메서드
```

-   데이터의 `__proto__` 내부의 `__proto__`가 연쇄적으로 이어진 것을 **프로토타입 체인**이라고 한다.
-   이 체인을 따라가며 검색하는 것을 **프로토타입 체이닝**이라고 한다.
-   어떤 메서드를 실행하면, 찾을 때 까지 `__proto__`를 거듭해 검색해서 실행한다.

**예시) 프로토타입 체이닝 & 메서드 오버라이드**

```js
var arr = [1, 2];
Array.prototype.toString.call(arr); // 1,2
Object.prototype.toString.call(arr); // [Object Array]
arr.toString(); // 1,2

arr.toString = function () {
    return this.join('_');
};

arr.toString(); // 1_2
```

---

### 참고
![](https://user-images.githubusercontent.com/76730867/142761370-ea7150e8-3bce-4923-b851-2daf050e4ab8.jpg)

- instance.constructor.constructor => Function 생성자 함수


---

### 3) 객체 전용 메서드의 예외사항
- 어떤 생성자 함수든 prototype은 객체이기 때문에 Object.prototype은 언제나 프로토타입 체인의 최상단이 된다.
- 객체에서만 사용할 메서드를 Object.prototype 내부에 정의한다면, 다른 데이터 타입도 해당 메서드를 사용할 수 있게 된다.
- 따라서 객체만을 대상으로 동작하는 객체 전용 메서드들은, Object에 스태틱 메서드로 부여해야 한다. 
- 반대로 같은 이유에서 Object.prototype에는 어떤 데이터에서도 활용할 수 있는 범용적인 메서드가 있다. toString, hasOwnPRoperty, valueoF, isPrototypeOf 등은 모든 변수가 마치 자신의 메서드인 것처럼 호출할 수 있다.

```js
var _proto = Object.create(null);
_proto.getValue = function(key) {
    return this[key]
}

var obj = Object.create(_proto)
obj.a = 1

console.log(obj) //{a, [__proto__,[getValue]}
```
- Object.create(null)은 `__proto__`가 없는 객체를 생성합니다.
- 이 방식으로 만든 객체는 일반적인 데이터에서 반드시 존재하던 내장(built-in) 메서드 및 프로퍼티들이 제거됨으로써 기본 기능에 제약이 생ㄱ긴 대신, 객체 자체의 무게가 가벼워짐으로써 성능상 이점이 생긴다. 


### 4) 다중 프로토타입 체인
- 자바스크립트의 기본 내장 데이터 타입들은 모두 프로토타입 체인이 1단계(객체)이거나, 2단계(그 외 나머지)로 끝난다.
- 사용자가 새롭게 만든다면 그 이상도 가능하다.
- 대각선 `__proto__`를 연결해나가면 무한대로 체인 관계를 이어나가, 다른 언어의 클래스와 비슷하게 동작하는 구조를 만들 수 있다. 
```js
var Grade = function() {
    var args = Array.prototype.slice.call(arguments)
    for (var i = 0; i<args.length; i++){
        this[i] = args[i]
    }
    this.length = args.length
    // return this;  
    // 여기서 리턴되는 this는 this.0, this.1, ..., this.length 가 있는 유사배열객체임
}
var g = new Grade(100, 80)
```
```js
Grade.prototype = [] 
// Grade.prototype을 배열의 인스턴스로 대입한다. 
// 배열의 인스턴스는 배열 생성자함수의 prototpye을 바로 접근할 수 있기 때문에 체이닝이 가능하다.

console.log(g) // Grade(2) [100, 80]
console.log(g.pop) // 80
g.push(90)
console.log(g) // Grade(2) [100, 90]
```
- 별개로 분리돼 있던 데이터가 연결되어 하나의 프로토타입 체인 형태를 띠게 된다.
- 인스터인 g에서 직접 배열의 메서드를 사용할 수 있게 된다.
- g 인스턴스 입장에서는 프로토타입 체인에 따라 g 객체 자신이 지니는 멤버, Grade의 prototype에 있는 멤버, Array.prototype에 있는 멤버, Object.prototype에 있는 멤버에 접근할 수 있게 된다.
![](https://user-images.githubusercontent.com/76730867/142762946-55ecbc47-723a-46d6-a21d-8cc86a1fca3a.jpg)
![](https://user-images.githubusercontent.com/76730867/142762967-d1c43b92-5f57-456a-87d8-aa3e91eee203.png)
## 정리

-   어떤 생성자 함수를 new 연산자와 함께 호출하면 Consturctor에서 정의된 내용을 바탕으로 새로운 인스턴스가 생성된다.
-   이 인스턴스에는 **proto**라는, Constructor의 prototype 프로퍼티를 참조하는 프로퍼티가 자동으로 부여된다.
-   **proto**는 생략 가능한 속성이기 때문에, 인스턴스는 Constructor.prototype의 메서드를 마치 자신의 메서드인 것처럼 호출할 수 있다.
    <br>
-   Constructor.prototype에는 constructor라는 프로퍼티가 있다.
-   이는 생성자 함수 자신을 가리킨다.
-   이 프로퍼티는 인스턴스가 자신의 생성자 함수가 무엇인지를 알고자 할 때 필요한 수단이다.
    <br>
-   직각삼각형의 대각선 방향, 즉 **proto** 방향을 계속 찾아가면 최종적으로 Object.prototype에 당도한다.
-   이런식으로 **proto**안에 다시 **proto**를 찾아가는 과정을 프로토타입 체이닝이라고 한다.
-   이를 통해 각 프로토타입 메서드를 자신의 것처럼 호출할 수 있다.
-   이때 접근 방식은 자신으로부터 가장 가까운 대상부터 점차 먼 대상으로 나아가며, 원하는 값을 찾으면 검색을 중단한다.
-   Object.prototype에는 모든 데이터 타입에서 사용할 수 있는 범용적인 메서드만이 존재하며, 객체 전용 메서드는 여느 데이터 타입과 달리 Object 생성자 함수에 스태틱하게 담겨있다.
