function mean(list, comparator=function(data) {return data;}) {
  var listNew = [];
  list.each(function(temp) {listNew.push(comparator(temp));});

  if (listNew.length === 0) return 0;
  var sum = 0;
  for (var i = 0; i < listNew.length; i++) {
    sum += listNew[i];
  }
  return sum / listNew.length;
}

function sd(list, comparator=function(data) {return data;}) {
  var listNew = [];
  list.each(function(temp) {listNew.push(comparator(temp));});

  var sum = 0;
  var avg = mean(listNew);
  for (var i = 0; i < listNew.length; i++) {
    var dx = listNew[i] - avg;
    sum += dx*dx;
  }

  return sqrt(sum / listNew.length);
}

//Account for finite population correction? Sigma or t*?
function confidenceInterval(list, alpha, comparator=function(data) {return data;}) {

}

function computeCorrelationR(list1, list2, comparator1=function(data) {return data;}, comparator2=function(data) {return data;}) {
  if (list1.length !== list2.length) {
    return undefined; //return?
  }
  var list1New = [];
  list1.each(function(temp) {list1New.push(comparator1(temp));});
  var list2New = [];
  list2.each(function(temp) {list2New.push(comparator2(temp));});

  var xbar = mean(list1New), ybar = mean(list2New);
  var sdx = sd(list1New), sdy = sd(list2New);
  var sum = 0;
  for (var i = 0; i < list1.length; i++) {
    var zx = (list1New[i] - xbar) / sdx;
    var zy = (list2New[i] - ybar) / sdy;
    sum += zx*zy;
  }

  return sum / (list1.length - 1);
}

//Simple linear regression.
//list1 = x, list2 = y
function computeRegressionLine(list1, list2, comparator1=function(data) {return data;}, comparator2=function(data) {return data;}) {
  var correlation = computeCorrelationR(list1, list2, comparator1, comparator2);
  var sy = sd(list2, comparator2);
  var sx = sd(list1, comparator1);
  var ybar = mean(list2, comparator2);
  var xbar = mean(list1, comparator1);

  var b1 = correlation * sy / sx;
  var b0 = ybar - b1 * xbar;
  return [b0, b1];
}

TODO: //Look at CS188 old probability projects for inspiration here
//Joining factors together?

function probability(data, eventFunction=function(data) {return true;}, givenFunction=function(data) {return true;}) {
  var queryResult = getEventsGiven(data, eventFunction, givenFunction);
  return queryResult[1].length / queryResult[0].length;
}

function getEventsGiven(data, eventFunction=function(data) {return true;}, givenFunction=function(data) {return true;}) {
  var givenCount = [], eventCount = [];
  for (var i = 0; i < data.length; i++) {
    if (givenFunction(data[i])) {
      givenCount.push(data[i]);
      if (eventFunction(data[i])) {
        eventCount.push(data[i]);
      }
    }
  }
  return [givenCount, eventCount];
}















//A comment to hold the line.
