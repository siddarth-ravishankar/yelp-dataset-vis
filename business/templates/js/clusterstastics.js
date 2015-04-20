// function loadReviewsForBusiness (businessId) {
// 
// 	var requestName = "get_reviews"	
// 	var attributesDictionary = {'business_id':businessId};
// 	
// 	d3.json(createRequestURL(requestName, attributesDictionary), function(error, json) {
// 
// 		if (error) {
// 			return console.warn(error);
// 		}
// 
// 		responseArray = json['response_object']
// 		addReviewsBarChart (responseArray);
// 		addReviewsScatterPlot (responseArray);
// 		
// 		addReviewsText (responseArray);
// 		
// 	});
// }
// 
// function addReviewsText (responseArray) {
// 
// 	var reviewsText = "";
// 	
// 	for(var i=responseArray.length-1; i>=0; i--) {
// 		reviewsText += getDivTextForReview (responseArray[i], i);
// 	}
// 	
// 	d3.select("#reviews-view").select("#reviews-section").select("#reviews-comments").html(reviewsText);
// 	
// }
// 
// function getDivTextForReview (review, reviewNumber) {
// 
// 	var reviewDivText = "<div id=\"comment" + reviewNumber + "\" onmouseout=removeHighlightScatterPlotPoint(\"" + reviewNumber + "\") onmouseover=highlightScatterPlotPoint(\"" + reviewNumber + "\")>";
// 	var ratingValue = review["stars"];
// 
// 	for(var i=0; i<5; i++) {
// 		var starImageUrl = "star_zero.png";
// 		if (ratingValue >= 1) {
// 			starImageUrl = "star_full.png";
// 		}
// 		ratingValue -= 1;
// 		reviewDivText += "<span id=\"star-rating\" style=\"background: url('static/images/" + starImageUrl + "'); background-size: 100%;\"></span>";
// 	}
// 		
// 	reviewDivText += "<span style=\"padding-left:80px; font-size: 13px;\">" + review["date"] + "</span><br><p>" + review["text"] + "</p></div>";
// 	
// 	return reviewDivText;
// }
// 
// function addReviewsScatterPlot (responseArray) {
// 
// 	d3.select("#reviews-distribution-scatterplot").html("");
// 		
// 		console.log(responseArray);		
// 
// 		var svgWidth = 260;
// 		var svgHeight = 200;
// 		var xAxisHeight = 10;
// 		var yAxisWidth = 10;
// 		
// 		var xAxisData = [];
// 		var yAxisData = [];
// 		
// 		for (var i=0; i<responseArray.length; i++) {
// 			if(responseArray[i]['date'] && responseArray[i]['stars'])
// 				xAxisData.push(responseArray[i]['date']);
// 				yAxisData.push(responseArray[i]['stars']);
// 		}
// 		var svgElement = d3.select("#reviews-distribution-scatterplot")
// 		.append("svg").attr({ width: svgWidth, height: svgHeight, style: "background-color: none"})
// 		
// 		
// 		
// 		for(var i=0; i<xAxisData.length-1; i++) {
// 			svgElement.append("line").attr({
// 				x1: yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 17.5,
// 				x2: yAxisWidth + (i+1) * (svgWidth-yAxisWidth) / xAxisData.length + 17.5,
// 				y1: (svgHeight-xAxisHeight) - yAxisData[i] * (svgHeight-xAxisHeight) / 5 + 17.5,
// 				y2: (svgHeight-xAxisHeight) - yAxisData[i+1] * (svgHeight-xAxisHeight) / 5 + 17.5,
// 				style: "stroke:steelblue;stroke-width:1;",
// 			});
// 		}
// 		
// 		svgElement.selectAll("circle").data(xAxisData).enter()
// 		.append("circle").attr({
// 			cx: function(d, i) { return yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 17.5; },
// 			cy: function(d, i) { return (svgHeight-xAxisHeight) - yAxisData[i] * (svgHeight-xAxisHeight) / 5 + 17.5; },
// 			r: 4.0,
// 			style: "fill:steelblue;opacity: 0.7;",
// 			id: function(d, i) { return "scatter-plot-circle" + i; }
// 		})
// 		.on({
// 			"mouseover": function (d, i) {
// 				highlightScatterPlotPoint(i);
// 				$("#reviews-comments").animate({ scrollTop: $("#reviews-comments").scrollTop() + $("#comment"+i).position().top }); //document.getElementById("reviews-view").getElementById("reviews-section").getElementById("reviews-comments").getElementById("comment"+i)
// 			},
// 			"mouseout": function (d, i) {
// 				removeHighlightScatterPlotPoint(i);
// 			}
// 		});
// 		
// 		var textGroups = svgElement.selectAll("g").data(xAxisData).enter().append("g").attr("id", function(d, i){return "text-group"+i;}).style("display","none");
// 		
// 		textGroups.append("rect").attr({
// 			x: function(d, i) {
// 				var xPos = yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length - 25;
// 				if (i==0) {
// 					xPos += 35;
// 				}
// 				else if(i==xAxisData.length-1) {
// 					xPos -= 25;
// 				}
// 				return xPos;
// 			},
// 			y: function(d, i) {
// 				var yPos = (svgHeight-xAxisHeight) - yAxisData[i] * (svgHeight-xAxisHeight) / 5 + 35 ;
// 				if (yAxisData[i]==1) {
// 					yPos -= 70;
// 				}
// 				return yPos;
// 			},
// 			height: 30,
// 			width: 70,
// 			fill: "rgba(246, 246, 246, 0.94)"
// 		});
// 		
// 		var textElement = textGroups.append("text").style({"font-size":"12px","fill":"steelblue"});		
// 		
// 		textElement.append("tspan").attr({
// 			x: function(d, i) {
// 				var xPos = yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length - 25;
// 				if (i==0) {
// 					xPos += 35;
// 				}
// 				else if(i==xAxisData.length-1) {
// 					xPos -= 25;
// 				}
// 				return xPos;
// 			},
// 			y: function(d, i) {
// 				var yPos = (svgHeight-xAxisHeight) - yAxisData[i] * (svgHeight-xAxisHeight) / 5 + 35 + 10; 
// 				if (yAxisData[i]==1) {
// 					yPos -= 70;
// 				}
// 				return yPos;
// 			}
// 		})
// 		.text(function(d, i) {return "Rated "+yAxisData[i]+"/5 on"});
// 		textElement.append("tspan").attr({
// 			x: function(d, i) {
// 			var xPos = yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length - 25;
// 			if (i==0) {
// 				xPos += 35;
// 			}
// 			else if(i==xAxisData.length-1) {
// 				xPos -= 25;
// 			}
// 			return xPos;
// 			},
// 			y: function(d, i) {
// 				var yPos = (svgHeight-xAxisHeight) - yAxisData[i] * (svgHeight-xAxisHeight) / 5 + 35 + 25;
// 				if (yAxisData[i]==1) {
// 					yPos -= 70;
// 				}
// 				return yPos;
// 			}
// 		})
// 		.text(function(d, i) {return xAxisData[i]});
// 		
// 		d3.select("#reviews-distribution-scatterplot").select("svg").append("text").attr({x: 110, y: svgHeight-2}).text("Time").style({"font-size":"12px","fill":"steelblue"});
// 		d3.select("#reviews-distribution-scatterplot").select("svg").append("text").attr({x: 2, y: 110, transform: "rotate(270 10,110)"}).text("Ratings").style({"font-size":"12px","fill":"steelblue"});
// 		
// 		for(var i=0; i<xAxisData.length; i++) {
// 			d3.select("#reviews-distribution-scatterplot").select("svg")
// 			.append("text").attr({
// 				 x: yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 15,
// 				 y: svgHeight-15 ,
// 			})
// 			.text(xAxisData[i].split("-")[1] + "/" + xAxisData[i].split("-")[0].substring(2,4))
// 			.style({"font-size":"8px","fill":"steelblue"});
// 		}
// }
// 
// function highlightScatterPlotPoint (i) {
// 	d3.select("#reviews-distribution-scatterplot").select("svg").select("#scatter-plot-circle"+i).attr({r: 8.0}).style({"opacity":"1.0"});
// 	d3.select("#reviews-distribution-scatterplot").select("svg").select("#text-group"+i).style("display","block");
// }
// 
// function removeHighlightScatterPlotPoint (i) {
// 	d3.select("#reviews-distribution-scatterplot").select("svg").select("#scatter-plot-circle"+i).attr({r: 4.0}).style({"opacity":"0.7"});
// 	d3.select("#reviews-distribution-scatterplot").select("svg").select("#text-group"+i).style("display","none");
// }

