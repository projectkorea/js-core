# 04 콜백 함수

## 1. 콜백함수란?
**콜백 함수**: 다른 코드의 인자로 넘겨주는 함수
- 콜백 함수를 넘겨받은 코드는 콜백 함수를 필요에 따라 적절한 시점에 실행한다.
- 어떤 함수 X를 호출하면서 `특정 조건` 일 때 함수 Y를 실행한다.
- 요청을 받은 함수 X는 `특정 조건`이 만족하는지 **스스로 판단**하고 Y를 호출한다.
- 콜백 함수는 함수에게 인자로 넘겨줌으로써, 그 제어권도 함께 위임하는 함수다.

## 2. 제어권
### 2-1 호출 시점
**sctInterval의 구조**
```js
var intervalID = scope.setInterval(func, delay[, param1, param2,...])
```
- scope에는 Window 객체 또는 Worker의 인스턴스가 들어올 수 있다.
- 두 객체 모두 setInterval 메서드를 제공한다.
- 매개변수: func, delay는 필수, 다른 param들은 함수 실행시 매개변수로 전달할 인자이다.
- setInterval을 고유한 ID값으로 받는다.
- 그 이유는 실행 중간에 종료할 수 있게 하기 위해서이다. **clearInterval**

```js
var count = 0
var cbFunc = function() {
    console.log(count)
    if(++count > 4) clearInterval(timer)
}
var timer = setInterval(cbFunc,300)
```
- cbFunc(): 호출 주체: 사용자, 제어권: 사용자
- setInterval(cbFunc, 300): 호출 주체: setInterval, 제어권: setInterval
- setInterval이 첫번째 인자로서 cbFunc 함수를 받으며, `콜백 함수 호출 시점에 관한 제어권`을 넘겨 받는다.

### 2-2 인자
**map 메서드 구조**
```js
Array.prototype.map(callback[, thisArg])
callback: function(currentValue, index, array)
```
- thisArg를 생략할 경우 일반적인 함수와 마찬가지로 전역객체가 바인딩 된다.
- map 메서드는 대상이 되는 배열의 모든 요소들을 콜백 함수로 반복 호출하여, 실행결과들을 모아 배열로 리턴한다.

```js
var newArr = [10, 20, 30].map(function(currentValue, index){
    console.log(currentValue, index)
    return currentValue + 5
})
console.log(newArr)
```
- map에 해당하는 인자의 순서가 바뀌면 전혀다른 값이 나온다.
- 따라서 map 메서드에 정의된 규칙에 따라 함수를 작성해야한다.
- map 메서드에 정의된 규칙에는 콜백 함수의 인자로 넘어올 값들 및 순서도 포함되어 있기 때문이다.
→ 콜백 함수의 제어권을 넘겨받은 코드(map)는 콜백 함수를 호출할 때 인자에 어떤 값들을 어떤 순서로 넘길 것인지 제어권을 가진다.


### 2-3 this
- 콜백 함수도 함수이기 때문에 this가 전역객체를 참조한다.
- 하지만 제어권을 넘겨받을 코드에서 별도로 this가 될 대상을 지정할 경우 그 대상을 참조한다.

**예시) this를 별도로 지정한 map메서드를 만든다면**
```js
Array.prototype.map = function(callback, thisArg) {
    var mappedArr = []
    for(var i =0; i<this.length; i++ ){
        var mappedValue = callback.call(thisArg || window, this[i], i, this)
        // callback에 들어갈 인자에 call메서드가 붙어 처음엔 바인딩 객체가 오고 그다음은 callback 매개변수가 들어감
        // thisArg || window: this 바인딩 대상 객체
        // this[i]: currentCalue
        // i: 인덱스
        // this: array

        mappedArr[i] = mappedValue
    }
    return mappedArr
}
```











