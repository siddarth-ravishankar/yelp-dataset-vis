var map = L.map('map').setView([40, -100], 4);
var latLngBounds = map.getBounds();
var markersGroup = new L.MarkerClusterGroup();
L.tileLayer('https://{s}.tiles.mapbox.com/v4/{mapId}/{z}/{x}/{y}.png?access_token={token}', 
	{
		mapId: 'siddarth1990.lk5jn0d6',
		token: 'pk.eyJ1Ijoic2lkZGFydGgxOTkwIiwiYSI6IllBb3NJbjgifQ.3etwR1ANKbcbMWWL8gYFQg',
		maxZoom: 20
	}
).addTo(map);

map.on('moveend', function(e) {
	getBusinessesInBounds (map.getBounds());
});

getBusinessesInBounds (map.getBounds());


function getBusinessesInBounds (latLngBounds) {

	var requestName = "get_businesses"	
	var attributesDictionary = {'north':latLngBounds.getNorth(), 'east':latLngBounds.getEast(), 'south':latLngBounds.getSouth(), 'west':latLngBounds.getWest(), 'business-categories':''};
	
	var selectedBusinessesString = "";
	for (var i=0; i<selectedBusinesses.length; i++) {
		attributesDictionary['business-categories'] += selectedBusinesses[i].replace(/&/g, "_amp_") + ",";
	}
	
	d3.json(createRequestURL(requestName, attributesDictionary), function(error, json) {

		if (error) {
			copyCurrentBusinessesListToSelectedBusinessesList();
			return console.warn(error);
		}
			
			
		copySelectedBusinessesListToCurrentBusinessesList();
			
		responseArray = json['response_object']
		console.log(responseArray)
	
		map.removeLayer(markersGroup);		
		markersGroup = new L.MarkerClusterGroup( { disableClusteringAtZoom: 1 } );
		
		for(var i=0; i<responseArray.length; i++) {
							
			if (responseArray[i]['type'] == 'clustered') {
				var businessMarker = createBusinessMarkerForClusteredBusinesses (responseArray[i]);
				markersGroup.addLayer(businessMarker);
			}
			else {
				var businessMarkerArray = createBusinessMarkersForIndividualBusinesses (responseArray[i]);
				markersGroup.addLayers(businessMarkerArray);
			}		
			
		}						
		map.addLayer(markersGroup);
	});
}