var reviewsDictionary = {};

getReviewsResponseForBusinessObjectAtIndex(0);

function getReviewsResponseForBusinessObjectAtIndex (index) {

	var requestURL = "get_reviews?business_id="+businessIdArray[index];
	
	d3.json(requestURL, function(error, json) {

		if (error) {
			return console.warn(error);
		}

		responseArray = json['response_object']
		reviewsDictionary[businessIdArray[index]] = responseArray;
		
		if (index < businessIdArray.length-1) {
			getReviewsResponseForBusinessObjectAtIndex (index+1);
		}
		else {
			displayGraph();
		}
	});
}

var dataForBarChart = [];
var titleForStackedBarChart = [];

var xAxisDataArrayForLinePlot = [];
var yAxisDataArrayForLinePlot = [];

var colorArray = ["#1E5D9E", "#B03130", "#80B32B", "#66427F", "#E01A1F", "#2089A3", "#EF7127", "#7999C7", "#9E3287"];

function displayGraph() {
	
	for(var k in reviewsDictionary) {

		var row = [0,0,0,0,0];
		var currentReviewsArray = reviewsDictionary[k];
		for(var i=0; i<currentReviewsArray.length; i++) {
			if(currentReviewsArray[i]['stars']) {
				row[currentReviewsArray[i]['stars']-1]++;
			}
		}
		dataForBarChart.push(row);
		titleForStackedBarChart.push(businessDetailsDictionary[k]['name']);
		
		var currentReviewDateArray = [];
		var currentReviewStarsArray = [];
		
		for(var currentRowNo=0; currentRowNo<currentReviewsArray.length; currentRowNo++) {
			if ( currentReviewsArray[currentRowNo]["date"] && currentReviewsArray[currentRowNo]["stars"] ) {
				currentReviewDateArray.push(currentReviewsArray[currentRowNo]["date"]);
				currentReviewStarsArray.push(currentReviewsArray[currentRowNo]["stars"]);
			}
		}
		xAxisDataArrayForLinePlot.push(currentReviewStarsArray);
		yAxisDataArrayForLinePlot.push(currentReviewDateArray);
	}
	
	addBarChart ();
	addLinePlot ();
	addScatterPlot ();
}

