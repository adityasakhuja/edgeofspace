////////////////////////////////////////
// Edge of Space
// Author: Luke Ellison
// Date: 27/4/2015
////////////////////////////////////////

function callback(data){
  google.maps.event.addDomListener(window, 'load', initialize); // Create DOM listener to draw map once page has loaded
  
  function initialize() { // Draw map
    var gps_points = return_sorted_gps_coordinates(data)

    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(gps_points[0].lat,gps_points[0].lng),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var flightPlanCoordinates = [];

    gps_points.forEach(function(point){
      flightPlanCoordinates.push(new google.maps.LatLng(point.lat,point.lng));
    })

    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
    flightPath.setMap(map);

    var launch_img = {
      url: "img/launchpad_tracker_icon_small.png",
      size: new google.maps.Size(57, 17),
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      anchor: new google.maps.Point(28, 9)
    };

    var balloon_img = {
      url: "img/balloon_tracker_icon.png",
      // This marker is 20 pixels wide by 32 pixels tall.
      size: new google.maps.Size(20, 32),
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      anchor: new google.maps.Point(0, 16)
    };

    var launch_marker = new google.maps.Marker({
        position: new google.maps.LatLng(gps_points[0].lat,gps_points[0].lng),
        title:"Launch",
        map: map,
        icon: launch_img
    });

    var balloon_marker = new google.maps.Marker({
        position: new google.maps.LatLng(gps_points[gps_points.length-1].lat,gps_points[gps_points.length-1].lng),
        title:"Current Position",
        map: map,
        icon: "img/balloon_tracker_icon_small.png"
    });
  }
}

function return_sorted_gps_coordinates(data){   // Extract expected info from json

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
