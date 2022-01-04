자바스크립트는 프로토타입 기반 언어라서 `상속`의 개념이 존재하지 않는다.
니즈에 따라 ES6에는 `클래스` 문법이 추가되었다. 

## 01 클래스와 인스턴스의 개념 이해
- 사용자가 직접 여러 가지 클래스를 정의해야 하며, 클래스를 바탕으로 인스턴스를 만들 때 비로소 어떤 개체가 클래스의 속성을 지니게 된다. 
- 또한 한 인스턴스는 하나의 클래스만을 바탕으로 만들어진다.
- 어떤 인스턴스가 다양한 클래스에 속할 수 있지만 이 클래스들은 모두 인스턴스 입장에서는 '직계존속'이다. 
- 다중상속을 지원하는 언어이든 그렇지 않은 언어이든 결국 인스턴스를 생성할 때 호출할 수 있는 클래스는 오직 하나뿐일 수 밖에 없다. 

## 02 자바스크립트 클래스
6장에서 자바스크립트는 프로토타입 기반 언어이므로 클래스의 개념이 존재하지 않는다고 했다. 
그렇지만 프로토타입을 일반적인 의미에서의 클래스 관점에서 접근해보면 비슷하게 해석할 수 있는 요소가 없지 않다. 

예) 생성자 함수 `Array`를 `new` 연산자와 함께 호출하면 인스턴스가 생성된다. 
이때 `Array`를 일종의 클래스라고 하면, `Array`의 `prototype` 객체 내부 요소들이 인스턴스에 `상속`된다고 볼 수 있다. 
- 엄밀히는 상속이 아닌 프로토타입 체이닝에 의한 참조지만 결과적으로는 동일하게 동작하므로 이렇게 이해해도 괜찮다. 
- 한편 `Array` 내부 프로퍼티들 중 `prototype` 프로퍼티를 제외한 나머지는 인스턴스에 상속되지 않는다. 

인스턴스에 상속되는지(인스턴스가 참조하는지) 여부에 따라 
- `스태틱 멤버(static member)`와 
- `인스턴스 멤버(instance member)`로 나뉜다. 

다른 클래스 기반 언어와 달리 자바스크립트에서는 인스턴스에서도 직접 메서드를 정의할 수 있기 때문에 `인스턴스 메서드`라는 명칭은 프로토타입에 정의한 메서드를 지칭하는 것인지 인스턴스에 정의한 메서드를 지칭하는 것인지에 대해 도리어 혼란을 야기한다.
따라서 이 명칭 대신에 자바스크립트의 특징을 살려 `프로토타입 메서드`라고 부르는 편이 더 좋을 것 이다. 


**스태틱 메서드, 프로토타입 메서드**
```js
//생성자
var Rectangle = function (width, height) {
    this.width = width
    this.height = height
}
//(ㅍ로토타입)메서드
Rectangle.protyotype.getArea = function() {
    return this.width * this.height
}
//스태틱 메서드
Rectangle.isRectangle = function(instance) {
    return instance instanceof Rectangle &&
        instance.width > 0 && instance.height > 0
}

var rect1 = new Rectangle(3,4)
console.log(rect1.getArea()) //12
console.log(rect1.isRectangle(rect1)) //Error
console.log(Rectangle.isRectangle(rect1)) //true
```

- 프로토타입 객체에 할당한 메서드는 인스턴스가 마치 자신의 것처럼 호출할 수 있다. 
- `getArea`는 실제로는 `rect1.__proto__.getArea`에 접근하는데 `__proto__`를 생략했으므로 `this`가 `rect1`인 채로 실행될 테니까 rect1.width * rect1.height의 계산 값이 반환될 것이다. 
- 이처럼 인스턴스에서 직접 호출할 수 있는 메서드가 바로 **프로토타입 메서드**이다. 

