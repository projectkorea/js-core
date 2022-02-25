obj1 = {
  method() {
    console.log(this); // obj1
    function innerMethod() {
      console.log(this); // winodw
    }
    innerMethod();
  },
};

obj2 = {
  method() {
    console.log(this); // obj2
    const innerMethod = () => {
      console.log(this); // obj2
    };
    innerMethod();
  },
};

obj3 = {
  method: () => {
    console.log(this); // window
    const innerMethod = () => {
      console.log(this); // window
    };
    innerMethod();
  },
};

obj1.method();
obj2.method();
obj3.method();
