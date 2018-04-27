"use strict";

//Location array
var locations = [{
    name: "Amsterdam Ale House",
    lat: 40.781422,
    lng: -73.979954,
    id: "49ef2aabf964a52083681fe3"
  },
  {
    name: "Rudy's",
    lat: 40.760029,
    lng: -73.991766,
    id: "3fd66200f964a5208de81ee3"
  },
  {
    name: "Stumptown Coffee Roasters",
    lat: 40.745632,
    lng: -73.988052,
    id: "44aa52d50f964a520834720e3"
  },
  {
    name: "Eataly Flatiorn",
    lat: 40.742164,
    lng: -73.989894,
    id: "4c5ef77bfff99c74eda954d3"
  },
  {
    name: "Cleopatra's Needle",
    lat: 40.792474,
    lng: -73.973683,
    id: "3fd66200f964a52055e81ee3"
  },
]

//Setting up map view
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.7651298,
      lng: -73.9821123
    },
    zoom: 14,
  });
  var infowindow = new google.maps.InfoWindow();
  //Creates markers for my locations run and pushes to markers array
  for (var i = 0; i < locations.length; i++) {
    var marker = new google.maps.Marker({
      name: locations[i].name,
      position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
      map: map,
      animation: google.maps.Animation.DROP
    });
  }
}

// If map can't load
function mapError() {
  alert("Cannot Connect to Google Maps at this time. Please try again later.");
}

function MapViewModel() {
  var self = this;

  function Location(data) {
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.id = data.id;
  }

  Location.prototype.openWindow = function() {
    map.panTo(this.marker.position);
    google.maps.event.trigger(this.marker, 'click');
    if (currentInfoWindow !== null) {
      currentInfoWindow.close(map, this);
    }
  };

  ko.applyBindings(new MapViewModel());

  // Client ID and Secret for Foursquare
  //var CLIENT_ID_Foursquare = "PGRNG1GBR34H5Y025X0EWBXDPKDA2KIXVL2L1VEU4OIJDFUR";
  //var CLIENT_SECRET_Foursquare = "X4AIVIWMJLFIEMBMSAXC42WSN0PNXV5QCOCL3EMQOWOI3LO3";

  //Funtction to call Foursquare API