function addScatterPlot () {

	var svgWidth = parseInt(d3.select("#comparison-scatterplot").style("width"))-10;
	var svgHeight = parseInt(d3.select("#comparison-scatterplot").style("height"))-10;
	var xAxisHeight = 10;
	var yAxisWidth = 90;
	
	var svgElement = d3.select("#comparison-scatterplot")
	.append("svg").attr({ width: svgWidth, height: svgHeight, style: "background-color: none"})
	
	d3.select("#comparison-scatterplot").select("svg").append("text").attr({x: 2, y: svgHeight/2-10, transform: "rotate(270 10,"+(svgHeight/2-10)+")"}).text("Votes").style({"font-size":"12px","fill":"steelblue"});
	
	svgElement.append("rect").attr({
		x: 740,
		y: 5,
		width: 500,
		height: 100,
	})
	.style({"fill":"white"});
	
	for(var i=0; i<titleForStackedBarChart.length; i++) {
		svgElement.append("text")
		.style({"font-size":"12px","fill":"steelblue"})
		.each(function () {
		var arr = [];
		if(titleForStackedBarChart[i].length<15) {
			arr.push(titleForStackedBarChart[i]);
		}
		else {
			var midPos = Math.floor(titleForStackedBarChart[i].length/2);
			var leftPtr = rightPtr = midPos;
			while( leftPtr>0 && titleForStackedBarChart[i][leftPtr]!=" " && rightPtr<titleForStackedBarChart[i].length && titleForStackedBarChart[i][rightPtr]!=" ") {
				leftPtr--; rightPtr++;
			}
			if (titleForStackedBarChart[i][leftPtr]==" " && leftPtr>0) {
				arr.push(titleForStackedBarChart[i].substring(0,leftPtr));
				arr.push(titleForStackedBarChart[i].substring(leftPtr+1,titleForStackedBarChart[i].length));
			}
			else if(rightPtr<titleForStackedBarChart[i].length) {
				arr.push(titleForStackedBarChart[i].substring(0,rightPtr));
				arr.push(titleForStackedBarChart[i].substring(rightPtr+1,titleForStackedBarChart[i].length));
			}
		}
		if (arr != undefined) {
			for (j = 0; j < arr.length; j++) {
				d3.select(this).append("tspan")
					.html(arr[j])
					.attr("dy", j * 0.8 + "em")
					.attr("x", 735+45 + (i%3)*160)
					.attr("text-anchor", "left")
					.attr("y", 40 + (Math.floor(i/3)*25))
					}
				}
			});
			
		svgElement.append("circle").attr({
			cx: 735+20 + (i%3)*160 + 3,
			cy: 30 + (Math.floor(i/3)*25) + 6,
			fill: colorArray[i],
			r: 4
		});
	}
	
	svgWidth = 750;
	
	var segmentWidth = svgWidth / 5;	
		
	d3.select("#comparison-scatterplot").select("svg").append("line").attr({
		x1: 20,
		y1: 10,
		x2: 20,
		y2: svgHeight,
		style: "stroke:black;stroke-width:2;opacity: 0.4;",
	});
	d3.select("#comparison-scatterplot").select("svg").append("line").attr({
		x1: 5,
		y1: svgHeight-20,
		x2: svgWidth,
		y2: svgHeight-20,
		style: "stroke:black;stroke-width:2;opacity: 0.4;",
	});
	
	var countArray = [];
	
	for(var i=0; i<xAxisDataArrayForLinePlot.length; i++) {
		countArray.push(xAxisDataArrayForLinePlot[i].length);
	}
	
	for(var i=0; i<xAxisDataArrayForLinePlot.length; i++) {
		var currentRow = xAxisDataArrayForLinePlot[i];
		var avgRating = d3.mean(currentRow);
		
		var currentBusinessGroup = d3.select("#comparison-scatterplot").select("svg").append("g").attr({
			id: "scatter-plot-business-group-"+i,
		});
		
		currentBusinessGroup.append("circle").attr({
			cx: (Math.floor(avgRating)-1) * segmentWidth + (segmentWidth / 2) + (avgRating - Math.floor(avgRating)) * segmentWidth,
			cy: (svgHeight-50-20) - (svgHeight-140) *  (countArray[i]/d3.max(countArray)),
			r: 5,
			style: "fill:" + colorArray[i] + ";opacity: 0.5;",
			id: i,
		}).on({
			"mouseover": function () {
				highlightScatterPlotPoint(this);
			},
			"mouseout": function () {
				removeHighlightScatterPlotPoint(this);
			}
		});
		
		currentBusinessGroup.append("line").attr({
			x1: (Math.floor(avgRating)-1) * segmentWidth + (segmentWidth / 2) + (avgRating - Math.floor(avgRating)) * segmentWidth,
			y1: (svgHeight-50-20) - (svgHeight-140) *  (countArray[i]/d3.max(countArray)),
			x2: (Math.floor(avgRating)-1) * segmentWidth + (segmentWidth / 2) + (avgRating - Math.floor(avgRating)) * segmentWidth,
			y2: svgHeight-20,
			style: "stroke:black;stroke-width:2;opacity: 0.8;display:none;",
		});

		currentBusinessGroup.append("text").attr({
			x: 5 + (Math.floor(avgRating)-1) * segmentWidth + (segmentWidth / 2) + (avgRating - Math.floor(avgRating)) * segmentWidth,
			y: (svgHeight-25),
		})
		.text("Rated " + avgRating.toFixed(2))
		.style({"font-size":"12px","fill":"steelblue","display":"none"});
		
		currentBusinessGroup.append("line").attr({
			x1: (Math.floor(avgRating)-1) * segmentWidth + (segmentWidth / 2) + (avgRating - Math.floor(avgRating)) * segmentWidth,
			y1: (svgHeight-50-20) - (svgHeight-140) *  (countArray[i]/d3.max(countArray)),
			x2: 20,
			y2: (svgHeight-50-20) - (svgHeight-140) *  (countArray[i]/d3.max(countArray)),
			style: "stroke:black;stroke-width:2;opacity: 0.8;display:none;",
		});
		
		currentBusinessGroup.append("text").attr({
			x: 25,
			y: (svgHeight-50-20) - (svgHeight-140) *  (countArray[i]/d3.max(countArray)) - 10,
		})
		.text("on " + currentRow.length + " votes")
		.style({"font-size":"12px","fill":"steelblue","display":"none"});
	}
	
	var maxCount = d3.max(countArray);
	
	for(var i=0, vote=0; i<=5; i++, vote = Math.ceil(vote + maxCount/5)) {
		d3.select("#comparison-scatterplot").select("svg").append("text").attr({
			x: 2,
			y: (svgHeight-50-20) - (svgHeight-140) *  (vote/d3.max(countArray)),
		})
		.text(vote)
		.style({"font-size":"12px","fill":"steelblue"});
	}
	
	for(var i=0; i<5; i++) {
		for(var j=0; j<5; j++) {
			var imgName;
			if(j<=i)
				imgName = "star_full";
			else
				imgName = "star_zero";
				
			d3.select("#comparison-scatterplot").select("svg").append("image").attr({
				x: i * segmentWidth + (segmentWidth / 4) + j*15,
				y: svgHeight-15,
				width: 15,
				height: 15,
				})
				.attr("xlink:href","static/images/" + imgName + ".png");
		}		
	}	
}

