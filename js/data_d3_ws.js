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

var lineGen = d3.svg.line().interpolate("linear") //function for drawing the line based off built in function
  .x(function(d) {
    return x(d[xValue.toUpperCase()]);
  })
  .y(function(d) {
    return y(d[yValue.toUpperCase()]);
  });

var line = chart.append("path")
  .attr("class","line")
  .attr("d", "0"); //Create line element

var bisect = d3.bisector(function(d) { return d[xValue.toUpperCase()]; }).right; // Create custom bisector

var focus = chart.append("g") // Create the focus circle thingy
  .attr("class", "focus")
  .style("display", null);

focus.append("circle")
  .attr("r", 4.5);
  
focus.append("text")
  .attr("dy", ".35em"); 

var xOption = null; //Variables for holfing user's axis options
var yOption = null;
var xValue = null;
var yValue = null;
var mouse = null; //Variable for holding mouse data, updated on mouse movement
var units = { // Data of corrisponding units for axis
  "time" : "s",
  "temperature" : "\u00B0C",
  "altitude" : "m",
  "pressure" : "atm",
  "light" : "cd"
}

var ws = new WebSocket("ws://balloon.mybluemix.net/balloondata");
var data = [];

ws.onopen = changeAxis; //Where it all begins

ws.onmessage = function (msg){
  var d = JSON.parse(msg.data);
  console.log(data);
  if(d.constructor === Array)
  d.sort(function(a, b){ // Sort by time
    return parseFloat(a[xValue.toUpperCase()])-parseFloat(b[xValue.toUpperCase()]);
  });

  index = bisect(data, d);
  data.splice(index,0,d);
  console.log(data);
  drawData();
};

ws.onclose = function(){ 
  // attempt to reconnect
  alert("Connection is closed, attemping reconnect");
  ws = new WebSocket("ws://balloon.mybluemix.net/balloondata");
  data = [];
};

function getData(){
  var query = "SELECT " + xValue + "," + yValue + " FROM balloondata" ;
  console.log(query);
  ws.send(query);
};

function drawData(){
    x.domain([0, d3.max(data, function(d) { return d[xValue.toUpperCase()]; })]); //Set domains of scale functions
    y.domain([0, d3.max(data, function(d) { return d[yValue.toUpperCase()]; })]);

    if (chart.selectAll(".x.axis")[0].length < 1 ){ // if no x axis exists, create one
      chart.append("g")
        .attr("class","x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    } else { // otherwise, update the axis
      chart.selectAll(".x.axis").transition().duration(1500).call(xAxis);
    }

    if (chart.selectAll(".y.axis")[0].length < 1 ){ // if no y axis exists, create one
      chart.append("g")
        .attr("class","y axis")
        .call(yAxis);  
    } else { // otherwise, update the axis
      chart.selectAll(".y.axis").transition().duration(1500).call(yAxis);
    }

    line.transition().duration(1500) // transition from previous paths to new paths
      .attr("d",lineGen(data));

    d3.select(".chart") // Mouse stuff
      .on('mouseover', function() {
        focus.style('display', null);}) //Display focus when mouse is on chart
      .on('mouseout', function() {
        focus.style('display', 'none');}) //Remove is when not
      .on('mousemove', function() { //When mouse moves
        mouse = d3.mouse(this); //Update mouse position
        adjustFocus(data, mouse); //Adjust focus
      });
    adjustFocus(data, mouse);
};

function changeAxis(){
  chart.selectAll(".axis.text").remove();

  var xop = document.getElementById("xOption");
  var yop = document.getElementById("yOption");
  xOption = xop.options[xop.selectedIndex].text; //Get the axis options from the html
  yOption = yop.options[yop.selectedIndex].text;
  xValue = xop.options[xop.selectedIndex].value;
  yValue = yop.options[yop.selectedIndex].value;

  chart.append("text") // Text label for the x axis
      .attr("class", "axis text")
      .attr("x", width/2 )
      .attr("y", height + margin.bottom -10 )
      .style("text-anchor", "middle")
      .text(xOption + " / " + units[xValue]);

  chart.append("text") // Text label for the y axis
      .attr("class", "axis text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yOption + " / " + units[yValue]);

  data = [];
  getData();
};

function adjustFocus(data, mouse){ //Adjusts focus based on mouse position but sticks to data points (only if x axis is sorted)
    var x0 = x.invert(mouse[0]-margin.left),
    index = bisect(data, x0),
    d0 = data[index - 1],
    d1 = data[index];
    var d = x0 - d0[xValue.toUpperCase()] > d1[xValue.toUpperCase()] - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d[xValue.toUpperCase()]) + "," + y(d[yValue.toUpperCase()]) + ")");
    focus.select("text").text("(" + dp1(d[xValue.toUpperCase()]) + units[xValue] + ", " + dp1(d[yValue.toUpperCase()]) + units[yValue] + ")");
    focus.select("text").attr("x", function(){
      var str = focus.attr("transform");
      str = str.slice(10);
      var num = parseInt(str);
      if(num > 800){
        return -80;
      }
      else return 10;
    })
};