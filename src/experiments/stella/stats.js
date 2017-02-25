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

function probability(data, eventFunction=function(data) {return true;}, givenFunction=function(data) {return true;}) {
  var givenCount = 0, eventCount = 0;
  for (var i = 0; i < data.length; i++) {
    if (givenFunction(data[i])) {
      givenCount++;
      if (eventFunction(data[i])) {
        eventCount++;
      }
    }
  }
  if (givenCount === 0) {
    return 0;
  }
  return eventCount / givenCount;
}
















//A comment to hold the line.