- rect1에서 `isRectangle`이라는 메서드에 접근하고자 한다.
- 우선 rect1에 해당 메서드가 있는지 검색했는데 없고, `rect1.__proto__`에도 없으며, `rect1.__proto__.__proto__(=Object.prototype)`에도 없다.
- 결국 `undefined`를 실행하라는 명령이므로 함수가 아니어서 실행할 수 없다는 의미의 에러가 발생한다.
- 이렇게 인스턴스에서 직접 접근할 수 없는 메서드를 **스태틱 메서드**라고 한다. 
- 스태틱 메서드는 `생성자 함수`를 this로 해야한 호출할 수 있다. 


## 03 클래스 상속
### 기본 구현
`클래스 상속`은 객체지향에서 가장 중요한 요소 중 하나이다.

프로토타입 체인을 활용해 클래스 상속을 구현하고 최대한 전통적인 객체지향 언어에서의 클래스와 비슷한 형태로까지 발전시켜 보는 것을 목표로 하겠다.

```js
var Grade = function () {
    var args = Array.prototype.slice.call(arguments)
    for (var i = 0; i < args.length; i++){
        this[i] = args[i]
    }
    this.length = args.length
}
Grade.prototype = []
var g = new Grade(100, 80)
```

ES5까지의 자바스크립트에는 클래스가 없다.
ES6에서 클래스가 도입됐지만 역시나 `prototype`을 기반으로 한 것이다.

위의 예제에서 문제는
1. length 프로퍼티가 configurable(삭제 가능)하다는 점
2. Grade.prototype에 빈 배열을 참조시켰다는 점

```js
...
g.push(90)
console.log(g) //Grade{0:100, 1:80, 2:90, length:3}

delete g.length
g.push(70)
console.log(g) //Grade{0:70, 1:80, 2:90, length:1}
```
lenght를 삭제하고 다시 push를 했더니 push 한 값이 인덱스 0에 들어갔고 length가 1이 되었다.
내장객체인 배열 인스턴스의 length 프로퍼티는 configurable 속성이 false라서 삭제가 불가능하지만, Grade 클래스의 인스턴스는 배열 메서드를 상속하지만 기본적으로는 일반 객체의 성질을 그대로 지니므로 삭제가 가능해서 문제가 된다. 
- push 했을 대 0번째 인덱스에 70이 들어가고 length가 1이 된 이유?
- g.__proto__, 즉 Grade.prototype이 빈 배열을 가리키고 있기 때문이다.
- push 명령에 의해 자바스크립트 엔진이 g.length를 읽고자 하는데 g.length가 없으니까 프로토타입 체이닝을 타고 g.__proto__.length를 읽어온 것이다. 

```js
var Rectangle = function (width, height) {
    this.width = width
    this.height = height
}
Rectangle.prototype.getArea = function () {
    return this.width * this.height
}
var rect = new Rectangle(3,4)
console.log(rect.getArea()) //12

var Square = function (width) {
    this.width = width
}
Square.prototype.getArea = function () {
    return this.width * this.width
}
var sq = new Square(5)
console.log(sq.getArea()) //25
```
**Square 클래스 변형**
```js
var Square = function (width) {
    this.width = width
    this.height = width
}
Square.prototype.getArea = function () {
    return this.width * this.height
}
```

**Rectangle을 상속하는 Square 클래스**
```js
var Square = function (width) {
    Rectangle.call(this,width,width)
}
Square.prototype = new Rectangle()
```
위의 예제도 클래스에 있는 값이 인스턴스에 영향을 줄 수 있는 구조라는 동일한 문제를 가지고 있다. 
나아가 `constructor`가 여전히 Rectangle을 바라보고 있다는 문제도 있다. 
sq.constructor로 접근하면 프로토타입 체이닝을 따라 sq.__proto__.__proto__, 즉 Rectangle.prototype에서 찾게 되며, 이는 `Rectangle`을 가리키고 있다.
```js
var rect2 = new sq.constructor(2,3)
console.log(rect2) //Rectangle {width:2, height:3}
```
이처럼 하위 클래스로 삼을 생성자 함수의 prototype에 상위 클래스의 인스턴스를 부여하는 것만으로도 기본적인 메서드 상속은 가능하지만 다양한 문제가 발생할 여지가 있어 구조적으로 안전성이 떨어진다. 

