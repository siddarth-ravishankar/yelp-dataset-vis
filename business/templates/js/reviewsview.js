function toggleReviewsView () {

	var reviewsViewHeight = d3.select("#reviews-view").style("max-height");
	var reviewsViewWidth = d3.select("#reviews-view").style("max-width");

	var reviewsSectionHeight = d3.select("#reviews-section").style("max-height");
	var reviewsSectionWidth = d3.select("#reviews-section").style("max-width");
	
	if ( parseInt(d3.select("#reviews-view").style("height")) > 0) {
		reviewsViewHeight = "0px";
		reviewsViewWidth = "0px";
		reviewsSectionHeight = "0px";
		reviewsSectionWidth = "0px";
	}
	d3.select("#reviews-view").transition().duration(1000).style("height", reviewsViewHeight).style("width", reviewsViewWidth);
	d3.select("#reviews-section").transition().duration(1000).style("height", reviewsSectionHeight).style("width", reviewsSectionWidth);
	
}

function isReviewsViewOpen () {
	return ( parseInt(d3.select("#reviews-view").style("height")) > 0)
}

function loadReviewsForBusiness (businessId) {

	var requestName = "get_reviews"	
	var attributesDictionary = {'business_id':businessId};
	
	d3.json(createRequestURL(requestName, attributesDictionary), function(error, json) {

		if (error) {
			return console.warn(error);
		}

		responseArray = json['response_object']
		addReviewsBarChart (responseArray);
		addReviewsScatterPlot (responseArray);
		
		addReviewsText (responseArray);
		
	});
}

function addReviewsText (responseArray) {

	var reviewsText = "";
	
	var segmentSize = 1;
	
	if (responseArray.length > 15) {
		segmentSize = Math.ceil( responseArray.length / 15 );
	}
	
	for(var i=responseArray.length-1; i>=0; i--) {
		reviewsText += getDivTextForReview (responseArray[i], i, segmentSize);
	}
	
	d3.select("#reviews-view").select("#reviews-section").select("#reviews-comments").html(reviewsText);
	
}

function getDivTextForReview (review, reviewNumber, segmentSize) {

	var reviewDivText = "<div id=\"comment" + reviewNumber + "\" onmouseout=removeHighlightScatterPlotPoint(\"" + Math.floor(reviewNumber/segmentSize) + "\") onmouseover=highlightScatterPlotPoint(\"" + Math.floor(reviewNumber/segmentSize) + "\")>";
	var ratingValue = review["stars"];

	for(var i=0; i<5; i++) {
		var starImageUrl = "star_zero.png";
		if (ratingValue >= 1) {
			starImageUrl = "star_full.png";
		}
		ratingValue -= 1;
		reviewDivText += "<span id=\"star-rating\" style=\"background: url('static/images/" + starImageUrl + "'); background-size: 100%;\"></span>";
	}
		
	reviewDivText += "<span style=\"padding-left:80px; font-size: 13px;\">" + review["date"] + "</span><br><p>" + review["text"] + "</p></div>";
	
	return reviewDivText;
}

