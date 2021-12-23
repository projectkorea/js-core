# 06 프로토타입

자바스크립트는 프로토타입(`prototype`)기반 언어이다.
- 클래스 기반 언어: `상속`을 사용.
- 프로토타입 기반 언어: `어떤 객체를 원형`으로 삼고 `이를 복제함`으로써 상속과 비슷한 효과를 얻는다.

## 01 프로토타입의 개념 이해 
### constructor, prototype, instance

`var instance = new Constructor()`

![](https://images.velog.io/images/annie1004619/post/c1f0a9d1-5c88-4331-9b7e-a1d318a1d132/image.png)

- 어떤 `생성자 함수(Constructor)`를 `new` 연산자와 함께 호출하면
- Constructor에서 정의된 내용을 바탕으로 `새로운 인스턴스`가 생성된다.
- 이때 instance에는 `__proto__`라는 `프로퍼티`가 자동으로 부여되는데
- 이 프로퍼티는 `Consructor의 prototype`이라는 `프로퍼티를 참조`한다. 

`prototype`이라는 프로퍼티와 `__proto__`라는 프로퍼티가 새로 등장했는데, 이 둘의 관계가 프로토타입 개념의 핵심이다. 
prototype은 객체이다. 이를 참조하는 __proto__ 역시 당연히 객체이다.
prototype 객체 내부에는 인스턴스가 사용할 메서드를 저장한다. 
그러면 인스턴스에서도 숨겨진 프로퍼티인 __proto__를 통해 이 메서드들에 접근할 수 있게된다. 

**참고**
- ES5 명세에는 `__proto__`가 아니라 `[[prototype]]`이라는 명칭으로 정의되있다. 
- `__proto__`라는 프로퍼티는 사실 브라우저들이 `[[prototype]]`을 구현한 대상에 지나지 않았다. 
- 명세에는 `instance.__proto__`와 같은 방식으로 직접 접근하는 것은 허용하지 않고 오직 `Object.getPrototypeOf(instance)/Refelect.getPrototypeOf(instance)`를 통해서만 접근할 수 있도록 정의했다.
- 결국 ES6에서는 이를 브라우저에서 동작하는 레거시 코드에 대한 호환성 유지 차원에서 정식으로 인정하게 되었다. 
- 다만 어디까지나 브라우저에서의 호화성을 고려한 지원일 뿐 권장되는 방식은 아니며, 브라우저가 아닌 다른 환경에서는 얼마든지 이 방식이 지원되지 않을 가능성이 열려있다. 
- 실무에서는 가급적 `__proto__`를 사용하지 말고 대신 `Object.getPrototypeOf()/Object.create()`등을 이용하자!

```js
var Person = function (name) {
    this._name = name
}

Person.prototype.getName = function () {
    return this._name
}
```
`Person`이라는 생성자 함수의 `prototype`에 `getName`이라는 메서드를 지정했다.
이제 `Person`의 인스턴스는 `__proto__` 프로퍼티를 통해 `getName`을 호출할 수 있다. 
instance의 `__proto__`가 Constructor의 prototype 프로퍼티를 참조하므로 결국 둘은 같은객체를 바라보기 때문이다. 

```js
var suzi = new Person('Suzi')
suzi.__proto__.getName() //undefined
```
`Person.prototype === suzi.__proto__ //true`

- 메서드 호출 결과로 `undefined`가 나왔다. 
- 값이 나오지 않은 것보다는 '에러가 발생하지 않았다'는 점이 우선이다. 
- 어떤 변수를 실행해 `undefined`가 나왔다는 것은 이 변수가 `호출할 수 있는 함수`에 해당한다는 것을 의미한다. 
- 즉 함수가 아닌 다른 데이터 타입이었다면 `TypeError`가 발생했을 것 이다.
- 따라서 `getName`은 함수이다.

- 문제는 바로 `this`에 바인딩된 대상이 잘못 지정된 것이다!
- `thomas.__proto__.getName()`에서 `getName` 함수 내부에서의 `this`는 `thomas`가 아니라 `thomas.__proto__`라는 객체가 된다. 
- 이 객체 내부에는 `name` 프로퍼티가 없으므로 Error대신 undefined를 반환된다. 

만약 `__proto__`객체에 `name` 프로퍼티가 있다면?

```js
var suzi = new Person('Suzi')
suzi.__proto__._name = 'SUZI__proto__'
suzi.__proto__.getName() //SUZI__proto__
```

- `SUZI__proto__`가 잘 출력된다.
- 관건은 `this`!!
- `__proto__` 없이 인스턴스에서 곧바로 메서드를 쓰면 된다!

```js
var suzi = new Person('Suzi',28)
suzi.getName() //Suzi
var iu = new Person('Jieun', 28)
iu.getName() //Jieun
```
- `__proto__`를 빼면 `this`는 인스턴스가 되는게 맞지만, 이대로 메서드가 호출되고 심지어 원하는 값이 나오는 것은 좀 이상하다.
- 그 이유는 바로 `__proto__`가 **생략 가능**한 프로퍼티이기 때문이다. 

```js
suzi.__proto__.getNmae
suzi.getName
```
- `__proto__`를 생략하면 `this`는 `suzi`를 가리키고, `suzi.__proto__`에 있는 메서드인 `getName`을 실행한다.

![](https://images.velog.io/images/annie1004619/post/e753ed89-e98c-48d6-96a6-37245d034c5f/image.png)

`new` 연산자로 `Constructor`를 호출하면 `instance`가 만들어지는데, 
이 `instance`의 생략 가능한 프로퍼티인 `__proto__`는 `Constructor`의 `prototype`을 참조한다!

- new 연산자와 함께 함수를 호출할 경우, 그로부터 생성된 인스턴스에는 숨겨진 프로퍼티인 `__proto__`가 자동으로 생성되며, 이 프로퍼티는 생성자 함수의 `prototype` 프로퍼티를 참조한다. 
- `__proto__` 프로퍼티는 생략 가능하도록 구현돼 있기 때문에 생성자 함수의 `prototype`에 어떤 메서드나 프로퍼티가 있다면 인스턴스에서도 마치 자신의 것처럼 해당 메서드나 프로퍼티에 접근할 수 있다. 

```js
var Constructor = function(name){
    this.name = name
}
Constructor.prototype.method1 = function() {}
Constructor.prototype.property1 = 'Constructor Prototype Property'

var instance = new Constructor('Instance')
console.dir(Constructor)
console.dir(instance)
```

**대표적인 내장 생성자 함수인 `Array` 살펴보자**
```js
var arr = [1,2]
console.dir(arr)
console.dir(Array)
```
![](https://images.velog.io/images/annie1004619/post/cffc6ee5-4d39-4f82-b94e-6bc01cdef58b/image.png)

![](https://images.velog.io/images/annie1004619/post/9ca77c10-4612-40e3-b7f8-32037a662d20/image.png)

**arr 변수 출력**
- Array(2): Array라는 생성자 함수를 원형으로 삼아 생성됐고, length가 2임을 알 수 있다. 
- `__proto__`에는 push, pop, shift, unshift, slice, splice 등 배열에 사용하는 메서드들이 들어있다. 

**생성자 함수 Array**
- 첫줄에는 함수라는 의미의 f가 표시돼있다.
- 둘째 줄부터는 함수의 기본적인 프로퍼티들인 arguments, caller, length, name 등이 있다.
- Array 함수의 정적 메서드인 from, isArray, of 등도 있다. 
- `prototype`을 열어보니 `__proto__`와 완전히 동일한 내용으로 구성돼 있다.

Array의 prototype 프로퍼티 내부에 있지 않은 from, isArray 등의 메서드들은 인스턴스가 직접 호출할 수 없다. 이들은 Array 생성자 함수에서 직접 접근해야하 실행이 가능하다. 

```js
var arr = [1,2]
arr.forEach(function(){}) //(O)
Array.isArray(arr)// (O) true
arr.isArray() //(X) TypeError: arr.isArray is not a function
```

### constructor 프로퍼티
- 생성자 함수의 프로퍼티 `prototype` 객체 내부에는 `constructor`라는 프로퍼티가 있다. 
- 인스턴스의 `__proto__` 객체 내부에도 마찬가지다. 
- 이 프로퍼티는 단어 그대로 원래의 생성자 함수(자기 자신)를 참조한다. 
- 자신을 참조하는 프로퍼티가 왜 필요할까? 인스턴스와의 관계와 있어서 필요한 정보이다. 인스턴스로부터 그 원형이 무엇인지를 알 수 있는 수단이 된다. 

```js
var arr = [1,2]
Array.prototype.construcotr === Array //true
arr.__proto__.constructor === Array //true
arr.constructor === Array //true

var arr2 = new arr.constructor(3,4)
console.log(arr2) //[3,4]
```
- `construcotr`는 읽기 전용 속성이 부여된 예외적인 경우(기본형 리터럴 변수 - number, string, boolean)를 제외하고는 값을 바꿀 수 있다. 

**constructor 변경**
```js
var NewConstrucotr = function(){
    console.log('this is new constuctor!')
}
var dataTypes = [
    1, //Number & false
    'test', //String & false
    true, //Boolean & false
    {}, //NewConstructor & false
    [], //NewConstructor & false
    function () {}, //NewConstructor & false
    /test/, //NewConstructor & false
    new Number(), //NewConstructor & false
    new String(), //NewConstructor & false
    new Boolean, //NewConstructor & false
    new Object(), //NewConstructor & false
    new Array(), //NewConstructor & false
    new Function(), //NewConstructor & false
    new RegExp(), //NewConstructor & false
    new Date(), //NewConstructor & false
    new Error() //NewConstructor & false
]

dataTypes.forEach(function(d){
    d.constructor = NewConstrucor
    console.log(d.construcotr.name, '&', d instanceof NewConstructor)
})
```
- 모든 데이터가 `d instanceof NewConstructor` 명령에 대해 false를 반환한다. 
- consructor를 변경하더라도 참조하는 대상이 변경될 뿐 이미 만들어진 인스턴스의 원형이 바뀐다거나 데이터 타입이 변하는 것은 아니다. 
- 어떤 인스턴스의 생성자 정보를 알아내기 위해 `constructor` 프로퍼티에 의존하는 게 항상 안전하지는 않다.

- 비록 어떤 인스턴스로부터 생성자 정보를 알아내는 유일한 수단인 `constructor`가 항상 안전하지는 않지만 오히려 그렇기 때문에 클래스 상속을 흉내 내는 등이 가능해진 측면도 있다. 

**다음은 모두 동일한 대상을 가리킨다**
```js
[Constructor]
[instance].__proto__.constructor
[instance].constructor
Object.getPrototypeOf([instance]).constructor
[Constructor].prototype.constructor
```

**다음은 모두 동일한 객체 (prototype)에 접근할 수 있다.**
```js
[Constructor].prototype
[instance].__proto__
[instance]
Object.getPrototypeOf([instance])
```

## 프로토타입 체인
### 메서드 오버라이드
`prototpye` 객체를 참조하는 `__proto__`를 생략하면 인스턴스는 `prototype`에 정의된 프로퍼티나 메서드를 마치 자신의 것처럼 사용할 수 있다.

만약 인스턴스가 동일한 이름의 프로퍼티 또는 메서드를 가지고 있는 상황은??

```js
var Person = function(name){
    this.name = name
}
Person.prototype.getName = function() {
    return this.name
}
var iu = new Person('지금')
iu.getName = function(){
    return '바로' + this.name
}
console.log(iu.getName()) //바로 지금 
```
- `iu.__proto__.getName`이 아닌 `iu 객체`에 있는 `getName` 메서드가 호출됐다.
- 이 현상을 `메서드 오버라이드`라고 한다.

**메서드 오버라이딩이 이뤄져 있는 상황에서 `prototype`에 있는 메서드에 접근하려면 어떻게 하면 될까?**

`console.log(iu.__proto__.getName()) //undefined`

- this가 prototype 객체 (iu.__proto__)를 가리키는데 prototype 상에는 name프로퍼티가 없기 때문이다. 
- this를 인스턴스 바라보도록 `call이나 apply`로 해결 가능할 것 같다. 

`console.log(iu.__proto__.getName.call(iu)) //지금`

### 프로토타입 체인
프로토타입 체인을 설명하기 전에 객체의 내부 구조를 살펴보자!
`console.dir({a:1})`

![](https://images.velog.io/images/annie1004619/post/95941720-0f1b-4eb1-96fc-bc67ce800b62/image.png)
- 첫줄을 통해 `Object`의 인스턴스임을 알 수 있고, 프로퍼티 a의 값 1이 보인다.
- `__proto__` 내부에는 hasOwnProperty, isPrototypeOf, toLocaleString, toString, valueOf 등의 메서드가 보인다. 
- constructor는 생성자 함수인 Object를 가리킨다. 

![](https://images.velog.io/images/annie1004619/post/c1b995ff-5d81-491f-add6-d2d707e26254/image.png)
- 배열 리터럴의` __proto__ `에는 pop push 등의 메서드 및 `constructor`가 있다.
- 추가로 이 `__proto__`안에는 또다시 `__proto__`가 등장한다. 
- 이는 위의 객체의 `__proto__`와 동일한 내용으로 이뤄져있다. 
- 왜냐하면 `prototype` 객체가 `객체`이기 때문이다. 
- 기본적으로 모든 객체의 `__proto__`에는 `Object.prototype`이 연결된다. 

(배열의 내부 도식 사진)

- `__proto__`는 생략이 가능하므로 배열이 `Array.prototype` 내부의 메서드를 마치 자신의 것처럼 실행할 수 있었다.
- 마찬가지로 `Object.prototype` 내부의 메서드도 자신의 것처럼 실행할 수 있다. 
- 생략가능한 `__proto__`를 한번 더 따라가면 `Object.prototype`을 참조할 수 있기 때문이다.

```js
var arr = [1,2]
arr(.__proto__).push(3)
arr(.__proto__)(.__proto__).hasOwnProperty(2) //true
```
어떤 데이ㅓ의 `__proto__` 프로퍼티 내부에서 다시 `__proto__` 프로퍼티가 연쇄적으로 이어진 것을 **프로포타입 체인**이라고 하고, 이 체인을 따라가며 검색하는 것을 **프로토타입 체이닝**이라고 한다. 

어떤 메서드를 호출하면 자바스크립트 엔진은 데이터 자신의 프로퍼티들을 검색해서 원하는 메서드가 있으면 그 메서드를 실행하고, 없으면 __proto__를 검색해서 있으면 그 메서드를 실행하고 없으면 다시 __proto__를 검색해서 실행하는 식으로 진행한다. 

```js
var arr = [1,2]
Array.prototype.toString.call(arr) //1,2
Object.prototype.toString.call(arr) //[object Array]
arr.toString()

arr.soStrig = function(){
    return this.join('_')
}
arr.toString() //1_2
```
- arr 변수는 배열이므로 `arr._proto__`는 `Array.prototype`을 참조하고 `Array.prototype`은 객체이므로 `Array.prototype.__proto__`는 `Object.prototyp`을 참조할 것이다. 