### 클래스가 구체적인 데이터를 지니지 않게 하는 방법
**첫번째 방법**
클래스가 구체적인 데이터를 지니지 않게 하는 방법 중 가장 쉬운 방법은
일단 만들고 나서 프로퍼티들을 일일이 지우고 더는 새로운 프로퍼티를 추가할 수 없게 하는 것이다. 
```js
delete Square.prototype.width
delete Square.prototype.height
Object.freeze(Square.prototype)
```
프로퍼티가 많다면 반복 작업이 될테니 반복을 없애고 좀 더 범용적으로 수행하는 함수를 만들면
```js
var extendClass1 = function (superClass, subClass, subMethod) {
    subClass.prototype = new superClass()
    for (var prop in subClass.prototype){
        if (subClass.prototype.hasOwnProperty(prop)) {
            delete subClass.prototype[prop]
        }
    }
    if(subMethods) {
        for (var method in subMethods) {
            subClass.prototype[method] = subMethods[method]
        }
    }
    Object.freeze(subClass.prototype)
    return subClass
}

var Square = extendClass1(Rectangle, function(width){
    Rectangle.call(this, width, width)
})
```
extendClass1 함수는 superClass와 subClass, subClass에 추가할 메서드들이 정의된 객체를 받아서 subClass의 prototype 내용을 정리하고 freeze하는 내용으로 구성돼있다. 
subClass의 프로토타입을 정리하는 내용이 다소 복잡해졌지만 범용성 측면에서 괜찮은 방법이다. 


**두번째 방법**
SubClass prototype에 직접 SuperClass의 인스턴스를 할당하는 대신 아무런 프로퍼티를 생성하지 않는 빈 생성자 함수(Bridge)를 하나 더 만들어서 그 prototype이 SuperClass의 prototype을 바라보게 한다음, SubClass의 prototype에는 Bridge의 인스턴스를 할당하게 하는 것이다. 

```js
var Rectangle = function(width, height) {
    this.width = width
    this.height = height
}
Rectangle.prototype.getArea = function() {
    return this.width * this.height
}

var Square = function (width) {
    Rectangle.call(this, width, width)
}

var Bridge = function () {}
Brdige.protoype = Rectangle.prototype
Square.prototype = new Bridge()
Object.freeze(Square.prototype)
```
- Bridge라는 빈 함수를 만들고, Bridge.prototype이 Rectangle.prototype을 참조하게 한 다음, Square.prototype에 new Bride()로 할당하면, Rectangle 자리에 Bridge가 대체하게 될 것이다.
- 인스턴스를 제외한 프로퍼티 체인 경로상에는 더는 구체적인 데이터가 남아있지 않데 된다. 

**범용성 고려한 다면**
```js
var extendClass2 = (function () {
    var Bridge = function () {}
    return function(SuperClass,SubClass,subMethods){
        Bridge.prototype = SuperClass.prototype
        SubClass.prototype = new Bridge()
        if (subMethods) {
            for (var method in subMethods) {
                SubClass.prototype[method] = subMethods[method]
            }
        }
        Object.freeze(SubClass.prototype)
        return SubClass
    }
})()
```
- 즉시 실행함수 내부에서 Bridge를 선언해서 이를 클로저로 활용함으로써 메모리에 불필요한 함수 선언을 줄였다.
- subMethods에는 SubClass의 prototype에 담길 메서드들을 객체로 전달하게끔 했다. 

**세번째 방법**
**ES5에서 도입된 Object.create를 이용한 방법**
SubClass의 prototype의 __proto__가 SuperClass의 prototype을 바라보되, SuperClass의 인스턴스가 되지는 않으므로 앞서 소개한 두 방법보다 간단하면서 안전하다. 
```js
...
Square.prototype  Object.create(Rectangle.prototype)
Object.freeze(Square.prototype)
...
```
클래스 상속 및 추상화의 기본적인 접근 방법은 위 세 가지 아이디어를 크게 벗어나지 않는다. 
결구구 SubClass.prototype의 __proto__가 SuperClass.prototype를 참조하고, SubClass.prototype에는 불필요한 인스턴스 프로퍼티가 남아있지 않으면 된다. 

