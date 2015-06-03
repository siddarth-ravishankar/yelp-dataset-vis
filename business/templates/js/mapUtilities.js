function createRequestURL ( requestName, attributesDictionary ) {

	if (attributesDictionary.length == 0)
		return requestName;

	var requestURL = requestName + "?"

	for(var key in attributesDictionary) {
		requestURL += key + "=" + attributesDictionary[key] + "&"
	}	
	return requestURL.substring(0, requestURL.length-1);
}

function createBusinessMarkerForClusteredBusinesses (responseObject, index) {

	var customClusterIcon = L.icon({
		iconUrl: 'static/images/markers/marker-cluster.png',
		iconSize: [31, 40],
		shadowUrl: 'static/images/markers/markers-shadow.png',
		shadowSize: [27, 35]
	});
	
	var clusteredMarker = new L.marker([responseObject['latitude'], responseObject['longitude']], {icon: customClusterIcon });
	clusteredMarker.bindPopup(responseObject['count'] + " businesses here<br>Double click to explore", {offset: [0,-13] } );
	clusteredMarker.on('click', function(e) {		
		if (compareBusinessesEnabled) {
			
		}
		else {
			displayClusteredBusinessDetails (responseObject);
			selectedClusterId = index;
		}
	});
	clusteredMarker.on('dblclick', function(e) {
		explore(responseObject['boundary']['north'], responseObject['boundary']['west'], responseObject['boundary']['south'], responseObject['boundary']['east']);
	});
	clusteredMarker.on('mouseover', function (e) {
		this.openPopup();
	});
	clusteredMarker.on('mouseout', function (e) {
		this.closePopup();
	});	
	return clusteredMarker;
}

function createBusinessMarkersForIndividualBusinesses (responseObject) {

	var businessMarkers = [];
	var businesses = responseObject['businesses'];
	for (var i=0; i<businesses.length; i++) {
		var business = businesses[i];
		var iconImageUrl = 'static/images/markers/Unknown.png';
		
		for (var keywordCounter = 0; keywordCounter < masterCategoryKeywords.length; keywordCounter++) {
			if ( masterCategoryKeywords[keywordCounter] == business.master_category ) {
				iconImageUrl = 'static/images/markers/' + business.master_category + '.png';
			}
		}

		var customBusinessIcon = L.icon({
			iconUrl: iconImageUrl,
			iconSize: [31, 40],
			shadowUrl: 'static/images/markers/markers-shadow.png',
			shadowSize: [27, 35]
		});

		var businessMarker = new L.marker([business['latitude'], business['longitude']], {id: i, icon: customBusinessIcon });
		businessMarker.bindPopup(business['name'] + "<br>" + getRatingsDivTextForPopUpView (business), {offset: [0,-8] });
		businessMarker.on('click', function(e) {
			if (compareBusinessesEnabled) {
				addToCompareBusinessesTable (businesses[e.target.options.id]);
			}
			else {
				displayBusinessDetails (businesses[e.target.options.id]);
				selectedClusterId = -1;
			}			
			console.log(businesses[e.target.options.id])
		});		
		businessMarker.on('mouseover', function (e) {
			this.openPopup();
		});
		businessMarker.on('mouseout', function (e) {
			this.closePopup();
		});
		businessMarkers.push(businessMarker);
	}
	return businessMarkers;
}

function getRatingsDivTextForPopUpView (business) {
	
	var starRatingText = "";
	var ratingValue = business['stars'];
	
	for(var i=0; i<5; i++) {
		var starImageUrl = "star_zero.png";
		if (ratingValue >= 1) {
			starImageUrl = "star_full.png";
		}
		else if (ratingValue == 0.5) {
			starImageUrl = "star_half.png";
		}
		ratingValue -= 1;
		
		starRatingText += "<img src='static/images/" + starImageUrl + "' height=15px width=15px/>";
	}
	
	return starRatingText;
}

function explore (north, west, south, east) {

	if ( isInfoViewOpen() ) {
		toggleInfoView();
	}
	
 	console.log("Exploring: " + north + " " + west + " " + south + " " + east);
 	map.fitBounds( [[south, west], [north, east]] );
}