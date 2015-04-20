function createRequestURL ( requestName, attributesDictionary ) {

	if (attributesDictionary.length == 0)
		return requestName;

	var requestURL = requestName + "?"

	for(var key in attributesDictionary) {
		requestURL += key + "=" + attributesDictionary[key] + "&"
	}	
	return requestURL.substring(0, requestURL.length-1);
}

function createBusinessMarkerForClusteredBusinesses (responseObject) {

	var customClusterIcon = L.icon({
		iconUrl: 'static/images/markers/marker-cluster.png',
		iconSize: [31, 40],
		shadowUrl: 'static/images/markers/markers-shadow.png',
		shadowSize: [27, 35]
	});
	
	var clusteredMarker = new L.marker([responseObject['latitude'], responseObject['longitude']], {icon: customClusterIcon });
	clusteredMarker.bindPopup("<a style='text-decoration: none;' href='#' onclick='explore(" + responseObject['boundary']['north'] + "," + responseObject['boundary']['west'] + "," + responseObject['boundary']['south'] + "," + responseObject['boundary']['east'] + "); return false;'>Explore</a> this place");
	clusteredMarker.on('click', function(e) {
		displayClusteredBusinessDetails (responseObject);
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
		businessMarker.bindPopup(business['name']);
		businessMarker.on('click', function(e) {
			displayBusinessDetails (businesses[e.target.options.id]);
			console.log(businesses[e.target.options.id])
		});
		businessMarkers.push(businessMarker);
	}
	return businessMarkers;
}

function explore (north, west, south, east) {

	if ( isInfoViewOpen() ) {
		toggleInfoView();
	}
	
 	console.log("Exploring: " + north + " " + west + " " + south + " " + east);
 	map.fitBounds( [[south, west], [north, east]] );
}