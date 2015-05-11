var compareBusinessesEnabled = false;
var businessesForCompareArray = [];

var ratingRange = "1-5";
var priceRange = "1-4";
var includeNonPricedBusinesses = false;

function updateRatingRangeSlider (low, high) {
	for(var i=0; i<5; i++) {
		var imgSrc = "url('static/images/star_zero.png')"
		if (i<(low+1)/2)
			imgSrc = "url('static/images/star_full.png')"
		if (i == (low+1)/2-0.5)
			imgSrc = "url('static/images/star_half.png')"								
		d3.select("#clustered-info-view").select("#rating-range-left").select("#star-rating-"+(i+1)).style({"background":imgSrc, "background-size":"100%"});
		
		imgSrc = "url('static/images/star_zero.png')"
		if (i<(high+1)/2)
			imgSrc = "url('static/images/star_full.png')"
		if (i == (high+1)/2-0.5)
			imgSrc = "url('static/images/star_half.png')"								
		d3.select("#clustered-info-view").select("#rating-range-right").select("#star-rating-"+(i+1)).style({"background":imgSrc, "background-size":"100%"});
	}
	ratingRange = (low+1)/2 + "-" + (high+1)/2;
}

function updatePriceRangeSlider (low, high) {
	d3.select("#clustered-info-view").select("#price-range-left").attr({"src":"static/images/pricerange" + low + ".png"});
	d3.select("#clustered-info-view").select("#price-range-right").attr({"src":"static/images/pricerange" + high + ".png"});
	priceRange = low + "-" + high;
}

$(function() {		    	
	$( "#rating-range-slider" ).slider({
		range: true,
		min: 1,
		max: 9,
		values: [1,9],
		slide: function( event, ui ) {
			updateRatingRangeSlider (ui.values[0], ui.values[1]);
			getBusinessesInBounds (map.getBounds());
		}
	});
	$( "#price-range-slider" ).slider({
		range: true,
		min: 1,
		max: 4,
		values: [1,4],
		slide: function( event, ui ) {
			updatePriceRangeSlider (ui.values[0], ui.values[1]);
			getBusinessesInBounds (map.getBounds());
		}
	});
});

function toggleMenu() {
	if ( isFilterMenuOpen() ) {
		toggleFilterMenu();
	}
	if ( isCompareBusinessTableOpen() ) {
		toggleCompareBusinessTable();
	}
// 	if ( isFilter2MenuOpen() ) {
// 		toggleFilter2Menu();
// 	}
	
	var menuWidth = "260px";
	if ( parseInt(d3.select("#menu").style("width")) > 0) {
		menuWidth = "0px";
	}
	d3.select("#menu").transition().duration(1000).style("width", menuWidth);
}

function isMenuOpen () {
	return ( parseInt(d3.select("#menu").style("height")) > 0)
}

function copyCurrentBusinessesListToSelectedBusinessesList () {
	selectedBusinesses = [];	
	for (var i=0; i<currentBusinesses.length; i++) {
		selectedBusinesses.push(currentBusinesses[i]);
	}
	refreshFilterCheckList();
}

function copySelectedBusinessesListToCurrentBusinessesList() {
	currentBusinesses = [];
	for (var i=0; i<selectedBusinesses.length; i++) {
		currentBusinesses.push(selectedBusinesses[i]);
	}
}

function toggleFilterMenu() {

	var filterMenuWidth = d3.select("#filter-menu-container").style("max-width");
	var filterMenuHeight = d3.select("#filter-menu-container").style("max-height");
	var menuWidth = parseInt(d3.select("#filter-menu-container").style("max-width")) + 25 + "px";
	var filterIconName = "glyphicon glyphicon-collapse-up";
	var topValueForCompareBusinessesButton = parseInt(d3.select("#compare-businesses-button").style("top"));
// 	var topValueForFilter2Button = parseInt(d3.select("#filter2-businesses-button").style("top"));
	
	if ( parseInt(d3.select("#filter-menu-container").style("width")) > 0) {
		filterMenuWidth = "0px";
		filterMenuHeight = "0px";
		menuWidth = "260px";
		filterIconName = "glyphicon glyphicon-collapse-down";
		topValueForCompareBusinessesButton = 45;
// 		topValueForFilter2Button = 90;
	}
	else {
		copyCurrentBusinessesListToSelectedBusinessesList();
		if ( isCompareBusinessTableOpen() ) {
			toggleCompareBusinessTable();
		}
		// if ( isFilter2MenuOpen() ) {
// 			toggleFilter2Menu();
// 		}

		topValueForCompareBusinessesButton += 600;
// 		topValueForFilter2Button += 600;
	}
	
	d3.select("#filter-menu-container").transition().duration(1000).style("width", filterMenuWidth).style("height", filterMenuHeight);
	d3.select("#menu").transition().duration(1000).style("width", menuWidth);
	d3.select("#compare-businesses-button").transition().duration(1000).style("top", topValueForCompareBusinessesButton.toString()+"px");
// 	d3.select("#filter2-businesses-button").transition().duration(1000).style("top", topValueForFilter2Button.toString()+"px");
	document.getElementById("icon-for-filter-expand").className = filterIconName;	

}