function highlightScatterPlotPoint (circle) {
	var businessGroupId = parseInt(d3.select(circle).attr("id"));
	var currentBusinessGroup = d3.select("#comparison-scatterplot").select("svg").select("#scatter-plot-business-group-"+businessGroupId);
	currentBusinessGroup.selectAll("circle").attr({r: 8.0}).style({"opacity":"1.0"});
	currentBusinessGroup.selectAll("line").style({"display": "block"});
	currentBusinessGroup.selectAll("text").style({"display": "block"});
}

function removeHighlightScatterPlotPoint (circle) {
	var businessGroupId = parseInt(d3.select(circle).attr("id"));
	var currentBusinessGroup = d3.select("#comparison-scatterplot").select("svg").select("#scatter-plot-business-group-"+businessGroupId);
	currentBusinessGroup.selectAll("circle").attr({r: 5.0}).style({"opacity":"0.5"});
	currentBusinessGroup.selectAll("line").style({"display": "none"});
	currentBusinessGroup.selectAll("text").style({"display": "none"});	
}

function addLinePlot () {

	var svgWidth = parseInt(d3.select("#comparison-lineplot").style("width"))-10;
	var svgHeight = parseInt(d3.select("#comparison-lineplot").style("height"))-10;
	var xAxisHeight = 10;
	var yAxisWidth = 90;
	
	var svgElement = d3.select("#comparison-lineplot")
	.append("svg").attr({ width: svgWidth, height: svgHeight, style: "background-color: none"})
	
	for(var currentBusinessId = 0; currentBusinessId<xAxisDataArrayForLinePlot.length; currentBusinessId++) {
	
		var xAxisData = [];
		var yAxisData = [];
	
		var segmentSize = 1;

		if (xAxisDataArrayForLinePlot[currentBusinessId].length > 15) {
			segmentSize = Math.ceil( xAxisDataArrayForLinePlot[currentBusinessId].length / 15 );
		}
		
		var i=0;
		while(i<xAxisDataArrayForLinePlot[currentBusinessId].length) {
		
			var totalStarCount = 0;
			var businessesCount = 0;
			var date = yAxisDataArrayForLinePlot[currentBusinessId][i];
			for(var j=0; j<segmentSize && i<xAxisDataArrayForLinePlot[currentBusinessId].length; j++, i++) {				
				totalStarCount += xAxisDataArrayForLinePlot[currentBusinessId][i];
				businessesCount += 1;
			}
			xAxisData.push(date);
			yAxisData.push(totalStarCount/businessesCount);
		}
		
		var currentBusinessGroup = svgElement.append("g").attr({id: "businessGroup"+currentBusinessId});
		
		for(var i=0; i<xAxisData.length-1; i++) {
			currentBusinessGroup.append("line").attr({
				x1: yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 17.5,
				x2: yAxisWidth + (i+1) * (svgWidth-yAxisWidth) / xAxisData.length + 17.5,
				y1: (svgHeight-xAxisHeight-90) - yAxisData[i] * (svgHeight-xAxisHeight-90) / 5 + 17.5 + 110,
				y2: (svgHeight-xAxisHeight-90) - yAxisData[i+1] * (svgHeight-xAxisHeight-90) / 5 + 17.5 + 110,
				style: "stroke:" + colorArray[currentBusinessId] + ";stroke-width:2;opacity: 0.4;",
			});
		}
		
		for(var i=0; i<xAxisData.length; i++) {	
			currentBusinessGroup.append("circle").attr({
				cx: yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 17.5,
				cy: (svgHeight-xAxisHeight-90) - yAxisData[i] * (svgHeight-xAxisHeight-90) / 5 + 17.5 + 110,
				r: 6.0,
				style: "fill:" + colorArray[currentBusinessId] + ";opacity: 0.5;",
				id: "line-plot-circle-" + currentBusinessId + "-" + i
			})
			.on({
				"mouseover": function () {
					highlightLinePlotPoint(this);
				},
				"mouseout": function () {
					removeHighlightLinePlotPoint(this);
				}
			})
			;
			
		currentBusinessGroup.append("rect").attr({
			x: function() {
				var xPos = yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length - 25;
				if (i==0) {
					xPos += 35;
				}
				else if(i==xAxisData.length-1) {
					xPos -= 25;
				}
				return xPos;
			},
			y: function() {
				var yPos = (svgHeight-xAxisHeight-90) - yAxisData[i] * (svgHeight-xAxisHeight-90) / 5 + 35 + 110;
				if (yAxisData[i]==1) {
					yPos -= 70;
				}
				return yPos;
			},
			height: 30,
			width: 70,
			fill: "rgba(246, 246, 246, 0.94)"			
		}).style({"display": "none"});
		
		var textElement = currentBusinessGroup.append("text").style({"font-size":"12px","fill":"steelblue","display":"none"});
		
		textElement.append("tspan").attr({
			x: function() {
				var xPos = yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length - 25;
				if (i==0) {
					xPos += 35;
				}
				else if(i==xAxisData.length-1) {
					xPos -= 25;
				}
				return xPos;
			},
			y: function() {
				var yPos = (svgHeight-xAxisHeight-90) - yAxisData[i] * (svgHeight-xAxisHeight-90) / 5 + 35 + 10 + 110; 
				if (yAxisData[i]==1) {
					yPos -= 70;
				}
				return yPos;
			}
		})
		.text(function() {return "Rated "+yAxisData[i].toFixed(2)+"/5 on"});
		textElement.append("tspan").attr({
			x: function() {
			var xPos = yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length - 25;
			if (i==0) {
				xPos += 35;
			}
			else if(i==xAxisData.length-1) {
				xPos -= 25;
			}
			return xPos;
			},
			y: function() {
				var yPos = (svgHeight-xAxisHeight-90) - yAxisData[i] * (svgHeight-xAxisHeight-90) / 5 + 35 + 25 + 110;
				if (yAxisData[i]==1) {
					yPos -= 70;
				}
				return yPos;
			}
		})
		.text(xAxisData[i]);
		
		}
	}
	
	d3.select("#comparison-lineplot").select("svg").append("text").attr({x: svgWidth/2-10, y: svgHeight-3}).text("Time").style({"font-size":"12px","fill":"steelblue"});
	d3.select("#comparison-lineplot").select("svg").append("text").attr({x: 2, y: svgHeight/2-10, transform: "rotate(270 10,"+(svgHeight/2-10)+")"}).text("Ratings").style({"font-size":"12px","fill":"steelblue"});
	
	svgElement.append("rect").attr({
		x: 5,
		y: 5,
		width: 500,
		height: 100,
	})
	.style({"fill":"white"});
	
	for(var i=0; i<titleForStackedBarChart.length; i++) {
		svgElement.append("text")
		.style({"font-size":"12px","fill":"steelblue"})
		.each(function () {
		var arr = [];
		if(titleForStackedBarChart[i].length<15) {
			arr.push(titleForStackedBarChart[i]);
		}
		else {
			var midPos = Math.floor(titleForStackedBarChart[i].length/2);
			var leftPtr = rightPtr = midPos;
			while( leftPtr>0 && titleForStackedBarChart[i][leftPtr]!=" " && rightPtr<titleForStackedBarChart[i].length && titleForStackedBarChart[i][rightPtr]!=" ") {
				leftPtr--; rightPtr++;
			}
			if (titleForStackedBarChart[i][leftPtr]==" " && leftPtr>0) {
				arr.push(titleForStackedBarChart[i].substring(0,leftPtr));
				arr.push(titleForStackedBarChart[i].substring(leftPtr+1,titleForStackedBarChart[i].length));
			}
			else if(rightPtr<titleForStackedBarChart[i].length) {
				arr.push(titleForStackedBarChart[i].substring(0,rightPtr));
				arr.push(titleForStackedBarChart[i].substring(rightPtr+1,titleForStackedBarChart[i].length));
			}
		}
		if (arr != undefined) {
			for (j = 0; j < arr.length; j++) {
				d3.select(this).append("tspan")
					.html(arr[j])
					.attr("dy", j * 0.8 + "em")
					.attr("x", 45 + (i%3)*160)
					.attr("text-anchor", "left")
					.attr("y", 40 + (Math.floor(i/3)*25))
					}
				}
			});
			
		svgElement.append("circle").attr({
			cx: 20 + (i%3)*160 + 3,
			cy: 30 + (Math.floor(i/3)*25) + 6,
			fill: colorArray[i],
			r: 4
		});
		svgElement.append("line").attr({
			x1: 20 + (i%3)*160 -12.5,
			x2: 20 + (i%3)*160 + 17.5,
			y1: 30 + (Math.floor(i/3)*25) + 6,
			y2: 30 + (Math.floor(i/3)*25) + 6,
			stroke: colorArray[i],			
		}).style({"stroke-width": "2"});

	}
	
}

