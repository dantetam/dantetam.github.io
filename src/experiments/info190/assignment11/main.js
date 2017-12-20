var width = 960, height = 600;

var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

// An SVG "filter"

var defs = svg.append("defs") //Global objects, last like time

defs.append('filter').attr("id", "blur").append("feGaussianBlur").attr("stdDeviation", 5); //A Gaussian blur filter for clear drop shadows

//A hashmap for drug data, which we will visualize
var overdoses = d3.map();

//Path generators, which take path data from the GeoJSON files

var path = d3.geoPath();
var color = d3.scaleOrdinal(); //A color scale that maps rates -> colors

d3.queue() //Async load multiple files before a callback
  .defer(d3.json, "data/us-10m.topojson")
  .defer(d3.csv, "data/2015_sorted.csv", function(d) {
    if (d["FIPS"].length < 5) { //Left pad the FIPS code to a 5 letter string
      d["FIPS"] = '0' + d.FIPS; //The unique county ID
    }
    overdoses.set(d["FIPS"], d["Rate"]);
  }) //Parse data while it loads
  .await(main);
  
function main(error, us) { //Load in county data + health data
  if (error) {throw error;}
  
  var categories = overdoses.values()
    .reduce(function(acc, cur) {
      if (acc.indexOf(cur) === -1) {
        acc.push(cur); //Push the unique values, do not push copies again
      }
    }, [])
    .sort(function(a,b) {
      //Custom comparators
      //sort a range x-y by its x
      var first = +a.split("-")[0];
      var second = +b.split("-")[0];
      return first - second; //Returns a > b if x-y, z-w, iff x > z
    });
      
  var idx = categories.indexOf(">30");  
  categories.push(categories.splice(idx, 1)[0]); //Take out the range [idx, idx + 1) and push it to the end, its correct position; splice returns an array
  var numCategories = categories.length;
  
  console.log(categories);
  
  color.domain(categories).range(categories.map(function(d,i) { //Map each bin of stats to a single color within the YlGnBu color range
    return d3.interpolateYlGnBu(i / (numCategories - 1));
  }));
  
  //Start drawing the map on the SVG
  
  svg.append("g").attr("class", "legend").attr("transform", "translate(875, 225)");
  
  //Create a legend using the d3 legend library
  var legend = d3.legendColor().title("Drug Overdose Casualties per 100,000 People, 2015").titleWidth(75).scale(color);
  
  svg.select(".legend").call(legend);
  
  //Link to path TopoJSON data, from the geospatial data file
  defs.append("path").attr("id", "nation").attr("d", path(topojson.feature(us, us.objects.nation).features));
  
  //Create the drop shadow
  svg.append("use").attr("xlink:href", "#nation").attr("fill-opacity", 0.4).attr("filter", "url(#blur)");
  
  svg.append("use").attr("xlink:href", "#nation").attr("fill", "#FFFFFF");

  //Store all the paths of counties into a single group
  svg.append("g").attr("class", "counties").selectAll("path").data(topojson.feature(us, us.objects.counties)) //Take the counties layer out of the TopoJSN data  
    .enter().append("path").attr("fill", function(d) {
      //Join the geospatial JSOn and the data CSV
      d["Rate"] = overdoses.get(d.id); //FIPS code
      return color(d["Rate"]);
    })
    .attr("d", path)
    .on('mouseover', function(d) {
      var c = d3.select(this) //d3 mouse over event for this county path polygon
        .attr("stroke", "red")
        .attr("stroke-width", 2);
      //Move this element to the bottom of the stack i.e. render all strokes on top
      this.parentNode.append()
    })
    .on('mouseout', function() {
      var c = d3.select(this) //d3 mouse out/leave event for this county path polygon
        .attr("stroke-width", 0);
    })
    .append("title")
    .text(function(d) {return d.rate;}); //Quick in-browser tooltip
    
  //Draw state borders, comparators look for borders that involve more than one state  
  svg.append("path").datum(topojson.mesh(us, us.objects.states, function(a,b) {return a !== b;})) 
    .attr("class", "states") //Above, bind the data of the borders that match the filter i.e. are between multiple states
    .attr("d", path)
    .attr("fill", "none")
    .attr('stroke', "#ffffff")
    .attr('stroke-width', 2)
    .attr('d', path);
}








//A comment to hold the line.