function addReviewsScatterPlot (responseArray) {

	d3.select("#reviews-distribution-scatterplot").html("");
		
		console.log(responseArray);
		
		var svgWidth = parseInt(d3.select("#reviews-distribution-scatterplot").style("width"))-10;
		var svgHeight = parseInt(d3.select("#reviews-distribution-scatterplot").style("height"))-10;
		var xAxisHeight = 10;
		var yAxisWidth = 10;
		
		var xAxisData = [];
		var yAxisData = [];
		
		var segmentSize = 1;
		
		if (responseArray.length > 15) {		
			segmentSize = Math.ceil( responseArray.length / 15 );
		}
			var i=0;
			while(i<responseArray.length) {
				var totalStarCount = 0;
				var businessesCount = 0;
				var date = responseArray[i]['date'];
				for(var j=0; j<segmentSize && i<responseArray.length; j++, i++) {
					if(responseArray[i]['date'] && responseArray[i]['stars']) {
						totalStarCount += responseArray[i]['stars'];
						businessesCount += 1;
					}
				}
				xAxisData.push(date);
				yAxisData.push(totalStarCount/businessesCount);
			}
		
		var svgElement = d3.select("#reviews-distribution-scatterplot")
		.append("svg").attr({ width: svgWidth, height: svgHeight, style: "background-color: none"})
		
		for(var i=0; i<xAxisData.length-1; i++) {
			svgElement.append("line").attr({
				x1: yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 17.5,
				x2: yAxisWidth + (i+1) * (svgWidth-yAxisWidth) / xAxisData.length + 17.5,
				y1: (svgHeight-xAxisHeight) - yAxisData[i] * (svgHeight-xAxisHeight) / 5 + 17.5,
				y2: (svgHeight-xAxisHeight) - yAxisData[i+1] * (svgHeight-xAxisHeight) / 5 + 17.5,
				style: "stroke:steelblue;stroke-width:1;",
			});
		}
		
		svgElement.selectAll("circle").data(xAxisData).enter()
		.append("circle").attr({
			cx: function(d, i) { return yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 17.5; },
			cy: function(d, i) { return (svgHeight-xAxisHeight) - yAxisData[i] * (svgHeight-xAxisHeight) / 5 + 17.5; },
			r: 4.0,
			style: "fill:steelblue;opacity: 0.7;",
			id: function(d, i) { return "scatter-plot-circle" + i; }
		})
		.on({
			"mouseover": function (d, i) {
				highlightScatterPlotPoint(i);
				console.log("Scrolling to #comment"+i*segmentSize);
				$("#reviews-comments").animate({ scrollTop: $("#reviews-comments").scrollTop() + $("#comment"+i*segmentSize).position().top });
			},
			"mouseout": function (d, i) {
				removeHighlightScatterPlotPoint(i);
			}
		});
		
		var textGroups = svgElement.selectAll("g").data(xAxisData).enter().append("g").attr("id", function(d, i){return "text-group"+i;}).style("display","none");
		
		textGroups.append("rect").attr({
			x: function(d, i) {
				var xPos = yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length - 25;
				if (i==0) {
					xPos += 35;
				}
				else if(i==xAxisData.length-1) {
					xPos -= 25;
				}
				return xPos;
			},
			y: function(d, i) {
				var yPos = (svgHeight-xAxisHeight) - yAxisData[i] * (svgHeight-xAxisHeight) / 5 + 35 ;
				if (yAxisData[i]==1) {
					yPos -= 70;
				}
				return yPos;
			},
			height: 30,
			width: 70,
			fill: "rgba(246, 246, 246, 0.94)"
		});
		
		var textElement = textGroups.append("text").style({"font-size":"12px","fill":"steelblue"});		
		
		textElement.append("tspan").attr({
			x: function(d, i) {
				var xPos = yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length - 25;
				if (i==0) {
					xPos += 35;
				}
				else if(i==xAxisData.length-1) {
					xPos -= 25;
				}
				return xPos;
			},
			y: function(d, i) {
				var yPos = (svgHeight-xAxisHeight) - yAxisData[i] * (svgHeight-xAxisHeight) / 5 + 35 + 10; 
				if (yAxisData[i]==1) {
					yPos -= 70;
				}
				return yPos;
			}
		})
		.text(function(d, i) {return "Rated "+yAxisData[i].toFixed(2)+"/5 on"});
		textElement.append("tspan").attr({
			x: function(d, i) {
			var xPos = yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length - 25;
			if (i==0) {
				xPos += 35;
			}
			else if(i==xAxisData.length-1) {
				xPos -= 25;
			}
			return xPos;
			},
			y: function(d, i) {
				var yPos = (svgHeight-xAxisHeight) - yAxisData[i] * (svgHeight-xAxisHeight) / 5 + 35 + 25;
				if (yAxisData[i]==1) {
					yPos -= 70;
				}
				return yPos;
			}
		})
		.text(function(d, i) {return xAxisData[i]});
		
		d3.select("#reviews-distribution-scatterplot").select("svg").append("text").attr({x: 150, y: svgHeight-2}).text("Time").style({"font-size":"12px","fill":"steelblue"});
		d3.select("#reviews-distribution-scatterplot").select("svg").append("text").attr({x: 2, y: 110, transform: "rotate(270 10,110)"}).text("Ratings").style({"font-size":"12px","fill":"steelblue"});
		
		var i=0;
		while (i<xAxisData.length) {		
			d3.select("#reviews-distribution-scatterplot").select("svg")
			.append("text").attr({
				 x: yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length,
				 y: svgHeight-15 ,
			})
			.text(xAxisData[i].split("-")[1] + "/" + xAxisData[i].split("-")[0].substring(2,4))
			.style({"font-size":"8px","fill":"steelblue"});
			i += 1;			
			if (xAxisData.length > 10) {
				i += 1;
			}
		}
}

