//SVG setup as usual

var totalWidth = 1000;
var totalHeight = 500;

var margin = {top: 20, right: 30, bottom: 30, left: 120};
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
  .attr("width", totalWidth)
  .attr("height", totalHeight);
  
//The main parent group
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataPath = "./data/data.csv" 
  
//Scales for the data to be projected onto the screen
//Note how the y axis is upside-down
var xScale = d3.scaleLinear().range([0, width]); //Will be cylinders for now
var yScale = d3.scaleLinear().range([height, 0]); //Will be horsepower for now
//var colorScale = d3.scaleOrdinal(); //Will be year, unique years
 
//Generate some axes, as before
var yAxis = d3.axisLeft().scale(yScale);
var xAxis = d3.axisBottom().tickFormat(function(d) {return d;}).scale(xScale); 
 
var h1 = d3.select("body").append("h1"); 
 
//Asynchronously load the data and start a callback when finished

//We convert this into a function so we can update whenever

var mainGroup = g.append("g")
  .attr("class", "main-group");

function loadData(varNameX, varNameY, varNameColor) {
  h1.text("Testing scatterplot: x = " + varNameX + ", y = " + varNameY + ", color = " + varNameColor);
  d3.csv(dataPath, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(data);
    
    var uniqueYears = data.reduce(function(acc, cur) {
      if (acc.indexOf(cur[varNameColor]) == -1) {
        acc.push(cur[varNameColor]);
      }
      return acc;
    }, []);
    
    console.log(uniqueYears);
    
    //Possibly sort uniqueYears in some way?
    
    var colorScale = function(t) {
      //The two lines work only when interpolating numbered data
      //var lastYear = +uniqueYears[uniqueYears.length - 1];
      //var percent = (+t - +uniqueYears[0]) / (lastYear - +uniqueYears[0]);
      
      //Below we extend it to look at categorical data
      var percent = uniqueYears.indexOf(t) / uniqueYears.length;
      console.log(t);
      return d3.interpolateBlues(percent);
    }; 
    
    //colorScale.range(d3.schemeCategory20).domain(uniqueYears);
      
    xScale.domain(d3.extent(data, function(d) { //Return the min/max value of a dataset, accessed
      return +d[varNameX]; //Get all the dates of every data object
    }));  
      
    yScale.domain(d3.extent(data, function(d) {
      return +d[varNameY];
    }));
    
    //Remove the old axes, if they exist
    g.select(".y-axis").remove();
    g.select(".x-axis").remove();
    
    //Create new group elements for the axes and append them to our graph
    g.append("g")
      .attr("class", "y-axis")
      .call(yAxis);
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
      
    var t = g.transition().duration(750); //Create a new transition object
    
    mainGroup.datum(data); //Pass in a singular data value, i.e. the site's data values
   
    //The general update pattern, order does not matter since it's all
    //processed in one frame

    var circles = mainGroup.selectAll("circle") //Nested selection/append
      .data(function(d) {return d;});
    
    //Remove things in the exit
    circles.exit()
      .transition(t)
      .attr('r', 0)
      .style('fill', "rgba(255, 255, 255, 0)")
      .remove();
    
    
    //Each of these circles is already offset
    //Update circles that already exist
    circles
      .transition(t)
      .attr("cy", function(d) {
        return yScale(+d[varNameY]);
      })
      .attr("cx", function(d) {
        return xScale(+d[varNameX]);
      })
      .attr("r", function(d) {
        return 3;
      })
      .attr("fill", function(d) {
        //return colorScale(d["year"]);
        return colorScale(d[varNameColor]);
      });
      
    //Add/append new circles when there are more than exist
    circles.enter().append("circle")
      .transition(t)
      .attr("cy", function(d) {
        return yScale(+d[varNameY]);
      })
      .attr("cx", function(d) {
        return xScale(+d[varNameX]);
      })
      .attr("r", function(d) {
        return 3;
      })
      .attr("fill", function(d) {
        //return colorScale(d["year"]);
        return colorScale(d[varNameColor]);
      });
  });
}

loadData("cylinders", "horsepower", "year");

var dataTypes = ["acceleration", "cylinders", "displacement", "horsepower", "mpg", "weight"];
var allVarCombinations = [];

for (var i = 0; i < dataTypes.length; i++) {
  for (var j = 0; j < dataTypes.length; j++) {
    if (i === j) continue;
    allVarCombinations.push([dataTypes[i], dataTypes[j]]);
  }
}

allVarCombinations.forEach(function(item, i) {
  d3.timeout(function() {
    loadData(item[0], item[1], "year")
  }, 3000 * (i + 1));
});

  
  
  
  
 



// A comment to hold the line.