### constructor 복구하기
위의 세가지 방법 모두 기본적인 상속에는 성공했지만 SubClass 인스턴스의 constructor는 여전히 SuperClass를 가리키는 상태이다. 
엄밀히는 SubClass 인스턴스에는 constructor가 없고, SubClas.prototype에도 없는 상태이다. 
프로토타입 체인상에 가장 먼저 등장하는 SuperClass.prototype의 constructor에서 가리키는 대상, 즉 SuperClass가 출력될 뿐이다.

따라서 위 코드들의 SubClass.prototype.constructor가 원래의 SubClass를 바라보도록 하면 된다. 

**인스턴스 생성 후 프로퍼티 제거**
```js
var extendClass1 = function(SuperClass, SubClass, subMethods) {
    SubClass.prototype = new SuperClass()
    for (var prop in SubClass.prototype) {
        if (SubClass.prototype.hasOwnProperty(prop)) {
            delete SubClass.prototype[prop]
        }
    }
    SubClass.prototype.constructor = SubClass
    if(subMethods) {
        for (var method in subMethods) {
            SubClass.prototype[method] = subMethods[method]
        }
    }
    Object.freeze(SubClass.prototype)
    return SubClass
}
```
### 상위 클래스에의 접근 수단 제공
때로 하위 클래스의 메서드에서 상위 클래스의 메서드 실행 결과를 바탕으로 추가적인 작업을 수행하고 싶을 때가 있다. 
이럴 때 매번 "SuperClass.prototype.method.apply(this, arguments)"로 해결하는 것은 번거롭다. 

하위 클래스에서 상위 클래스의 프로토타입 메서드에 접근하기 위한 별도의 수단이 있다면 편리할 것 같다. 
- 이런 별도의 수단 다른 객체지향 언어들의 클래스 문법 중 하나인 `super`를 흉내내보자

```js
var extendClass = function(SuperClass, SubClass, subMethods) {
    SubClass.prototype = Object.create(SuperClass.prototype)
    SubClass.prototype.constructor = SubClass
    //추가된 부분
    SubClass.prototype.super = function (propName) {
        var self = this
        if(!propName) return function() {
            SuperClass.apply(self, arguments)
        }
        var prop = SuperClass.prototype[propName]
        if (typeof prop !== "function") return prop
        return function () {
            return prop.apply(self, arguments)
        }
    }
}
    ...
    //super 사용
    var Square = extendClass (
        Rectangle,
        function(width){
            this.super()(width,width)
        },{
            getArea: function(){
                console.log('size is',this.super('getArea')())
            }
        })
var sq = new Square(10)
sq.getArea() //size is 100
console.log(sq.super('getArea')()) //100
```

## 04 ES6의 클래스 및 클래스 상속
ES6에서는 본격적으로 클래스 문법이 도입됐다. 

**ES5와 ES6의 클래스 문법 비교**
```js
var ES5 = function(name){
    this.name = name
}
ES5.staticMethod = function () {
    return this.name + 'staticMethod'
}
ES5.prototype.method = function () {
    return this.name +' method'
}
var es5Instance = new ES5('es5')
console.log(ES5.staticMethod()) //es5 staticMethod
console.log(es5Instance.method()) //es5 Method

var ES6 = class{
    constructor (name){
        this.name = name
    }
    static staticMethod () {
        return this.name +' staticMethod'
    }
    method () {
        return this.name +' method'
    }
}

var es6Instance = new ES6('es6')
console.log(ES6.staticMethod()) //es6 staticMethod
console.log(es6Instance.method()) //es6 method
```

**ES6의 클래스 상속**
```js
var Rectangle = class {
    constructor (width, height){
        this.width = width
        this.height = height
    }
    getArea () {
        return this.width * this.height
    }
}
var Square = class extends Rectangle {
    construcotr (width) {
        super(width, width)
    }
    getArea() {
        console.log('size is', super.getArea())
    }
}
```