function highlightLinePlotPoint (circle) {
	var businessGroupId = parseInt(d3.select(circle).attr("id").substring(17));
	var currentBusinessGroup = d3.select("#comparison-lineplot").select("svg").select("#businessGroup"+businessGroupId);
	currentBusinessGroup.selectAll("circle").attr({r: 8.0}).style({"opacity":"1.0"});
	currentBusinessGroup.selectAll("line").style({"stroke-width":"3", "opacity": "1.0"});
	currentBusinessGroup.selectAll("rect").style({"display": "block"});
	currentBusinessGroup.selectAll("text").style({"display": "block"});
}

function removeHighlightLinePlotPoint (circle) {
	var businessGroupId = parseInt(d3.select(circle).attr("id").substring(17));
	var currentBusinessGroup = d3.select("#comparison-lineplot").select("svg").select("#businessGroup"+businessGroupId);
	currentBusinessGroup.selectAll("circle").attr({r: 6.0}).style({"opacity":"0.5"});
	currentBusinessGroup.selectAll("line").style({"stroke-width":"2", "opacity": "0.4"});
	currentBusinessGroup.selectAll("rect").style({"display": "none"});
	currentBusinessGroup.selectAll("text").style({"display": "none"});
}

function addBarChart () {

// 	d3.select("#comparison-barchart").html("");
	
// 	d3.select("#comparison-barchart").append("a").attr({href:"#", id:"switch-button"}).style({"width":"200px", "height":"50px", "color": "#428bca", "right": "10px", "top": "10px", "position": "absolute", "text-decoration": "none"});

	var svgElement = d3.select("#comparison-barchart").append("svg").style({"width":"1250", "height":"555", "background-color": "none", "margin-top": "0px"});

	var svgWidth = parseInt(d3.select("#comparison-barchart").select("svg").style("width"));
	var svgHeight = parseInt(d3.select("#comparison-barchart").select("svg").style("height"));
	var segmentWidth = Math.floor(svgWidth / 5);
	
	//Legend for stacked chart
	
	svgElement.append("rect").attr({
		x: 5,
		y: 5,
		id: "legend"
	})
	.style({"fill":"white"});

	for ( var businessIndex=0; businessIndex<dataForBarChart.length; businessIndex++) {
		for ( var ratingIndex=0; ratingIndex<5; ratingIndex++) {
			
			svgElement.append("rect").attr({ id: "rect_" + businessIndex + "_" + ratingIndex });
			
			var _text = "";
			if (dataForBarChart[businessIndex][ratingIndex]>0)
				_text = dataForBarChart[businessIndex][ratingIndex].toString();
			
			svgElement.append("text").attr({ id: "recttext_" + businessIndex + "_" + ratingIndex })
			.text(_text)
			.style({"font-size":"10px","fill":"white"});
		}
	}

	for(var i=0; i<5; i++) {
		for(var j=0; j<5; j++) {
			var imgName;
			if(j<=i)
				imgName = "star_full";
			else
				imgName = "star_zero";
				
			svgElement.append("image").attr({
				width: 15,
				height: 15,
				id: "groupedXAxis-"+j+"-"+i,
				})
				.attr("xlink:href","static/images/" + imgName + ".png");
		}		
	}
	
	svgElement.append("text").attr({
		x: 25,
		y: 20
	})
	.style({"font-size":"15px","fill":"steelblue"})
	.text("Legend");
	
	for(var i=0; i<titleForStackedBarChart.length; i++) {
		svgElement.append("text")
		.style({"font-size":"12px","fill":"steelblue"})
		.each(function () {
		var arr = [];
		if(titleForStackedBarChart[i].length<15) {
			arr.push(titleForStackedBarChart[i]);
		}
		else {
			var midPos = Math.floor(titleForStackedBarChart[i].length/2);
			var leftPtr = rightPtr = midPos;
			while( leftPtr>0 && titleForStackedBarChart[i][leftPtr]!=" " && rightPtr<titleForStackedBarChart[i].length && titleForStackedBarChart[i][rightPtr]!=" ") {
				leftPtr--; rightPtr++;
			}
			if (titleForStackedBarChart[i][leftPtr]==" " && leftPtr>0) {
				arr.push(titleForStackedBarChart[i].substring(0,leftPtr));
				arr.push(titleForStackedBarChart[i].substring(leftPtr+1,titleForStackedBarChart[i].length));
			}
			else if(rightPtr<titleForStackedBarChart[i].length) {
				arr.push(titleForStackedBarChart[i].substring(0,rightPtr));
				arr.push(titleForStackedBarChart[i].substring(rightPtr+1,titleForStackedBarChart[i].length));
			}
		}
		if (arr != undefined) {
			for (j = 0; j < arr.length; j++) {
				d3.select(this).append("tspan")
					.html(arr[j])
					.attr("dy", j * 0.8 + "em")
					.attr("x", 0)
					.attr("text-anchor", "left")
					.attr("id", "stackedXAxis-"+i+"-"+j);
					}
				}
			});
	}
	
	for(var i=0; i<Math.max(titleForStackedBarChart.length, 5); i++) {
		svgElement.append("rect").attr({
			height: 12,
			width: 12,
			id: "legend-color-"+i,
		});
	}
	
	animateToGroupBarChart();
}

