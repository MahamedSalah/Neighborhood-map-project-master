// JavaScript Document
var clientID , clientSecret ,map;
// to save infoWindows that opened
var ListOfLocations = [];

// Locations
var Locations = [
    {
        LocName: 'Cairo University',
        lat: 30.027337,
        long:  31.208574
    },
    {
        LocName: 'Faculty of Engineering Cairo University',
        lat: 30.026244,
        long: 31.211579
    },
    
    {
        LocName: 'Giza Zoo',
        lat: 30.022658,
        long: 31.213660
    },
    {
        LocName: 'Faculty of Commerce Cairo University',
        lat: 30.025612,
        long: 31.204734
    },
    {
        LocName: 'Faculty of Agriculture Cairo University',
        lat: 30.017884,
        long: 31.208029
    },
    {
        LocName: 'Girls University City - Cairo University',
        lat: 30.016253,
        long: 31.208859
    }
];

/* 
To make request to foursquare to get place data and setting markers and
and infoWindows
*/ 
var GetLocation = function(place) {
	var MySelf = this;
	MySelf.LocName = place.LocName;
	MySelf.lat = place.lat;
	MySelf.long = place.long;
	MySelf.street = "";
	MySelf.city = "Giza";
    MySelf.country = "Egypt";
    
    clientID = "IOMJIIIDBP45MOVMNNOGDB2VR0PE2EQNCQV1SPWBSH5SZXU5";
    clientSecret ="G1WJZ1FPG414IRJURANWK2J2QMYLTK3GAVEWQ3MVXO0M5YGQ";
    // setting URL
	var PlaceURLFromFourSquare = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180000' + '&query=' + this.LocName;
    // Make Request
    fetch(PlaceURLFromFourSquare).then(function(response){
        // get response
        return response.json();
    }).then(function(place){
        // save data that get from response
        var results = place.response.venues[0];
		MySelf.street = results.location.formattedAddress[0];
     	MySelf.city = results.location.formattedAddress[1];  
    }).catch(function(){
        // Handle Error Connection
        alert("There Was an Error , Try again later");
    });
    
	this.infoWindow = new google.maps.InfoWindow(); // set infoWindow
    // set markers
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(place.lat, place.long),
			map: map,
			title: place.LocName
	});
    // check if the Location Visible in ListOfLocations
	this.showMarker = function(check){
         this.marker.setVisible(check);
    };
    // event to show about location 
	this.marker.addListener('click', function(){
		this.contentString = '<div>'+'<h2>'+place.LocName+'</h2>'+'<h4>'+"Countery: Egypt"+'</h4>'+'<h4>'+"City: "+ MySelf.city+'</h4>'+'<h4>'+"Street: "+ MySelf.street+'</h4>'+'</div>';
        MySelf.infoWindow.setContent(this.contentString);
        ListOfLocations.forEach(function(ViewPointItem){
            ViewPointItem.close();
        });
        ListOfLocations.push(MySelf.infoWindow);
		MySelf.infoWindow.open(map, this);

		MySelf.marker.setAnimation(google.maps.Animation.BOUNCE);
      	setTimeout(function() {
      		MySelf.marker.setAnimation(null);
     	},2e3);
	});
    // when click on any location in location list , click on the marker
	this.Toshow = function() {
		google.maps.event.trigger(MySelf.marker, 'click');
	};
};
// Initialization the map
function INTIMAP(){
     return new google.maps.Map(document.getElementById('map'), {
			zoom: 15,
			center: {lat: 30.025969, lng:  31.207507}
	});
}

function ViewModel() {
	var MySelf = this;
	MySelf.searchLocation = ko.observable("");
	MySelf.ListOfLoc = ko.observableArray([]);
	map =  INTIMAP();
    // get all Locations
	Locations.forEach(function(LocItem){
		MySelf.ListOfLoc.push( new GetLocation(LocItem));
	});
    // filtered List upon input location
	this.filteredList =   ko.computed( function() {
        this.ListOfLocs = ko.observableArray([]);
        var searchWord = MySelf.searchLocation().toLowerCase();
		var i = 0;
		while(i<this.ListOfLoc().length){
			var LocItem = MySelf.ListOfLoc()[i++];
            var LocName = LocItem.LocName.toLowerCase();
            var check = (LocName.search(searchWord) === 0); 
            LocItem.showMarker(check); // if true make marker of this location visible
            if(check)
                MySelf.ListOfLocs.push(LocItem);
		}
        return this.ListOfLocs();
        
	}, MySelf);
}

// Handle Error
function HandlingTheError() {
	alert("Failed to connect, try Again");
}
// strat APP
function startApp() {
	ko.applyBindings(new ViewModel());
}

