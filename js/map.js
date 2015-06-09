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
    prevBalloon_marker = null;

var launch_img = { //Define launching pad image for map
  url: "img/launchpad_tracker_icon_small.png",
  size: new google.maps.Size(57, 17),
  // The origin for this image is 0,0.
  origin: new google.maps.Point(0,0),
  // The anchor for this image is the base of the flagpole at 0,32.
  anchor: new google.maps.Point(28, 9)
};

var balloon_img = { //Define launching balloon image for map
  url: "img/balloon_tracker_icon.png",
  // This marker is 20 pixels wide by 32 pixels tall.
  size: new google.maps.Size(20, 32),
  // The origin for this image is 0,0.
  origin: new google.maps.Point(0,0),
  // The anchor for this image is the base of the flagpole at 0,32.
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
  var gps_points = return_sorted_gps_coordinates(data)

  var flightPlanCoordinates = [];
  gps_points.forEach(function(point){
    flightPlanCoordinates.push(new google.maps.LatLng(point.lat,point.lng));
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

  console.log(launch_marker);
  if(!launch_marker) //Only draw launch marker once
  launch_marker = new google.maps.Marker({
      position: new google.maps.LatLng(gps_points[0].lat,gps_points[0].lng),
      title:"Launch",
      map: map,
      icon: launch_img
  });

  balloon_marker = new google.maps.Marker({
      position: new google.maps.LatLng(gps_points[gps_points.length-1].lat,gps_points[gps_points.length-1].lng),
      title:"Current Position",
      map: map,
      icon: "img/balloon_tracker_icon_small.png"
  });
  if(prevBalloon_marker != null) prevBalloon_marker.setMap(null);
  prevBalloon_marker = balloon_marker;
}

setInterval(getData, 5000); //Re-render every 2 seconds

function getData(){ // Function for refreshing the data tag in the html (effectively refreshing the data)
  if($(".data").length) $(".data").remove();
  var script_el = "<script type='application/javascript' class='data' src='data/example_pos.js'>";
  $("script").after(script_el);
}

function return_sorted_gps_coordinates(data){   // Extract expected info from json and sort it

  var payload_array = [];
  data.forEach(function(datum){
    var payload = datum.payload; // Remove the id and rev from the json
    payload_array.push(payload); 
  })

  payload_array.sort(function(a, b){ // Sort by time
    return parseFloat(a.timestamp)-parseFloat(b.timestamp);
  });

  var gps_points = [];
  payload_array.forEach(function(payload){ // Take gps and put it in expected format
    var LatLng = {"lat": payload.lat, "lng": payload.lng};
    gps_points.push(LatLng);
  })

  return gps_points;
}
