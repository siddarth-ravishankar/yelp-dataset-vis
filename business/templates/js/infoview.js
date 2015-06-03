var selectedBusinessTitle = "Show Info";

function toggleInfoView() {
	d3.select("#info-view-toggle-button-text").style("display", "block");
	var infoViewToggleButtonIconClass = "glyphicon glyphicon-collapse-up";
	var infoViewHeight = d3.select("#info-view").style("max-height");
	if ( parseInt(d3.select("#info-view").style("height")) > 0) {
		infoViewHeight = "0px";
		infoViewToggleButtonIconClass = "glyphicon glyphicon-collapse-down";
	}
	d3.select("#info-view").transition().duration(1000).style("height", infoViewHeight);
	d3.select("#info-view-toggle-button-text").select("div").text(selectedBusinessTitle);
	d3.select("#info-view-toggle-button-text").select("span").attr("class", infoViewToggleButtonIconClass);
}

function isInfoViewOpen() {
	return ( parseInt(d3.select("#info-view").style("height")) > 0)
}

function displayBusinessDetails (business) {

	selectedBusinessTitle = business['name'];
	d3.select("#info-view-toggle-button-text").select("div").text(selectedBusinessTitle);

	d3.select("#individual-info-view").style("display", "block");
	d3.select("#clustered-info-view").style("display", "none");

	if ( ! isInfoViewOpen()) {
		toggleInfoView();
	}

	var ratingSection = d3.select("#individual-info-view").select("#rating-section");
	
	ratingSection.select("#name").html("<a target='_blank' href='http://www.yelp.com/search?find_desc=" + business['name'] + "&find_loc=" + business['full_address'] + "'>" + business['name'] + "</a>");
	
	if (business['open'] == true) {
		ratingSection.select("#open").select("img").attr("src", "static/images/open.png");
	}
	else if (business['open'] == false) {
		ratingSection.select("#open").select("img").attr("src", "static/images/closed.png");
	}
	else {
		ratingSection.select("#open").select("img").attr("src", "");
	}
	
	var hoursString = "";
	
	var daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	
	for (var i=0; i<daysList.length; i++) {
		if (daysList[i] in business['hours']) {
			var openHour = business['hours'][daysList[i]]['open'];
			var closeHour = business['hours'][daysList[i]]['close'];
			if (parseInt(openHour.split(":")[0])>12) {
				openHour = parseInt(openHour.split(":")[0])-12 + ":" + openHour.split(":")[1] + "pm";
			}
			else {
				openHour = openHour + "am";
			}
			if (parseInt(closeHour.split(":")[0])>12) {
				closeHour = parseInt(closeHour.split(":")[0])-12 + ":" + closeHour.split(":")[1] + "pm";
			}
			else {
				closeHour = closeHour + "am";
			}
			hoursString += "<tr><td width=35% class='left'>" + daysList[i].substr(0,3) + "</td><td class='right'>" + openHour + " to " + closeHour + "</tr></td>";
		}
	}
	
	if (hoursString.length > 0) {
		hoursString = "Business Hours<br><table id='hourstable'>"+hoursString+"</table>";
		ratingSection.select("#hours").html(hoursString);
		ratingSection.select("#hours").style("display","block");
	}
	else {
		ratingSection.select("#hours").style("display","none");
	}
	
	console.log(business['attributes']);
	
	var attributesString = "<table>";
	
	for (var key in business['attributes']) {
		var formattedValue = "";
		if (typeof business['attributes'][key] === "boolean") {			
			if (business['attributes'][key] === false) {
				formattedValue = "<img height=15px width=15px src=\"static/images/false.png\"/>";
			}
			else {
				formattedValue = "<img height=15px width=15px src=\"static/images/true.png\"/>";
			}
		}
		else if (typeof business['attributes'][key] === "object") {			
			for(var subKey in business['attributes'][key]) {
				if (business['attributes'][key][subKey] === true) {
					formattedValue += subKey + ", ";
				}
			}
			if (formattedValue.length > 0) {
				formattedValue = formattedValue.substr(0, formattedValue.length-2);
			}
		}
		else {
			formattedValue = business['attributes'][key];
		}
		if(formattedValue.length > 0) {
			formattedValue = formattedValue.replace(/_/g, " ");
			attributesString += "<tr><td class='left' width=50%>" + key + "</td><td class='right' align='center'>" + formattedValue + "</tr></td>";	
		}
	}
	attributesString += "</table>";
						
	ratingSection.select("#attributes").html("More Info<br>" + attributesString);
	
	console.log(ratingSection.select("#hours").style("height"));
	
	ratingSection.select("#attributes").style("top",(parseInt(ratingSection.select("#hours").style("top")) + parseInt(ratingSection.select("#hours").style("height"))) + "px");

	var starRatingText = "<a href=\"#\" onclick=\"displayReviewsForBusiness('" + business['business_id'] + "'); return false;\">";
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
		starRatingText += "<span id=\"star-rating\" style=\"background: url('static/images/" + starImageUrl + "'); background-size: 100%;\"></span>";
	}
	
	starRatingText += "&nbsp;&nbsp;&nbsp;" + business['review_count'] + " reviews</a>";
	
	ratingSection.select("#rating").html(starRatingText);
	
	ratingSection.select("#address").text(business['full_address'].replace(/\n/g, ", "));
	
	if( isReviewsViewOpen() ) {
		loadReviewsForBusiness (business['business_id']);
	}
}

function displayClusteredBusinessDetails (responseObject) {

	d3.select("#individual-info-view").style("display", "none");
	d3.select("#clustered-info-view").style("display", "block");

	if ( ! isInfoViewOpen()) {
		toggleInfoView();
	}
		
// 	d3.select("#clustered-info-view").select("#name").text(responseObject['count'] + " businesses here");
	selectedBusinessTitle = responseObject['count'] + " businesses here";
	d3.select("#info-view-toggle-button-text").select("div").text(selectedBusinessTitle);
	
	updatePriceDistributionBarChart(responseObject);
	updateRatingsDistributionBarChart(responseObject);
	
	console.log(responseObject['count']);
	console.log(responseObject);
}

function displayReviewsForBusiness (businessId) {
	console.log(businessId);
	if( ! isReviewsViewOpen() ) {
		toggleReviewsView();
	}
	loadReviewsForBusiness (businessId);
}