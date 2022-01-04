function RockBand(members) {
  this.members = members;
  this.perform = function () {
    setTimeout(function () {
      this.members.forEach(function (member) {
        member.perform();
      }, 1000);
    });
  };
}

var theOral = new RockBand([
  {
    name: 'tutu',
    perform: function () {
      console.log('a e i o u');
    },
  },
]);

theOral.perform();

// 1) this.members => setTimeout은 호출 주체가 window이기 때문에 this는 window를 바라보기 때문에 this를 뺀다.
// 2) setTimeout(function(){}.bind(this)) => 바인드할 시점의 this의 호출 주체는 인스턴스이기 때문에 가능하다.
