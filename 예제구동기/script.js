const a = document.querySelector('.a');
const b = document.querySelector('.b');
const c = document.querySelector('.c');

a.addEventListener('click', function () {
  console.clear();
  const footer = document.querySelector('footer');
  footer.removeChild(footer.childNodes[1]);
  const script_element = document.createElement('script');
  script_element.setAttribute('src', 'a.js');
  document.querySelector('footer').appendChild(script_element);
});

b.addEventListener('click', function () {
  console.clear();
  const footer = document.querySelector('footer');
  footer.removeChild(footer.childNodes[1]);

  const script_element = document.createElement('script');
  script_element.setAttribute('src', 'b.js');
  document.querySelector('footer').appendChild(script_element);
});

//script추가 후 실행이 안됌. import로 사용하는 것을 생각해봐야겠다
