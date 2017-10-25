var width = 960,
    height = 500,
    margin = { top: 20, right: 20, bottom: 30, left: 40 };

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

// reduce our width and height by our margins
// We adjust for the true width and height of the graphics within the svg
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

// Nice pattern for generating domain and range functions,
// which convert the data into screen coordinates
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    yScale = d3.scaleLinear().rangeRound([height, 0]);
    
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

// create a formatter function for our labels at the top of the bars
var formatter = d3.format('.1%');

// create an svg group element and translate its position from the default origin
// This is useful since we can transform this group element as a whole
var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
// Nice little color scheme for show
var blues = d3.schemeBlues[9];
console.log(blues);

//Load data asynchronously
d3.json('./data/letter_frequency.json', renderChart);

// our function that will set up and draw our chart
// takes an argument "dataset" which is an array of objects.
// More specifically, an array of dictionaries or key-value pairs
function renderChart(dataset) {
  console.log(dataset);

  xScale.domain(dataset.map(function(d) {
    return d.letter;
  }));

  yScale.domain([
    0,
    d3.max(dataset, function(d) { return d.frequency; })
  ]);
  
  //Note that we use the chained append/attr pattern quite a lot
  //to create new graphics for use.

  // create the x axis
  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(d3.axisBottom(xScale));

  // create the y axis
  g.append('g')
    .attr('class', 'axis axis--y') // give our x axis group a class of axis axis--y
    .call(
      d3.axisLeft(yScale).ticks(10, '%')
    )
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');

  // create svg rectangle elements for each letter / data point
  g.selectAll('.bar') //Create the "empty" or "future" selection
    .data(dataset) //Iterate through the dataset, which we'll use custom callbacks/lambdas on
    .enter().append('rect') //Joins the data to the elements
    .attr('class', 'bar')
    .attr('x', function(d) { 
      return xScale(d.letter); //Note the use of this d3 generated func to convert domain -> screen range
    })
    .attr('y', function(d) {
      return yScale(d.frequency); //Same here, as above
    })
    .attr('style', function(d) {
      var blueIndex = parseInt(d.frequency*80.0) + 1;
      blueIndex = Math.min(blueIndex, blues.length - 1);
      var color = blues[blueIndex];
      return "fill:" + color + ";";
    })
    .attr('width', xScale.bandwidth())
    .attr('height', function(d) {
      return height - yScale(d.frequency);
    });

  // create labels for the top of each bar
  g.selectAll('.bar-label')
      .data(dataset)
      .enter().append('text')
      .text(function(d) {
        // format labels!!!
        return formatter(d.frequency);
      })
      .attr('class', 'bar-label')
      /*
      .attr('x', function(d) {
        return xScale(d.letter);
      })
      .attr('y', function(d) {
        return yScale(d.frequency) - 2;
      });
      */
      .attr("transform", function(d) {
        //Create a custom translation and rotation, with strings
        //Always translate first and then rotate,
        //since we must shift the coordinate frame,
        //and then rotate around the coordinate frame.
        return "translate(" + (xScale(d.letter) + 5) + "," + (yScale(d.frequency) - 5) + ") rotate(-45)";
      });
      
      //rotate("+nAngle+")

    //Append our new interactive button
    var button = d3.select("body").append("button").text("Sort data");
  
    var barsSorted = false; //Keep track of whether or not the button is enabled i.e. our bars are in order
 
    //Append an event callback/listener to the button
    button.on('click', function() {
      var comparator = barsSorted ? //This is much like a Java comparator, such that ascending returns a comparison "score", which is used to sort
        function(a,b) {return d3.ascending(a.letter, b.letter);} :
        function(a,b) {return b.frequency - a.frequency;} //This is the true comparator, which will return a comparator that sorts by frequency of letter
        
      var xScaleCopy = xScale.domain(dataset.sort(comparator).map(function(d) {
        return d.letter; //Still return the letter once we're
      }))
      .copy(); //Create a new scale while creating a new one 
      
      var t = d3.transition().duration(750), 
        delay = function(d,i) {return i * 50;};
        
      d3.selectAll(".bar").sort(function(a,b) {return xScaleCopy(a.letter) - xScaleCopy(b.letter);}) //Sort all the bars, alter the selection, no UI updates
      
      //Chain a transition below so that the selection has a delay function for each item within
      t.selectAll(".bar").delay(delay).attr("x", function(d) {return xScaleCopy(d.letter);}) //Now update them, the first bar immediately, the second after 50 ms, etc.
      
      d3.selectAll(".bar-label").sort(function(a,b) {return xScaleCopy(a.letter) - xScaleCopy(b.letter);}) //Sort all the labels in the same way
      
      t.selectAll(".bar-label").delay(delay)
      //.attr("x", function(d) {return xScaleCopy(d.letter);}) //Now update them, the first bar immediately, the second after 50 ms, etc.
      //In this function we use a full transform, instead of attr("x", ...)
      .attr("transform", function(d) {
        //Create a custom translation and rotation, with strings
        //Always translate first and then rotate,
        //since we must shift the coordinate frame,
        //and then rotate around the coordinate frame.
        return "translate(" + (xScaleCopy(d.letter) + 5) + "," + (yScale(d.frequency) - 5) + ") rotate(-45)";
      });
      
      t.select('.axis.axis--x').call(xAxis).selectAll("g").delay(delay); //Update the axis in the same way as the bars, to coordinate them
      
      barsSorted = !barsSorted; //Change the other mode, so we can change back later
      
      buttonText = barsSorted ? "Data sorted by freq" : "Data sorted by letter";
      
      button.text(buttonText);
    });
  
    
}
