function toggleMenu () {
	if ( isFilterMenuOpen() ) {
		toggleFilterMenu();
	}
	
	var menuWidth = "400px";
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

function copySelectedBusinessesListToCurrentBusinessesList () {
	currentBusinesses = [];	
	for (var i=0; i<selectedBusinesses.length; i++) {
		currentBusinesses.push(selectedBusinesses[i]);
	}
}

function toggleFilterMenu () {

	var filterMenuWidth = d3.select("#filter-menu-container").style("max-width");
	var filterMenuHeight = d3.select("#filter-menu-container").style("max-height");
	var menuWidth = parseInt(d3.select("#filter-menu-container").style("max-width")) + 25 + "px";
	var filterIconName = "glyphicon glyphicon-collapse-up";
	
	if ( parseInt(d3.select("#filter-menu-container").style("width")) > 0) {
		filterMenuWidth = "0px";
		filterMenuHeight = "0px";
		menuWidth = "400px";
		filterIconName = "glyphicon glyphicon-collapse-down";
	}
	else {
		copyCurrentBusinessesListToSelectedBusinessesList();
	}
	
	d3.select("#filter-menu-container").transition().duration(1000).style("width", filterMenuWidth).style("height", filterMenuHeight);
	d3.select("#menu").transition().duration(1000).style("width", menuWidth);
	document.getElementById("icon-for-filter-expand").className = filterIconName;	

}

function isFilterMenuOpen() {
	return ( parseInt(d3.select("#filter-menu-container").style("width")) > 0);
}

$( document ).ready(function() {

	document.getElementById("filter-menu-table").innerHTML += "<tr><td><a style=\"display: block;\" href=\"#\" onclick=\"selectOrUnselectAllBusiness(); return false;\"><span id=\"business-all\" class=\"glyphicon glyphicon-check\"></span>&nbsp&nbsp&nbsp&nbspAll</a></td><td style=\"padding-right:50px;\"><div style=\"padding-left:10px; float: right; background: rgb(227, 227, 227); border-radius: 5px; width: 70px;\" ><a href=\"#\" onclick=\"filterBusinesses(); return false;\">Filter&nbsp;&nbsp;<span class=\"glyphicon glyphicon-filter\"/></a></div></td></tr>";

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

function selectOrUnselectBusiness (businessCategory) {
	
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