function animateToStackedBarChart () {

// 	d3.select("#comparison-barchart").select("#switch-button").attr({onclick:"switchToGroupedBarView(); return false;",}).text("Switch to grouped view");
	
	var legendColorArray = ["#9E9E55", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"];
	
	var maxCount = 0;
	
	for(var row=0; row<dataForBarChart.length; row++) {
		var reviewsCount = 0;
		for(var col=0; col<5; col++) {
			reviewsCount += dataForBarChart[row][col];
		}
		maxCount = Math.max(maxCount, reviewsCount);
	}
			
	var xAxisHeight = 100;
	var yAxisWidth = 10;
	
	var svgElement = d3.select("#comparison-barchart").select("svg");
	var svgWidth = parseInt(d3.select("#comparison-barchart").select("svg").style("width"));
	var svgHeight = parseInt(d3.select("#comparison-barchart").select("svg").style("height"));
	var segmentWidth = Math.floor(svgWidth / 5);
	
	svgElement.select("#legend").transition().duration(1000).attr({width: 130, height: 130});
	
	for(var i=5; i<titleForStackedBarChart.length; i++) {
		svgElement.select("#legend-color-"+i).transition().duration(1000+i*65).attr({
			x: -15,
		});
	}
	
	for(var i=0; i<5; i++) {
		for(var j=0; j<5; j++) {
			svgElement.select("#groupedXAxis-"+j+"-"+i).transition().duration(1000+(i+1)*j*65).attr({
				x: 30 + j*20,
				y: 27 + (4-i)*20,
			});
		}
		svgElement.select("#legend-color-"+i).transition().duration(1000+i*65).attr({
			x: 12,
			y: 30 + (4-i)*20,
			fill: legendColorArray[i],
		});
	}
	
	for(var i=0; i<titleForStackedBarChart.length; i++) {
		for (j = 0; j < 2; j++) {
			d3.select("#stackedXAxis-"+i+"-"+j).transition().duration(1000+i*65).attr({
				 x: (svgWidth-(titleForStackedBarChart.length * 95))/2 + i * 95 ,
				 y: svgHeight-15 ,
				 });
		}
	}
	
	for ( var businessIndex=0; businessIndex<dataForBarChart.length; businessIndex++) {
		for ( var ratingIndex=4; ratingIndex>=0; ratingIndex--) {
		
			var stackedHeight = 0;
			for ( var stackedRectangleIndex=0; stackedRectangleIndex<=ratingIndex; stackedRectangleIndex++) {
				stackedHeight += dataForBarChart[businessIndex][stackedRectangleIndex];
			}
			stackedHeight = stackedHeight/maxCount * (svgHeight-xAxisHeight);
		
			var yPos = (svgHeight-30) - stackedHeight;
			
			svgElement.select("#rect_" + businessIndex + "_" + ratingIndex).transition().duration(1000).attr({
				x: (svgWidth-(titleForStackedBarChart.length * 95))/2 + businessIndex * 95,
				y: yPos,
				width: 70,
				height:  (dataForBarChart[businessIndex][ratingIndex] / maxCount) * (svgHeight-xAxisHeight)
			})
			.style({"fill":legendColorArray[ratingIndex]});
			
			var _text = "";
			if (dataForBarChart[businessIndex][ratingIndex]>0)
				_text = dataForBarChart[businessIndex][ratingIndex].toString();		
			svgElement.select("#recttext_" + businessIndex + "_" + ratingIndex).transition().duration(1000).attr({
				 x: (svgWidth-(titleForStackedBarChart.length * 95))/2 + businessIndex * 95 + 70/2,
				 y: yPos + 10,
				 })
			.text(_text)
			.style({"font-size":"10px","fill":"white"});
		}
	}

}

function animateToGroup2BarChart () {

// 	d3.select("#comparison-barchart").select("#switch-button").attr({onclick:"switchToGroupedBarView(); return false;",}).text("Switch to grouped view");
	
	var legendColorArray = ["#9E9E55", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"];
	
	var maxCount = 0;
	
	for(var row=0; row<dataForBarChart.length; row++) {
		var reviewsCount = 0;
		for(var col=0; col<5; col++) {
		maxCount = Math.max(maxCount, dataForBarChart[row][col]);
		}		
	}
			
	var xAxisHeight = 100;
	var yAxisWidth = 10;
	
	var svgElement = d3.select("#comparison-barchart").select("svg");
	var svgWidth = parseInt(d3.select("#comparison-barchart").select("svg").style("width"));
	var svgHeight = parseInt(d3.select("#comparison-barchart").select("svg").style("height"));
	var segmentWidth = Math.floor(svgWidth / dataForBarChart.length);
	
	svgElement.select("#legend").transition().duration(1000).attr({width: 130, height: 130});
	
	for(var i=5; i<titleForStackedBarChart.length; i++) {
		svgElement.select("#legend-color-"+i).transition().duration(1000+i*65).attr({
			x: -15,
		});
	}
	
	for(var i=0; i<5; i++) {
		for(var j=0; j<5; j++) {
			svgElement.select("#groupedXAxis-"+j+"-"+i).transition().duration(1000+(i+1)*j*65).attr({
				x: 30 + j*20,
				y: 27 + (4-i)*20,
			});
		}
		svgElement.select("#legend-color-"+i).transition().duration(1000+i*65).attr({
			x: 12,
			y: 30 + (4-i)*20,
			fill: legendColorArray[i],
		});
	}
	
	for(var i=0; i<titleForStackedBarChart.length; i++) {
		for (j = 0; j < 2; j++) {
			d3.select("#stackedXAxis-"+i+"-"+j).transition().duration(1000+i*65).attr({
				 x: i * segmentWidth + 35,
				 y: svgHeight-15 ,
				 });
		}
	}
	
	for ( var businessIndex=0; businessIndex<dataForBarChart.length; businessIndex++) {
		for ( var ratingIndex=0; ratingIndex<5; ratingIndex++) {
		var _text = "";
		if (dataForBarChart[businessIndex][ratingIndex]>0)
			_text = dataForBarChart[businessIndex][ratingIndex].toString();
			
			svgElement.select("#rect_" + businessIndex + "_" + ratingIndex).transition().duration(1000).attr({
				x: 10 + businessIndex * (segmentWidth) + ratingIndex * ((segmentWidth-45) / 5),
				y: (svgHeight-30) - (dataForBarChart[businessIndex][ratingIndex] / maxCount) * (svgHeight-xAxisHeight),
				width: ((segmentWidth-50) / 5),
				height:  (dataForBarChart[businessIndex][ratingIndex] / maxCount) * (svgHeight-xAxisHeight)
			})
			.style({"fill":legendColorArray[ratingIndex]});
			svgElement.select("#recttext_" + businessIndex + "_" + ratingIndex).transition().duration(1000).attr({
				 x: 10 + businessIndex * (segmentWidth) + ratingIndex * ((segmentWidth-45) / 5) + ((segmentWidth-140) / 5),
				 y: (svgHeight-30+10) - (dataForBarChart[businessIndex][ratingIndex] / maxCount) * (svgHeight-xAxisHeight),
				 })
			.text(_text)
			.style({"font-size":"10px","fill":"white"});
		}
	}

}

function animateToGroupBarChart () {
	
	var maxCount = 0;
	
	for(var row=0; row<dataForBarChart.length; row++) {
		var reviewsCount = 0;
		for(var col=0; col<5; col++) {
		maxCount = Math.max(maxCount, dataForBarChart[row][col]);
		}		
	}
			
	var xAxisHeight = 100;
	var yAxisWidth = 10;
	
	var svgElement = d3.select("#comparison-barchart").select("svg");
	var svgWidth = parseInt(d3.select("#comparison-barchart").select("svg").style("width"));
	var svgHeight = parseInt(d3.select("#comparison-barchart").select("svg").style("height"));
	var segmentWidth = Math.floor(svgWidth / 5);
	
	svgElement.select("#legend").transition().duration(1000).attr({width: 500, height: 100});
	
	for(var i=titleForStackedBarChart.length; i<5; i++) {
		svgElement.select("#legend-color-"+i).transition().duration(1000+i*65).attr({
			x: -15,
		});
	}
	
	for(var i=0; i<5; i++) {
		for(var j=0; j<5; j++) {
			svgElement.select("#groupedXAxis-"+j+"-"+i).transition().duration(1000+(i+1)*j*65).attr({
				x: i * segmentWidth + (segmentWidth / 4) + j*15,
				y: svgHeight-20,
				});
		}
	}
	
	for(var i=0; i<titleForStackedBarChart.length; i++) {
		for (j = 0; j < 2; j++) {
			d3.select("#stackedXAxis-"+i+"-"+j).transition().duration(1000+i*65).attr({
				 x: 30 + (i%3)*160,
				 y: 40 + (Math.floor(i/3)*25)
				 });
		}
		svgElement.select("#legend-color-"+i).transition().duration(1000+i*65).attr({
			x: 12 + (i%3)*160,
			y: 30 + (Math.floor(i/3)*25),
			fill: colorArray[i],
		});
	}

	for ( var businessIndex=0; businessIndex<dataForBarChart.length; businessIndex++) {
		for ( var ratingIndex=0; ratingIndex<5; ratingIndex++) {
		var _text = "";
		if (dataForBarChart[businessIndex][ratingIndex]>0)
			_text = dataForBarChart[businessIndex][ratingIndex].toString();
			
			svgElement.select("#rect_" + businessIndex + "_" + ratingIndex).transition().duration(1000).attr({
				x: 10 + ratingIndex * (segmentWidth) + businessIndex * ((segmentWidth-60) / dataForBarChart.length),
				y: (svgHeight-30) - (dataForBarChart[businessIndex][ratingIndex] / maxCount) * (svgHeight-xAxisHeight),
				width: (segmentWidth-60) / dataForBarChart.length - 1,
				height:  (dataForBarChart[businessIndex][ratingIndex] / maxCount) * (svgHeight-xAxisHeight)
			})
			.style({"fill":colorArray[businessIndex]});
			svgElement.select("#recttext_" + businessIndex + "_" + ratingIndex).transition().duration(1000).attr({
				 x: 10 + ratingIndex * (segmentWidth) + businessIndex * ((segmentWidth-60) / dataForBarChart.length) + ((segmentWidth-60) / dataForBarChart.length - 5)/2 - 5,
				 y: (svgHeight-30+10) - (dataForBarChart[businessIndex][ratingIndex] / maxCount) * (svgHeight-xAxisHeight),
				 })
			.text(_text)
			.style({"font-size":"10px","fill":"white"});
		}
	}
}



function displayComparisonTable() {
	d3.select("#comparison-table-section").transition().duration(500).style("left", "5px");
	d3.select("#comparison-barchart").transition().duration(500).style("left", "2000px");
	d3.select("#comparison-lineplot").transition().duration(500).style("left", "2000px");
	d3.select("#comparison-scatterplot").transition().duration(500).style("left", "2000px");

	
	d3.select("#comparison-table-heading").attr("class", "heading-selected");
	d3.select("#comparison-barchart-heading").attr("class", "heading-unselected");
	d3.select("#comparison-lineplot-heading").attr("class", "heading-unselected");
	d3.select("#comparison-scatterplot-heading").attr("class", "heading-unselected");
}

function displayBarChart () {
	d3.select("#comparison-table-section").transition().duration(500).style("left", "-2000px");
	d3.select("#comparison-barchart").transition().duration(500).style("left", "5px");		
	d3.select("#comparison-lineplot").transition().duration(500).style("left", "2000px");
	d3.select("#comparison-scatterplot").transition().duration(500).style("left", "2000px");
	
	d3.select("#comparison-table-heading").attr("class", "heading-unselected");
	d3.select("#comparison-barchart-heading").attr("class", "heading-selected");
	d3.select("#comparison-lineplot-heading").attr("class", "heading-unselected");
	d3.select("#comparison-scatterplot-heading").attr("class", "heading-unselected");
}

function displayLinePlot () {
	d3.select("#comparison-table-section").transition().duration(500).style("left", "-2000px");
	d3.select("#comparison-barchart").transition().duration(500).style("left", "-2000px");		
	d3.select("#comparison-lineplot").transition().duration(500).style("left", "5px");
	d3.select("#comparison-scatterplot").transition().duration(500).style("left", "2000px");
	
	d3.select("#comparison-table-heading").attr("class", "heading-unselected");
	d3.select("#comparison-barchart-heading").attr("class", "heading-unselected");
	d3.select("#comparison-lineplot-heading").attr("class", "heading-selected");
	d3.select("#comparison-scatterplot-heading").attr("class", "heading-unselected");
}

function displayScatterPlot () {
	d3.select("#comparison-table-section").transition().duration(500).style("left", "-2000px");
	d3.select("#comparison-barchart").transition().duration(500).style("left", "-2000px");		
	d3.select("#comparison-lineplot").transition().duration(500).style("left", "-2000px");
	d3.select("#comparison-scatterplot").transition().duration(500).style("left", "5px");
	
	d3.select("#comparison-table-heading").attr("class", "heading-unselected");
	d3.select("#comparison-barchart-heading").attr("class", "heading-unselected");
	d3.select("#comparison-lineplot-heading").attr("class", "heading-unselected");
	d3.select("#comparison-scatterplot-heading").attr("class", "heading-selected");
}

function menuSelected(index) {
	for(var i=1; i<=3; i++) {
		d3.select("#menu-selector-"+i).select("span").attr({"class":"glyphicon glyphicon-unchecked"});
	}
	d3.select("#menu-selector-"+index).select("span").attr({"class":"glyphicon glyphicon-check"});
	switch(index) {
		case 2:
			animateToGroup2BarChart();			
			break;
		case 3:
			animateToStackedBarChart();
			break;
		default:
			animateToGroupBarChart();
			break;
	}
}