function isFilterMenuOpen() {
	return ( parseInt(d3.select("#filter-menu-container").style("width")) > 0);
}

$( document ).ready(function() {

	document.getElementById("filter-menu-table").innerHTML += "<tr><td><a style=\"display: block;\" href=\"#\" onclick=\"selectOrUnselectAllBusiness(); return false;\"><span id=\"business-all\" class=\"glyphicon glyphicon-check\"></span>&nbsp&nbsp&nbsp&nbspAll</a></td><td style=\"padding-right:50px;\"><div style=\"padding-left:10px; float: right; background: rgb(227, 227, 227); border-radius: 5px; width: 70px;\" ><a href=\"#\" onclick=\"filterBusinesses(); toggleMenu(); return false;\">Filter&nbsp;&nbsp;<span class=\"glyphicon glyphicon-filter\"/></a></div></td></tr>";

	for(var i=0; i<masterCategoryKeywords.length-1; i+=2) {
		var selectedIcon1 = "glyphicon-unchecked";
		var selectedIcon2 = "glyphicon-unchecked";
		for(var j=0; j<selectedBusinesses.length; j++) {
			if ( masterCategoryKeywords[i] == selectedBusinesses[j] ) {
				selectedIcon1 = "glyphicon-check";
			}
			if ( masterCategoryKeywords[i+1] == selectedBusinesses[j] ) {
				selectedIcon2 = "glyphicon-check";
			}
		} 
		document.getElementById("filter-menu-table").innerHTML += "<tr><td><a style=\"display: block;\" href=\"#\" onclick=\"selectOrUnselectBusiness('" + masterCategoryKeywords[i] + "'); return false;\"><span id=\"business-" + i + "\" class=\"glyphicon " + selectedIcon1 + "\"></span>&nbsp&nbsp&nbsp&nbsp" + masterCategoryKeywords[i] + "&nbsp&nbsp&nbsp&nbsp<img height=\"35\" width=\"27\"  src = \"static/images/markers/" + masterCategoryKeywords[i] + ".png\"/></a></td><td><a style=\"display: block;\" href=\"#\" onclick=\"selectOrUnselectBusiness('" + masterCategoryKeywords[i+1] + "'); return false;\"><span id=\"business-" + (i+1) + "\" class=\"glyphicon " + selectedIcon2 + "\"></span>&nbsp&nbsp&nbsp&nbsp" + masterCategoryKeywords[i+1] + "&nbsp&nbsp&nbsp&nbsp<img height=\"35\" width=\"27\" src = \"static/images/markers/" + masterCategoryKeywords[i+1] + ".png\"/></a></td></tr>";
	}
});

function selectOrUnselectAllBusiness() {

	if (selectedBusinesses.length == masterCategoryKeywords.length-1) {
		selectedBusinesses = [];
	}
	else {
		selectedBusinesses = [];
		for(var i=0; i<masterCategoryKeywords.length-1; i++) {
			selectedBusinesses.push(masterCategoryKeywords[i])
		}		
	}
	refreshFilterCheckList();

}

function selectOrUnselectBusiness(businessCategory) {
	
	if (selectedBusinesses.indexOf(businessCategory) == -1) {
		selectedBusinesses.push(businessCategory);
	}
	else {
		selectedBusinesses.splice(selectedBusinesses.indexOf(businessCategory), 1);
	}

	refreshFilterCheckList();
}

function refreshFilterCheckList() {
	for(var i=0; i<masterCategoryKeywords.length-1; i++) {
		var selectedIcon = "glyphicon-unchecked";
		for(var j=0; j<selectedBusinesses.length; j++) {
			if ( masterCategoryKeywords[i] == selectedBusinesses[j] ) {
				selectedIcon = "glyphicon-check";
				break;
			}			
		}
		document.getElementById("business-" + i).className = "glyphicon " + selectedIcon;
	}
	
	if (selectedBusinesses.length == masterCategoryKeywords.length-1) {
		document.getElementById("business-all").className = "glyphicon glyphicon-check";
	}
	else {
		document.getElementById("business-all").className = "glyphicon glyphicon-unchecked";	
	}
}

