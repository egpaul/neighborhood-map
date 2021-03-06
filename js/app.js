"use strict";
var service;
var infowindow;
var currentInfoWindow = null;
var marker;

//FourSquare Client info
var CLIENT_ID = "PGRNG1GBR34H5Y025X0EWBXDPKDA2KIXVL2L1VEU4OIJDFUR";
var CLIENT_SECRET = "X4AIVIWMJLFIEMBMSAXC42WSN0PNXV5QCOCL3EMQOWOI3LO3";

//Setting up map view
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.7651298,
      lng: -73.9821123
    },
    zoom: 13,
  });


  function mapModel() {
    var self = this;

    // Constructor for location data
    function Location(data) {
      this.name = data.name;
      this.lat = data.lat;
      this.lng = data.lng;
      this.id = data.id;
    }

    // marker behavior
    Location.prototype.openWindow = function() {
      map.panTo(this.marker.position);
      google.maps.event.trigger(this.marker, 'click');
      if (currentInfoWindow !== null) {
        currentInfoWindow.close(map, this);
      }
    };

    // Calling FourSquare api
    function getFourSquare(location) {
      $.ajax({
        url: 'https://api.foursquare.com/v2/venues/' + location.id + '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20140806',
        success: function(data) {
          var result = data.response.venue;
          location.address = result.location.address;
          location.url = result.canonicalUrl;
          location.i

          // Fallback for locations that don't have rating set in FourSquare
          if (result.rating !== undefined) {
            location.rating = result.rating;
          } else {
            location.rating = 'Not Avaliable';
          }
          location.infoWindow.setContent('<div class="infowindow">' + '<strong>' + location.name + '</strong>' + '<p>Address: ' + location.address + '</p>' + '<p>Rating: ' + location.rating + '</p>' + '<a href="' + location.url + '">' + 'Foursquare Link' + '</a>' + '<p>Powered by Foursquare</p>');
          location.infoWindow.open(map);
        }
      }).fail(function(error) {
        location.infoWindow.setContent('<div class="infowindow">' + '<h2>Unfortunately the FourSquare API could not be accessed at this time. Try again later!</p>' + '</div>');
        location.infoWindow.open(map);
      });
    }

    // Empty array for all places that will be added with the forEach loop through the var locations
    self.allLocations = [];
    locations.forEach(function(location) {
      self.allLocations.push(new Location(location));
    });

    // marker location
    self.allLocations.forEach(function(location) {
      location.marker = new google.maps.Marker({
        map: map,
        position: {
          lat: location.lat,
          lng: location.lng
        },
        animation: google.maps.Animation.DROP,
        name: location.name,
        id: location.id
      });
      location.marker.infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(0, -40),
        position: {
          lat: location.lat,
          lng: location.lng
        }
      });

      // Add click functionality to markers
      location.marker.addListener('click', function toggleBounce() {
        map.panTo(location.marker.position);
        if (currentInfoWindow !== null) {
          currentInfoWindow.close(map, this);
        }
        getFourSquare(location.marker);
        currentInfoWindow = location.marker.infoWindow;
        if (location.marker.getAnimation() !== null) {
          location.marker.setAnimation(null);
        } else {
          location.marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        setTimeout(function() {
          location.marker.setAnimation(null);
        }, 500);
      });

    });

    // Ko array that will have the filtered locations on the map. Default state when starting the app is with all locations visible
    self.filteredLocations = ko.observableArray();
    self.allLocations.forEach(function(location) {
      self.filteredLocations.push(location);
    });

    // Implementing the search and filter functionality.
    // User input
    self.userSearch = ko.observable('');

    // Filter the observable Array
    self.filterLocations = function() {
      var textInput = self.userSearch().toLowerCase();

      // Remove everything from the filteredArray
      self.filteredLocations.removeAll();

      // Filter locations by name
      self.allLocations.forEach(function(location) {
        location.marker.setMap(null);

        if (location.name.toLowerCase().indexOf(textInput) > -1) {
          self.filteredLocations.push(location);
        }
      });

      self.filteredLocations().forEach(function(location) {
        location.marker.setMap(map);
      });
    };
  }
  ko.applyBindings(new mapModel());
}

function googleError() {
  alert("<strict>Google maps failed to load. Please try again later.</strict>");
}
