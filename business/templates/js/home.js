var masterCategoryKeywords = ["Restaurants", "Food", "Bars", "Nightlife", "Arts & Entertainment", "Beauty & Spas", "Event Planning & Services", "Fitness & Instruction", "Active Life", "Local Services", "Professional Services", "Public Services & Government", "Financial Services", "Home Services", "Auto Repair", "Automotive", "Pets", "Health & Medical", "Shopping", "Specialty Schools", "Hotels & Travel", "Religious Organizations", "Unknown"];

var currentBusinesses = [];

var selectedBusinesses = ["Restaurants", "Food", "Bars", "Nightlife", "Arts & Entertainment", "Beauty & Spas", "Event Planning & Services", "Fitness & Instruction", "Active Life", "Local Services", "Professional Services", "Public Services & Government", "Financial Services", "Home Services", "Auto Repair", "Automotive", "Pets", "Health & Medical", "Shopping", "Specialty Schools", "Hotels & Travel", "Religious Organizations"];

$('html').click(function() {
	if ( isReviewsViewOpen() ) {
		toggleReviewsView();
	}
});

$('#reviews-view').click(function(event){
    event.stopPropagation();
});