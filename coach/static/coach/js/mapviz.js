var map;

var gpx_latitude = [];
var gpx_longitude = [];
var gpx_elevation = [];
var gpx_distance = [];

var next_button_value = -1;
var distanceSegment = 20; // TAken from Python. Needs modification to autogenerate this value from python
var markers = [];

function markGoogleMap(x0){
    deleteMarkers(); // Delete previous markers
    // NOTE: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    // Identify latitude, lingitude corresponding to x0
    for (var i=0; i<gpx_distance.length; i++){
        if(x0 <= gpx_distance[i]){
            var marker = new google.maps.Marker({
                position: {lat: gpx_latitude[i], lng: gpx_longitude[i]},
                map: map,
            });
            markers.push(marker);
            // setAllMarker(map);
            break;
        }
    }
}

// Sets the map on all markers in the array.
function setAllMarker(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  setAllMarker(null);
  markers = [];
}

function getMap(centerLocation) {
    console.log("2. I am inside getMap");
    console.log(centerLocation);
    // centerLocation = new google.maps.LatLng({lat: 60.192059, lng: 24.945831});
    // console.log(centerLocation);
    map = new google.maps.Map(document.getElementById('gpxPlot'), {
        center: centerLocation,
        zoom: 9
    });
}

function getRouteOnMap(points) {
    var poly = new google.maps.Polyline({
            // use your own style here
            path: points,
            strokeColor: "#FF00AA",
            strokeOpacity: .7,
            strokeWeight: 4
        });
            poly.setMap(map);
}

$(document).on("pageinit", "#googlemapPlot", function(event){
    route_extraction();
});
    
// Extraction of route info from the rider's entered gpx file
function route_extraction(){
    console.log("1. route_extraction activated");
    var points = [];
    $.ajax({
        type: "GET",
        url: gpxPlotGraph,
        success: function(data){
            console.log(data['latitude']);
            gpx_latitude = data['latitude'];
            gpx_longitude = data['longitude'];
            gpx_elevation = data['elevation']; 
            gpx_distance = data['distance'];
            var lat_start = gpx_latitude[0];
            var lon_start = gpx_longitude[0];
            for (var i=0; i<gpx_distance.length; i++){
                var p = new google.maps.LatLng({lat: gpx_latitude[i], lng: gpx_longitude[i]}); 
                points.push(p);
            }
            var centerLocation = new google.maps.LatLng({lat: lat_start, lng: lon_start});
            getMap(centerLocation);
            getRouteOnMap(points); // AJAX successful call takes time. Hence calling getRouteOnMap() only after a successful call.
        }
    });
}

// Get the current location of the map
function getCurenntLocation() {
    console.log("5. getCurenntLocation function activated");
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showLivePosition, errorCallback, 
            {enableHighAccuracy:true,timeout:60000,maximumAge:1000});
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function errorCallback(){}

function showLivePosition(position){
    console.log("7. showLivePosition function activated");
    var lat = position.coords.latitude; 
    var lon = position.coords.longitude;
    var data = {lat: lat, lon: lon, csrfmiddlewaretoken : getCookie('csrftoken')};
    console.log("data sent as POST: " + data.lat + ", " + data.csrfmiddlewaretoken);
    $.post(geoFill, data, function(response){ 
    });
    updateRiderMarker(lat, lon);
}

function updateRiderMarker(drivenLatitude, drivenLongitude){
    console.log("   a. updateMarker function activated");
    var marker = new google.maps.Marker({
        position: {lat: drivenLatitude, lng: drivenLongitude},
        label: 'PS',
        map: map,
    });
    // markersRide.push(marker);
    map.panTo({lat: drivenLatitude, lng: drivenLongitude});
}


// Generating csrftoken 
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};