////////////////////////////////////////
// Edge of Space
// Author: Luke Ellison
// Date: 27/4/2015
////////////////////////////////////////

var STARTLAT = 52.212974,
    STARTLON = 0.097657;

var map = null,
    flightPath = null,
    drivePath = null,
    car_marker = null,
    launch_marker = null,
    balloon_marker = null;

var launch_img = { //Define launching pad image for map
  url: "img/launchpad_tracker_icon_small.png",
  size: new google.maps.Size(57, 17),
  origin: new google.maps.Point(0,0),
  // The anchor for this image is the centre.
  anchor: new google.maps.Point(28, 9)
};

var balloon_img = { //Define launching balloon image for map
  url: "img/balloon_tracker_icon_small.png",
  size: new google.maps.Size(37, 60),
  origin: new google.maps.Point(0,0),
  // The anchor for this image is the base of the balloon at 0,16.
  anchor: new google.maps.Point(18, 58)
};

var car_img = { //Define chase car image for map
  url: "img/car_tracker_icon_small.png",
  size: new google.maps.Size(20, 42),
  origin: new google.maps.Point(0,0),
  // The anchor for this image is the centre.
  anchor: new google.maps.Point(10, 21)
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

  if(!flightPath)
  flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    map: map,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2
  });
  else flightPath.setPath(flightPlanCoordinates);

  if(!launch_marker) //Only draw launch marker once
  launch_marker = new google.maps.Marker({
      position: new google.maps.LatLng(sorted_data[0].LATITUDE,sorted_data[0].LONGITUDE),
      title:"Launch",
      map: map,
      icon: launch_img
  });

  if(!balloon_marker) //Only draw balloon marker first time otherwise update position only
  balloon_marker = new google.maps.Marker({
      position: new google.maps.LatLng(sorted_data[sorted_data.length-1].LATITUDE,sorted_data[sorted_data.length-1].LONGITUDE),
      title:"Current Position",
      map: map,
      icon: balloon_img
  });
  else balloon_marker.setPosition(new google.maps.LatLng(sorted_data[sorted_data.length-1].LATITUDE,sorted_data[sorted_data.length-1].LONGITUDE));
}

function chasecar(data){ // Draw line when data refreshes
  var sorted_data = sort_data(data)

  var flightPlanCoordinates = [];
  sorted_data.forEach(function(point){
    flightPlanCoordinates.push(new google.maps.LatLng(point.LATITUDE,point.LONGITUDE));
  })

  if(!drivePath)
  drivePath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#00FF00',
    strokeOpacity: 0.8,
    strokeWeight: 2
  });
  else drivePath.setPath(flightPlanCoordinates);

  if(!car_marker) //Only draw balloon marker first time otherwise update position only
  car_marker = new google.maps.Marker({
      position: new google.maps.LatLng(sorted_data[sorted_data.length-1].LATITUDE,sorted_data[sorted_data.length-1].LONGITUDE),
      title:"Chase car",
      map: map,
      icon: car_img
  });
  else car_marker.setPosition(new google.maps.LatLng(sorted_data[sorted_data.length-1].LATITUDE,sorted_data[sorted_data.length-1].LONGITUDE));
}

setInterval(getData, 2000); //Re-render every 2 seconds

function getData(){ // Function for refreshing the data tag in the html (effectively refreshing the data)
  //balloon data
  if($(".gps").length) $(".gps").remove();
  var script_el = "<script type='application/javascript' class='gps' src='http://balloon.mybluemix.net/getgps'>";
  //var script_el = "<script type='application/javascript' class='gps' src='data/example_pos.js'>";
  $("script").after(script_el);
  //Chase car data
  if($(".cargps").length) $(".cargps").remove();
  script_el = "<script type='application/javascript' class='cargps' src='http://balloon.mybluemix.net/chasecar'>";
  $("script").after(script_el);
}

function sort_data(data){   // Extract expected info from json and sort it

  data.sort(function(a, b){ // Sort by time
    return timeify(a.TIME)-timeify(b.TIME);
  });

  return data;
}

function timeify(time){
  var t = time.split(":");
  var mins = parseInt(t[1]) + parseInt(t[0])*60;
  var secs = parseInt(t[2]) + mins*60;
  return secs;
}
