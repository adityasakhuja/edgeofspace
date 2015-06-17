////////////////////////////////////////
// Edge of Space
// Author: Luke Ellison
// Date: 27/4/2015
////////////////////////////////////////

var STARTLAT = 51.4796075,
    STARTLON = -0.2;

var map = null,
    prevFlightPath = null,
    launch_marker = null,
    balloon_marker = null;

var launch_img = { //Define launching pad image for map
  url: "img/launchpad_tracker_icon_small.png",
  size: new google.maps.Size(57, 17),
  // The origin for this image is 0,0.
  origin: new google.maps.Point(0,0),
  // The anchor for this image is the centre.
  anchor: new google.maps.Point(28, 9)
};

var balloon_img = { //Define launching balloon image for map
  url: "img/balloon_tracker_icon.png",
  // This marker is 20 pixels wide by 32 pixels tall.
  size: new google.maps.Size(20, 32),
  // The origin for this image is 0,0.
  origin: new google.maps.Point(0,0),
  // The anchor for this image is the base of the balloon at 0,16.
  anchor: new google.maps.Point(0, 16)
};

google.maps.event.addDomListener(window, 'load', initialize); // Create DOM listener to draw map once page has loaded

function initialize() { // Draw map
  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(STARTLAT,STARTLON),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  getData(); //Initial data get
}

function callback(data){ // Draw line when data refreshes
  var sorted_data = sort_data(data)

  var flightPlanCoordinates = [];
  sorted_data.forEach(function(point){
    flightPlanCoordinates.push(new google.maps.LatLng(point.LATITUDE,point.LONGITUDE));
  })

  flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2
  });
  flightPath.setMap(map);
  if(prevFlightPath != null) prevFlightPath.setMap(null);
  prevFlightPath = flightPath;

  if(!launch_marker) //Only draw launch marker once
  launch_marker = new google.maps.Marker({
      position: new google.maps.LatLng(sorted_data[0].LATITUDE,sorted_data[0].LONGITUDE),
      title:"Launch",
      map: map,
      icon: launch_img
  });

  console.log(balloon_marker);
  if(!balloon_marker) //Only draw balloon marker first time otherwise update position only
  balloon_marker = new google.maps.Marker({
      position: new google.maps.LatLng(sorted_data[sorted_data.length-1].LATITUDE,sorted_data[sorted_data.length-1].LONGITUDE),
      title:"Current Position",
      map: map,
      icon: "img/balloon_tracker_icon_small.png"
  });
  else balloon_marker.setPosition(new google.maps.LatLng(sorted_data[sorted_data.length-1].LATITUDE,sorted_data[sorted_data.length-1].LONGITUDE));
}

setInterval(getData, 5000); //Re-render every 2 seconds

function getData(){ // Function for refreshing the data tag in the html (effectively refreshing the data)
  if($(".data").length) $(".data").remove();
//  var script_el = "<script type='application/javascript' class='data' src='http://balloon.mybluemix.net/getgps'>";
  var script_el = "<script type='application/javascript' class='data' src='data/example_pos.js'>";
  $("script").after(script_el);
}

function sort_data(data){   // Extract expected info from json and sort it

  data.sort(function(a, b){ // Sort by time
    return timeify(a.PITIME)-timeify(b.PITIME);
  });

  return data;
}

function timeify(time){
  var t = time.split(":");
  var mins = parseInt(t[1]) + parseInt(t[0])*60;
  var secs = parseInt(t[2]) + mins*60;
  return secs;
}