function filterBusinesses() {
	toggleMenu();
	getBusinessesInBounds (map.getBounds());
}

function toggleCompareBusinessTable() {
	
	var compareBusinessesHeight = d3.select("#compare-businesses-container").style("max-height");
	var filterIconName = "glyphicon glyphicon-collapse-up";
// 	var topValueForFilter2Button = parseInt(d3.select("#filter2-businesses-button").style("top"));
	
	if ( parseInt(d3.select("#compare-businesses-container").style("height")) > 0) {
		compareBusinessesHeight = "0px";
		filterIconName = "glyphicon glyphicon-collapse-down";
		compareBusinessesEnabled = false;
// 		topValueForFilter2Button = 90;
	}
	else {
		compareBusinessesEnabled = true;
		if ( isInfoViewOpen() ) {
			toggleInfoView();
		}
// 		if ( isFilter2MenuOpen() ) {
// 			d3.select("#filter2-menu-container").style("height", 0);
// 		}
// 		topValueForFilter2Button += 450;
	}
	
	d3.select("#compare-businesses-container").transition().duration(1000).style("height", compareBusinessesHeight);
// 	d3.select("#filter2-businesses-button").transition().duration(1000).style("top", topValueForFilter2Button.toString()+"px");
	document.getElementById("icon-for-compare-business-expand").className = filterIconName;
}

function isCompareBusinessTableOpen() {
	return ( parseInt(d3.select("#compare-businesses-container").style("height")) > 0);
}

function addToCompareBusinessesTable (business) {
	var present = false;
	for ( var i=0; i<businessesForCompareArray.length; i++ ) {
		if (business['business_id'] == businessesForCompareArray[i]['business_id']) {
			present = true;
			break;
		}
	}
	if ( !present) {
		businessesForCompareArray.push(business);
	}
	updateCompareBusinessesTable();
	$('#compare-businesses-table-div').animate({scrollTop: $('#compare-businesses-table-div').height()}, 500);
}

function updateCompareBusinessesTable () {
	var compareBusinessTableText = "";
	for ( var i=0; i<businessesForCompareArray.length; i++ ) {
		compareBusinessTableText += "<tr><td width=\"80%\" style=\"font-size: 12px;\">" + businessesForCompareArray[i]["name"] + "</td><td align=right width=\"20%\"><a href=\"#\" onclick=removeFromCompareBusinessesTable(\"" + i + "\"); return false;><img height=15px width=15px src=\"static/images/remove.png\"/></a></td></tr>";	
	}

	document.getElementById("compare-businesses-table").innerHTML = compareBusinessTableText;
}

function removeFromCompareBusinessesTable (index) {
	businessesForCompareArray.splice(index, 1);
	updateCompareBusinessesTable();
}

function removeAllCompareBusinesses() {
	businessesForCompareArray = [];
	updateCompareBusinessesTable();
}

function compareBusinesses() {

	if (businessesForCompareArray.length==0)
		return;

	var businessesArrayString = "";

	for ( var i=0; i<businessesForCompareArray.length; i++ ) {
		businessesArrayString += businessesForCompareArray[i]['business_id'] + ",";
	}
	
	compareBusinessesForm=document.createElement('FORM');
	compareBusinessesForm.method='POST';
	compareBusinessesForm.action='/compare_businesses';
	compareBusinessesForm.target='_blank';

	inputNode=document.createElement('INPUT');
	inputNode.type='HIDDEN';
	inputNode.name='businesses_array';
	inputNode.value=businessesArrayString;
	compareBusinessesForm.appendChild(inputNode);
	compareBusinessesForm.submit();

}

// function toggleFilter2Menu() {
// 	
// 	var filter2ContainerHeight = d3.select("#filter2-menu-container").style("max-height");
// 
// 	var filterIconName = "glyphicon glyphicon-collapse-up";
// 	
// 	if ( parseInt(d3.select("#filter2-menu-container").style("height")) > 0) {
// 		filter2ContainerHeight = "0px";
// 		filterIconName = "glyphicon glyphicon-collapse-down";
// 	}
// 	else {
// 		if (isCompareBusinessTableOpen()) {
// 			toggleCompareBusinessTable();
// 		}
// 	}
// 	
// 	d3.select("#filter2-menu-container").transition().duration(1000).style("height", filter2ContainerHeight);
// 	document.getElementById("icon-for-filter2-expand").className = filterIconName;
// }
// 
// function isFilter2MenuOpen() {
// 	return ( parseInt(d3.select("#filter2-menu-container").style("height")) > 0);
// }