function highlightScatterPlotPoint (i) {
	d3.select("#reviews-distribution-scatterplot").select("svg").select("#scatter-plot-circle"+i).attr({r: 8.0}).style({"opacity":"1.0"});
	d3.select("#reviews-distribution-scatterplot").select("svg").select("#text-group"+i).style("display","block");
}

function removeHighlightScatterPlotPoint (i) {
	d3.select("#reviews-distribution-scatterplot").select("svg").select("#scatter-plot-circle"+i).attr({r: 4.0}).style({"opacity":"0.7"});
	d3.select("#reviews-distribution-scatterplot").select("svg").select("#text-group"+i).style("display","none");
}

function addReviewsBarChart (responseArray) {

		d3.select("#reviews-distribution-barchart").html("");
		
		var ratingsArray = [0, 0, 0, 0, 0];
		for (var i=0; i<responseArray.length; i++) {
			if(responseArray[i]['stars'])
				ratingsArray[responseArray[i]['stars']-1]++;
		}
		
		var svgWidth = parseInt(d3.select("#reviews-distribution-barchart").style("width"))-10;
		var svgHeight = parseInt(d3.select("#reviews-distribution-barchart").style("height"))-10;

		var xAxisHeight = 30;
		var yAxisWidth = 10;
		
		d3.select("#reviews-distribution-barchart")
		.append("svg").attr({ width: svgWidth, height: svgHeight, style: "background-color: none"})
		.selectAll("rect").data(ratingsArray).enter()
		.append("rect").attr({
			x: function(d,i) { return yAxisWidth + i * (svgWidth-yAxisWidth) / ratingsArray.length + 2.5 },
			y: function(d) { return (svgHeight-xAxisHeight) - (d / responseArray.length) * (svgHeight-xAxisHeight) },
			width: Math.ceil( (svgWidth-yAxisWidth) / ratingsArray.length - 5),
			height: function(d) { return (d / responseArray.length) * (svgHeight-xAxisHeight) }
		})
		.style({"fill":"steelblue"});
			 
		d3.select("#reviews-distribution-barchart")
		.select("svg")
		.selectAll("text").data(ratingsArray).enter()
		.append("text").attr({
			 x: function(d,i) { return yAxisWidth + i * (svgWidth-yAxisWidth) / ratingsArray.length + (44-d.toString().length*4)/2},
			 y: function(d) { return (svgHeight-xAxisHeight) - (d / responseArray.length) * (svgHeight-xAxisHeight) + 10 },
			 })
		.text(function(d) { if(d>0)return d; else return "";})
		.style({"font-size":"10px","fill":"white"});
		
		d3.select("#reviews-distribution-barchart").select("svg").append("text").attr({x: 150, y: svgHeight-2}).text("Rating").style({"font-size":"12px","fill":"steelblue"});
		d3.select("#reviews-distribution-barchart").select("svg").append("text").attr({x: 2, y: 110, transform: "rotate(270 10,110)"}).text("Count").style({"font-size":"12px","fill":"steelblue"});

		for(var i=0; i<ratingsArray.length; i++) {
			d3.select("#reviews-distribution-barchart").select("svg")
			.append("text").attr({
				 x: yAxisWidth + i * (svgWidth-yAxisWidth) / ratingsArray.length + 20,
				 y: svgHeight-15 ,
			})
			.text(i+1)
			.style({"font-size":"12px","fill":"steelblue"});
		}
}

function displayBarChart () {
	d3.select("#reviews-distribution-scatterplot").transition().duration(500).style("left", "350px");	
	d3.select("#reviews-distribution-barchart").transition().duration(500).style("left", "5px");
	
	d3.select("#reviews-barchart-heading").attr("class", "heading-selected");
	d3.select("#reviews-scatterplot-heading").attr("class", "heading-unselected");
}

function displayScatterPlot () {
	d3.select("#reviews-distribution-scatterplot").transition().duration(500).style("left", "5px");
	d3.select("#reviews-distribution-barchart").transition().duration(500).style("left", "-350px");

	d3.select("#reviews-scatterplot-heading").attr("class", "heading-selected");
	d3.select("#reviews-barchart-heading").attr("class", "heading-unselected");
}