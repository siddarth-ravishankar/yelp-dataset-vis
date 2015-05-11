addPriceDistributionBarChart ();
addRatingsDistributionBarChart ();

function addPriceDistributionBarChart () {
	d3.select("#price-distribution-barchart").html("");
		
	var xAxisData = [1, 2, 3, 4];

	var svgWidth = parseInt(d3.select("#price-distribution-barchart").style("width"))-10;
	var svgHeight = parseInt(d3.select("#price-distribution-barchart").style("height"))-20;
	var xAxisHeight = 40;
	var yAxisWidth = 30;

	d3.select("#price-distribution-barchart")
	.append("svg").attr({ width: svgWidth, height: svgHeight, style: "background-color: none; margin-top: 10px;"})
	.selectAll("rect").data(xAxisData).enter()
	.append("rect").attr({
		x: function(d,i) { return yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 2.5 },
		y: 0,
		width: Math.ceil( (svgWidth-yAxisWidth) / xAxisData.length - 5),
		height: 0,
		id: function(d,i) {return "price-distribution-barchart-bar-"+i}
	})
	.style({"fill":"steelblue"});
		 
	d3.select("#price-distribution-barchart")
	.select("svg")
	.selectAll("text").data(xAxisData).enter()
	.append("text").attr({
		 x: 0,
		 y: 0,
		 id: function(d,i) {return "price-distribution-barchart-bartext-"+i}
	 })
	.text("")
	.style({"font-size":"10px","fill":"steelblue"});
	
	d3.select("#price-distribution-barchart").select("svg").append("text").attr({x: 140, y: svgHeight-3}).text("Price Range").style({"font-size":"12px","fill":"steelblue"});
	d3.select("#price-distribution-barchart").select("svg").append("text").attr({x: 2, y: 140, transform: "rotate(270 10,140)"}).text("Businesses Count").style({"font-size":"12px","fill":"steelblue"});

	d3.select("#price-distribution-barchart").select("svg").selectAll("image").data(xAxisData).enter()
		.append("image").attr({
			x: function(d,i) {return yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 20},
			y: function(d, i) {return svgHeight-40 - (4-xAxisData[i])},
			width: 25, 
			height: 25
		})
		.attr("xlink:href",function(d, i) {return "static/images/pricerange" + xAxisData[i] + ".png"});
}

