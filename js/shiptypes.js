
//Margin conventions
var margin = {top: 30, right: 80, bottom: 50, left: 80};

var widther = document.getElementById("intro-container").offsetWidth

var width = widther - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//Appends the svg to the chart-container div
var svg = d3.select(".g-chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Creates the xScale 
var xScale = d3.scale.linear()
	.range([0,width]);

//Creates the yScale
var y0 = d3.scale.ordinal()
	.rangeBands([height, 0], 0.2)
	.domain(["Barge", "Tug","Offshore","HSLC","Tanker","Dredger","Seismic","Diving"]);

//Defines the y axis styles
var yAxis = d3.svg.axis()
	.scale(y0)
	.orient("left");

//Defines the y axis styles
var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.tickFormat(function(d) {return d; })
	.tickSize(height)
	.ticks(numTicks(width)); 

//Loads the data
d3.csv("../template.csv", ready);

function ready(err, data) {

	//FORMAT data
	data.forEach(function(d) {
		d.num = +d.num;
	});

	//Sets the max for the xScale
	var maxX = d3.max(data, function(d) { return d.num; });

	//Defines the xScale max
	xScale.domain([0, maxX ]);

	//Appends the y axis
	var yAxisGroup = svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	//Appends the x axis		
	var xAxisGroup = svg.append("g")
		.attr("class", "x axis")
		.call(xAxis);	

  //Binds the data to the bars    	
	var categoryGroup = svg.selectAll(".g-category-group")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "g-category-group")
		.attr("transform", function(d) {
			return "translate(0," + y0(d.category) + ")";
		});

	//Appends first bar		
	var bars = categoryGroup.append("rect")
		.attr("width", 1)
		.attr("height", y0.rangeBand()/1.5 )
		.attr("class", "g-num")
		.attr("transform", "translate(0,4)");
  	
  	//Animates bars
  	bars.transition()
  		.duration(5000)
  		.delay(1000)
  		.attr("width", function(d) { return xScale(d.num); });
  
  //RESPONSIVENESS
  d3.select(window).on("resize", resized);

  function resized() {

    //new margin
    var newMargin = {top: 30, right: 80, bottom: 50, left: 80};

    //Get the width of the window
    var w = document.getElementById("intro-container").offsetWidth;
    
    //Change the width of the svg
    d3.select("svg")
      .attr("width", w);

    //Change the xScale
    xScale
      .range([0, w - newMargin.right - newMargin.left]);

    //Update the bars
    bars
      .attr("width", function(d) { return xScale(d.num); });

    //Updates xAxis
    xAxisGroup
      .call(xAxis);   

    //Updates ticks
    xAxis
      .scale(xScale)
      .ticks(numTicks(w));

  };

}

//Determines number of ticks base on width
function numTicks(widther) {
  if (widther <= 400) {
    return 4
    console.log("return 4")
  }
  else {
    return 10
    console.log("return 5")
  }
}