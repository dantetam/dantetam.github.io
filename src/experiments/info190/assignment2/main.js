/*
var app = {};
app.calculate = {};
app.calculate.add = function(a, b) {
  return a + b;
};


var app = {
  calculate: {
    add: function(a, b) {
      return a + b;
    }
  }
};
*/

var myApp = {
  results: [],
  meta: {
    name: 'Calculator',
    author: 'Dante Tam',
    version: '1.0'
  },
  shove: function(item) {
    this.results.push(item);
  },
  add: function(a, b) {
    var result = a + b;
    this.shove(result);
    return result;
  },
  multiply: function(a, b) {
    var result = a * b;
    this.shove(result);
    return result;
  },
  subtract: function(a, b) {
    var result = a - b;
    this.shove(result);
    return result;
  },
  divide: function(a, b) {
    var result = a / b;
    this.shove(result);
    return result;
  },
  
  square: function(x) {
    var result = x * x;
    this.shove(result);
    return result;
  },
  pow: function(a,b) { //Naively compute a^b
    var result = 1;
    for (var i = 0; i < b; i++) {
      result *= a;
    }
    this.shove(result);
    return result;
  },  
  factorial: function(a) { //Naively compute a!
    var result = 1;
    for (var i = 1; i < a + 1; i++) {
      result *= i;
    }
    this.shove(result);
    return result;
  },
  abs: function(a) {
    if (a < 0) {
      return -a;
    }
    return a;
  },
  
  sin: function(x) {
    var result = 0;
    for (var i = 0; i < 10; i++) {
      result += this.pow(-1, i) * this.pow(x, 2*i + 1) / this.factorial(2*i + 1);
    }
    this.shove(result);
    return result;
  },
  cos: function(x) {
    var result = 0;
    for (var i = 0; i < 10; i++) {
      result += this.pow(-1, i) * this.pow(x, 2*i) / this.factorial(2*i);
    }
    this.shove(result);
    return result;
  },
  tan: function(x) {
    var sx = this.sin(x);
    var cx = this.cos(x);
    var result = 0;
    if (this.abs(cx) < 0.000001) {
      result = sx / 0.000001;
    }    
    else {
      result = sx / cx;
    }
    this.shove(result);
    return result;
  },
  
  ans: function() { //Get the most recent answer
    if (this.results.length == 0) {
      return 0;
    }
    return this.results[this.results.length - 1];
  }

};
