const obj = {
    title: '자바스크립트',
    subObj: {
        title: 'Javascript',
        show(func) {
            console.log('1', this);
            return func.apply(this);
        },
    },
    show() {
        return this.subObj.show(() => {
            return this.title;
        });
    },
};

console.log(obj.show() === '자바스크립트' ? 'O' : 'X');
