function outer(value) {
  return function inner() {
    console.log(value);
  };
}
const inner = outer('hi World');
inner();
