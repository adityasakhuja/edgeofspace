////////////////////////////////////////
// Edge of Space
// Author: Luke Ellison
// Date: 27/4/2015
////////////////////////////////////////

var margin = {top: 20, right: 40, bottom: 40, left: 40}, //Define margins
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear() //Function for scaling x data to chart size
    .range([0, width]);

var y = d3.scale.linear() //Function for scaling y data to chart size
    .range([height, 0]);

var xAxis = d3.svg.axis() //Function for drawing x axis
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis() //Function for drawing y axis
    .scale(y)
    .orient("left");

var chart = d3.select(".chart") // Create the chart space with margins
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var lineGen = d3.svg.line() //function for drawing the line based off built in function
  .x(function(d) {
    return x(d.time);
  })
  .y(function(d) {
    return y(d.temperature);
  });

var bisect = d3.bisector(function(d) { return d.time; }).left; // Create custom bisector

d3.tsv("data/temp.tsv", type, function(error, data) { // Load data from tsv file
  x.domain([0, d3.max(data, function(d) { return d.time; })]); //Set domains of scale functions
  y.domain([0, d3.max(data, function(d) { return d.temperature; })]);

  chart.append("g") // Draw x axis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("text") // Text label for the x axis
      .attr("x", width/2 )
      .attr("y", height + margin.bottom )
      .style("text-anchor", "middle")
      .text("Time / s");

  chart.append("g") // Draw y axis
      .attr("class", "y axis")
      .call(yAxis);

  chart.append("text") // Text label for the y axis
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Temperature / \u00B0Celcius");

  chart.append("path") // Draw line
    .attr("d", lineGen(data))
    .attr("class", "line")

  d3.select(".chart") // Mouse stuff
    .on('mouseover', function() {
      focus.style('display', null);}) //Display focus when mouse is on chart
    .on('mouseout', function() {
      focus.style('display', 'none');}) //Remove is when not
    .on('mousemove', function() { //Update focus when mouse moves
      var mouse = d3.mouse(this),
      x0 = x.invert(mouse[0]),
      index = bisect(data, x0),
      d0 = data[index - 1],
      d1 = data[index];
      if(d1 == null){
        d1 = data[data.size()];
        focus.select("text").attr("x",-9);
      };
      var d = x0 - d0.time > d1.time - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.time) + "," + y(d.temperature) + ")");
      focus.select("text").text("(" + d.time + "s, " + d.temperature + "\u00B0C)");
      focus.select("text").attr("x", function(){
        var str = focus.attr("transform");
        str = str.slice(10);
        var num = parseInt(str);
        if(num > 800){
          return -90;
        }
        else return 10;
      })
  });
  
});

var focus = chart.append("g") // Create the focus circle thingy
  .attr("class", "focus")
  .style("display", "none");

focus.append("circle")
  .attr("r", 4.5);
  
focus.append("text")
  .attr("dy", ".35em"); 

function type(d) { // Function for converting to number from string
  d.time = +d.time;
  d.temperature = +d.temperature;
  return d;
}