function addPriceDistributionBarChart (ratingWithPriceDistributionDictionary) {

		d3.select("#price-distribution-barchart").html("");
		
		var xAxisData = [1, 2, 3, 4];
		var yAxisData = [0, 0, 0, 0];

		var svgWidth = parseInt(d3.select("#price-distribution-barchart").style("width"))-10;
		var svgHeight = parseInt(d3.select("#price-distribution-barchart").style("height"))-10;
		var xAxisHeight = 50;
		var yAxisWidth = 30;
		
		var totalBusinessesInPriceDistribution = 0;
		
		for (var rating in ratingWithPriceDistributionDictionary) {
			for(var i=0; i<xAxisData.length; i++) {
				yAxisData[i] += ratingWithPriceDistributionDictionary[rating][xAxisData[i]];
				totalBusinessesInPriceDistribution += ratingWithPriceDistributionDictionary[rating][xAxisData[i]];
			}
		}
		
		d3.select("#price-distribution-barchart")
		.append("svg").attr({ width: svgWidth, height: svgHeight, style: "background-color: none"})
		.selectAll("rect").data(xAxisData).enter()
		.append("rect").attr({
			x: function(d,i) { return yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 2.5 },
			y: function(d,i) { return (svgHeight-xAxisHeight) - (yAxisData[i] / totalBusinessesInPriceDistribution) * (svgHeight-xAxisHeight) },
			width: Math.ceil( (svgWidth-yAxisWidth) / xAxisData.length - 5),
			height: function(d,i) { return (yAxisData[i] / totalBusinessesInPriceDistribution) * (svgHeight-xAxisHeight) }
		})
		.style({"fill":"steelblue"});
			 
		d3.select("#price-distribution-barchart")
		.select("svg")
		.selectAll("text").data(xAxisData).enter()
		.append("text").attr({
			 x: function(d,i) { return yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + (64-yAxisData[i].toString().length*4)/2},
			 y: function(d,i) { return (svgHeight-xAxisHeight) - (yAxisData[i] / totalBusinessesInPriceDistribution) * (svgHeight-xAxisHeight) - 10 },
			 })
		.text(function(d,i) { if(yAxisData[i]>0)return yAxisData[i]; else return "";})
		.style({"font-size":"10px","fill":"steelblue"});
		
		d3.select("#price-distribution-barchart").select("svg").append("text").attr({x: 140, y: svgHeight}).text("Price Range").style({"font-size":"12px","fill":"steelblue"});
		d3.select("#price-distribution-barchart").select("svg").append("text").attr({x: 2, y: 140, transform: "rotate(270 10,140)"}).text("Businesses Count").style({"font-size":"12px","fill":"steelblue"});

		for(var i=0; i<xAxisData.length; i++) {
		d3.select("#price-distribution-barchart").select("svg")
			.append("image")
			.attr('x',yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 20)
			.attr('y',svgHeight-40 - (4-xAxisData[i]))
			.attr('width', 25)
			.attr('height', 25)
			.attr("xlink:href","static/images/pricerange" + xAxisData[i] + ".png");
		}
}