function addRatingsDistributionBarChart () {
	d3.select("#cluster-ratings-distribution-chart").html("");
	
	var xAxisData = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

	var svgWidth = parseInt(d3.select("#cluster-ratings-distribution-chart").style("width"))-10;
	var svgHeight = parseInt(d3.select("#cluster-ratings-distribution-chart").style("height"))-20;
	var xAxisHeight = 45;
	var yAxisWidth = 30;
	
	d3.select("#cluster-ratings-distribution-chart")
	.append("svg").attr({ width: svgWidth, height: svgHeight, style: "background-color: none; margin-top: 10px;"})
	.selectAll("rect").data(xAxisData).enter()
	.append("rect").attr({
		x: function(d,i) { return yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + 2.5 },
		y: 0,
		width: Math.ceil( (svgWidth-yAxisWidth) / xAxisData.length - 5),
		height: 0,
		id: function(d,i) {return "cluster-ratings-distribution-barchart-bar-"+i}
	})
	.style({"fill":"steelblue"});
		 
	d3.select("#cluster-ratings-distribution-chart")
	.select("svg")
	.selectAll("text").data(xAxisData).enter()
	.append("text").attr({
		 x: 0,
		 y: 0,
		 id: function(d,i) {return "cluster-ratings-distribution-barchart-bartext-"+i}
	 })
	.text("")
	.style({"font-size":"10px","fill":"steelblue"});
	
	d3.select("#cluster-ratings-distribution-chart").select("svg").append("text").attr({x: 150, y: svgHeight}).text("Stars").style({"font-size":"12px","fill":"steelblue"});
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

function updatePriceDistributionBarChart (responseObject) {

	ratingWithPriceDistributionDictionary = responseObject['rating_with_price_range_info'];

	var xAxisData = [1, 2, 3, 4];
	var yAxisData = [0, 0, 0, 0];

	var svgWidth = parseInt(d3.select("#price-distribution-barchart").style("width"))-10;
	var svgHeight = parseInt(d3.select("#price-distribution-barchart").style("height"))-20;
	var xAxisHeight = 40;
	var yAxisWidth = 30;
	
	var maxYValue = 0;
	for (var rating in ratingWithPriceDistributionDictionary) {
		for(var i=0; i<xAxisData.length; i++) {
			yAxisData[i] += ratingWithPriceDistributionDictionary[rating][xAxisData[i]];
			maxYValue = Math.max(maxYValue, yAxisData[i]);
		}
	}
	
	maxYValue = maxYValue * 1.1;
	
	for(var i=0; i<xAxisData.length; i++) {
	
		d3.select("#price-distribution-barchart-bar-"+i).transition().duration(500).attr({
			y: (svgHeight-xAxisHeight) - (yAxisData[i] / maxYValue) * (svgHeight-xAxisHeight),
			height: (yAxisData[i] / maxYValue) * (svgHeight-xAxisHeight)
		});
		
		d3.select("#price-distribution-barchart-bar-"+i).on('dblclick', function() {			
			var selectedPriceRangeVal = xAxisData[this.id.split("-").pop()];
			updatePriceRangeSlider (selectedPriceRangeVal, selectedPriceRangeVal);
			$( "#price-range-slider" ).slider({
				values: [selectedPriceRangeVal, selectedPriceRangeVal]
			});
			explore(responseObject['boundary']['north'], responseObject['boundary']['west'], responseObject['boundary']['south'], responseObject['boundary']['east']);
		});
		 
		d3.select("#price-distribution-barchart-bartext-"+i).transition().duration(500).attr({
			 x: yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + (64-yAxisData[i].toString().length*4)/2,
			 y: (svgHeight-xAxisHeight) - (yAxisData[i] / maxYValue) * (svgHeight-xAxisHeight) - 5,
			 })
		.text(function() { if(yAxisData[i]>0)return yAxisData[i]; else return "";});
		
		d3.select("#price-distribution-barchart-bartext-"+i).on('dblclick', function() {
			var selectedPriceRangeVal = xAxisData[this.id.split("-").pop()];
			updatePriceRangeSlider (selectedPriceRangeVal, selectedPriceRangeVal);
			$( "#price-range-slider" ).slider({
				values: [selectedPriceRangeVal, selectedPriceRangeVal]
			});
			explore(responseObject['boundary']['north'], responseObject['boundary']['west'], responseObject['boundary']['south'], responseObject['boundary']['east']);
		});
	}
}

function updateRatingsDistributionBarChart (responseObject) {

	ratingWithPriceDistributionDictionary = responseObject['rating_with_price_range_info'];

	var xAxisData = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
	var yAxisData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	var svgWidth = parseInt(d3.select("#cluster-ratings-distribution-chart").style("width"))-10;
	var svgHeight = parseInt(d3.select("#cluster-ratings-distribution-chart").style("height"))-20;
	var xAxisHeight = 45;
	var yAxisWidth = 30;
	
	var maxYValue = 0;
	
	for(var i=0; i<xAxisData.length; i++) {		
		for (var priceRange in ratingWithPriceDistributionDictionary[xAxisData[i]]) {
			yAxisData[i] += ratingWithPriceDistributionDictionary[xAxisData[i]][priceRange];
		}
		maxYValue = Math.max(maxYValue, yAxisData[i]);
	}
			
	for(var i=0; i<xAxisData.length; i++) {
	
		d3.select("#cluster-ratings-distribution-barchart-bar-"+i).transition().duration(500).attr({
			y: (svgHeight-xAxisHeight) - (yAxisData[i] / maxYValue) * (svgHeight-xAxisHeight) + 15,
			height: (yAxisData[i] / maxYValue) * (svgHeight-xAxisHeight)
		});
		 
		d3.select("#cluster-ratings-distribution-barchart-bartext-"+i).transition().duration(500).attr({
			 x: yAxisWidth + i * (svgWidth-yAxisWidth) / xAxisData.length + (24-yAxisData[i].toString().length*4)/2,
			 y: (svgHeight-xAxisHeight) - (yAxisData[i] / maxYValue) * (svgHeight-xAxisHeight) + 10,
			 })
		.text(function() { if(yAxisData[i]>0)return yAxisData[i]; else return "";});
	}
}