////////////////////////////////////////
// Edge of Space
// Author: Luke Ellison
// Date: 27/4/2015
////////////////////////////////////////

var margin = {top: 20, right: 40, bottom: 40, left: 55}, //Define margins
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

var accessorx = function(d){
  if(xValue == "time" || xValue == "pitime") return timeify(d[xValue.toUpperCase()]);
  else return d[xValue.toUpperCase()]
}
var accessorx_scaled = function(d){
  if(xValue == "time" || xValue == "pitime") return x(timeify(d[xValue.toUpperCase()]));
  else return x(d[xValue.toUpperCase()])
}
var accessory = function(d){
  if(yValue == "time" || yValue == "pitime") return timeify(d[yValue.toUpperCase()]);
  else return d[yValue.toUpperCase()];
}
var accessory_scaled = function(d){
  if(yValue == "time" || yValue == "pitime") return y(timeify(d[yValue.toUpperCase()]));
  else return y(d[yValue.toUpperCase()]);
}

var lineGen = d3.svg.line().interpolate("linear") //function for drawing the line based off built in function
  .x(accessorx_scaled)
  .y(accessory_scaled);

var line = chart.append("path")
  .attr("class","line")
  .attr("d", "0"); //Create line element

var bisect = d3.bisector(accessorx).left; // Create custom bisector

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
  "time" : "bst",
  "pitime" : "bst",
  "temperature" : "\u00B0C",
  "altitude" : "m",
  "pressure" : "Pa",
  "light" : "lux",
  "humidity" : "%",
  "gpsinternaltemp" : "\u00B0C",
  "direction" : "\u00B0",
  "speed" : "m/s",
  "satellites" : "sats",
  "batteryvoltage" : "V",
  "x" : "g",
  "y" : "g",
  "z" : "g"
}

var ws = new WebSocket("ws://balloon.mybluemix.net/balloondata");
var data = [];

function callback(new_data){
  new_data.sort(function(a, b){ // Sort by chosen 
    return parseFloat(accessorx(a))-parseFloat(accessorx(b));
  });  

  console.log(new_data);
  data = new_data;
  drawData();
}
changeAxis();

ws.onmessage = function (msg){
  d = msg.data ;
  console.log(d);
  index = bisect(data, d);
  data.splice(index,0,d);
  drawData();
};

ws.onclose = function(){ 
  // attempt to reconnect
  alert("Connection is closed, attemping reconnect");
  ws = new WebSocket("ws://balloon.mybluemix.net/balloondata");
  data = [];
};

function drawData(){
    x.domain([d3.min(data, accessorx), d3.max(data, accessorx)]); //Set domains of scale functions
    y.domain([d3.min(data, accessory), d3.max(data, accessory)]);

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

  if(data.length > 0) callback(data);
  else getData();
};

function getData(){ // Function for refreshing the data tag in the html (effectively refreshing the data)
  if(d3.select(".data")) d3.select("data").remove();
  d3.select("script").insert("script")
    // .attr("src", "http://balloon.mybluemix.net/getdata")
    .attr("src", "data/example_sensor.js")
    .attr("class", "data");
}

function adjustFocus(data, mouse){ //Adjusts focus based on mouse position but sticks to data points (only if x axis is sorted)
    var x0 = x.invert(mouse[0]-margin.left),
    index = bisect(data, x0),
    d0 = data[index - 1],
    d1 = data[index];
    var d = null;
    if(d0 == undefined) d = d1;
    else if(d1 == undefined) d = d0;
    else d = x0 - accessorx(d0) > accessorx(d1) - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(accessorx(d)) + "," + y(accessory(d)) + ")");
    focus.select("text").text("(" + sf3(d[xValue.toUpperCase()]) + units[xValue] + ", " + sf3(d[yValue.toUpperCase()]) + units[yValue] + ")");
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

function sf3(value){
  var format = d3.format(".3r");
  if(typeof value == 'string' || value instanceof String) return value;
  else return format(value);
}
function timeify(time){
  var t = time.split(":");
  console.log(t);
  var mins = t[1] + t[0]*60;
  var secs = t[2] + mins*60;
  return secs;
}