function addRatingsDistributionBarChart (ratingWithPriceDistributionDictionary) {

		d3.select("#cluster-ratings-distribution-chart").html("");
		
		var xAxisData = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
		var yAxisData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		var svgWidth = parseInt(d3.select("#cluster-ratings-distribution-chart").style("width"))-10;
		var svgHeight = parseInt(d3.select("#cluster-ratings-distribution-chart").style("height"))-10;
		var xAxisHeight = 45;
		var yAxisWidth = 30;
		
		var totalBusinessesInRatingsDistribution = 0;
		
		for(var i=0; i<xAxisData.length; i++) {		
			for (var priceRange in ratingWithPriceDistributionDictionary[xAxisData[i]]) {
				yAxisData[i] += ratingWithPriceDistributionDictionary[xAxisData[i]][priceRange];
			}
			totalBusinessesInRatingsDistribution += yAxisData[i];
		}
		
		d3.select("#cluster-ratings-distribution-chart")
		.append("svg").attr({ width: svgWidth, height: svgHeight, style: "background-color: none"})
		.selectAll("rect").data(xAxisData).enter()
		.append("rect").attr({
			x: function(d,i) { return yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 2.5 },
			y: function(d,i) { return (svgHeight-xAxisHeight) - (yAxisData[i] / totalBusinessesInRatingsDistribution) * (svgHeight-xAxisHeight) + 15 },
			width: Math.ceil( (svgWidth-yAxisWidth) / xAxisData.length - 5),
			height: function(d,i) { return (yAxisData[i] / totalBusinessesInRatingsDistribution) * (svgHeight-xAxisHeight) }
		})
		.style({"fill":"steelblue"});
			 
		d3.select("#cluster-ratings-distribution-chart")
		.select("svg")
		.selectAll("text").data(xAxisData).enter()
		.append("text").attr({
			 x: function(d,i) { return yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + (24-yAxisData[i].toString().length*4)/2},
			 y: function(d,i) { return (svgHeight-xAxisHeight) - (yAxisData[i] / totalBusinessesInRatingsDistribution) * (svgHeight-xAxisHeight) + 5 },
			 })
		.text(function(d,i) { if(yAxisData[i]>0)return yAxisData[i]; else return "";})
		.style({"font-size":"10px","fill":"steelblue"});
		
		d3.select("#cluster-ratings-distribution-chart").select("svg").append("text").attr({x: 140, y: svgHeight}).text("Stars").style({"font-size":"12px","fill":"steelblue"});
		d3.select("#cluster-ratings-distribution-chart").select("svg").append("text").attr({x: 2, y: 140, transform: "rotate(270 10,140)"}).text("Businesses Count").style({"font-size":"12px","fill":"steelblue"});

		for(var i=0; i<xAxisData.length; i++) {
			d3.select("#cluster-ratings-distribution-chart").select("svg")
			.append("text").attr({
				 x: yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 10,
				 y: svgHeight-15 ,
			})
			.text(xAxisData[i])
			.style({"font-size":"12px","fill":"steelblue"});
		}
}

function displayPriceDistributionBarChart () {
	d3.select("#cluster-ratings-distribution-chart").transition().duration(500).style("left", "350px");	
	d3.select("#price-distribution-barchart").transition().duration(500).style("left", "5px");
	
	d3.select("#price-distribution-barchart-heading").attr("class", "heading-selected");
	d3.select("#cluster-ratings-distribution-chart-heading").attr("class", "heading-unselected");
}

function displayCategoryDistributionChart () {
	d3.select("#cluster-ratings-distribution-chart").transition().duration(500).style("left", "5px");
	d3.select("#price-distribution-barchart").transition().duration(500).style("left", "-350px");

	d3.select("#cluster-ratings-distribution-chart-heading").attr("class", "heading-selected");
	d3.select("#price-distribution-barchart-heading").attr("class", "heading-unselected");
}