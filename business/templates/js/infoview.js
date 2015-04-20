var selectedBusinessTitle = "Show Info";

function toggleInfoView () {
	d3.select("#info-view-toggle-button-text").style("display", "block");
	var infoViewToggleButtonText = "Hide Info";
	var infoViewToggleButtonIconClass = "glyphicon glyphicon-collapse-up";
	var infoViewHeight = d3.select("#info-view").style("max-height");
	if ( parseInt(d3.select("#info-view").style("height")) > 0) {
		infoViewHeight = "0px";
		infoViewToggleButtonText = selectedBusinessTitle;
		infoViewToggleButtonIconClass = "glyphicon glyphicon-collapse-down";
	}
	d3.select("#info-view").transition().duration(1000).style("height", infoViewHeight);
	d3.select("#info-view-toggle-button-text").select("div").text(infoViewToggleButtonText);
	d3.select("#info-view-toggle-button-text").select("span").attr("class", infoViewToggleButtonIconClass);
}

function isInfoViewOpen () {
	return ( parseInt(d3.select("#info-view").style("height")) > 0)
}

function displayBusinessDetails (business) {

	selectedBusinessTitle = business['name'];

	d3.select("#individual-info-view").style("display", "block");
	d3.select("#clustered-info-view").style("display", "none");

	if ( ! isInfoViewOpen()) {
		toggleInfoView();
	}

	var ratingSection = d3.select("#individual-info-view").select("#rating-section");
	
	ratingSection.select("#name").text(business['name']);
	
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
		
	d3.select("#clustered-info-view").select("#name").text(responseObject['count'] + " businesses here");
	selectedBusinessTitle = responseObject['count'] + " businesses here";
	
	addPriceDistributionBarChart(responseObject['rating_with_price_range_info']);
	addRatingsDistributionBarChart(responseObject['rating_with_price_range_info']);
	
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