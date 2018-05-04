var rss__spreadsheet__url = '1YWA_xgglptdYQEyUQsro9j05004gTibHTqkItY0lEYw';
var entities = ["Alhurra", "Martí", "RFA", "RFERL", "VOA"];

var metrics__array = ["Labor", "Contracts", "Loans", "CN_EXtoAfr", "CN_IMfromAfr", "US_EXtoAfr", "US_IMfromAfr"];
var countries__array = ["Regional","Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cameroon","Cape Verde","Central African Rep.","Chad","Comoros","Congo","Congo, Dem. Rep.","Cote d'Ivoire","Djibouti","Egypt","Equatorial Guinea","Eritrea","Ethiopia","Fmr Sudan","Gabon","Gambia","Ghana","Guinea","Guinea-Bissau","Kenya","Lesotho","Liberia","Libya","Madagascar","Malawi","Mali","Mauritania","Mauritius","Morocco","Mozambique","Namibia","Niger","Nigeria","Rwanda","Sao Tome & Principe","Senegal","Seychelles","Sierra Leone","Somalia","South Africa","South Sudan","Sudan","Swaziland","Tanzania","Togo","Tunisia","Uganda","Zambia","Zimbabwe"];
var maxValues = {"Labor":91596,"Contracts":8434.21,"Loans":6324,"CN_EXtoAfr":47834.31,"CN_IMfromAfr":48388.43,"US_EXtoAfr":7553,"US_IMfromAfr":48388}
var data__CARI = {};

var myGraphic;

var yscale;
var axisBuilt = false;

var margin = {top: 20, right: 0, bottom: 20, left: 50};
var heightGraphic = 300 - margin.top - margin.bottom;
var widthGraphic;
var widthGraphicOld = -1;
var widthBar;

var formatComma;
var div;

// =======================
// |  Utility functions  |
// =======================

// Utility function to replace console.log() statements so they can all be disabled as needed;
var debugMode = true;

function logger(logString){
	if (debugMode){
		console.log(logString);
	}
}

// Utility function for removing spaces and punctuation from a string
function simplifyName(name){
	var idName = name;
	idName = idName.replace(/ /g,'');
	idName = idName.replace("'",'');
	idName = idName.replace(/[.,\/#!$%\^&\;:{}=\-_`~]/g,"");

	return idName;
}


// Utility function for sorting an object
// https://gist.github.com/umidjons/9614157
function sortProperties(obj){
  // convert object into array
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]); // each item is an array in format [key, value]
	
	// sort items by value
	sortable.sort(function(a, b)
	{
	  return a[1]-b[1]; // compare numbers
	});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}



// Utility function for waiting for the window resize to 'end' before redrawing the graphics
var waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) {
			uniqueId = "Don't call this twice without a uniqueId";
		}
		if (timers[uniqueId]) {
			clearTimeout (timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

/*
// Utility function for finding the max for a metric across all years and countries
// (in order to establish a common scale)

function findMax(data, value){
	var valuesArray = [];
	for (var m = 0; m < data.length; m++){
		if (data[m].Type == value ) {
			for (var n = 0; n < countries__array.length; n++){
				valuesArray.push( Number( data[m][countries__array[n]] ) );
			}
		}
	}

	maxValues[value] = d3.max(valuesArray);
}
*/




// ===================================================
// |  Basic tabletopJS setup for faux RSS headlines  |
// ===================================================

function loadSpreadsheet() {
	if ( mode == "editing") {
		Tabletop.init( { key: rss__spreadsheet__url,
		 	callback: showInfo,
		 	wanted: entities } )
	}
}

function showInfo(data) {
	logger("\n\nloaded RSS spreadsheet data: ");
	logger(data);

	var rss = "";

	if(currentEntity != "Alhurra"){
		var RSSnumberOfStories = 3;
		for (var i = 0; i < data[currentEntity].elements.length; i++){
			if (i < RSSnumberOfStories + 1){
				rss += '<li><a href="' + data[currentEntity].elements[i].link + '">' + data[currentEntity].elements[i].headline + '</a></li>';
			}
		}
		$("#rssList").html(rss);

	} else {
		// =================================
		// |  Parsing RSS with Javascript  |
		// |  to reset the styles.         |
		// =================================
		//https://www.raymondcamden.com/2015/12/08/parsing-rss-feeds-in-javascript-options/

	    var rssStoryCount = 4;

		$(document).ready(function() {

			var yql = "https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22https%3A%2F%2Fwww.alhurra.com%2Fapi%2Fziiqrejgqq%2F%22&format=json&diagnostics=true&callback=";

			$.getJSON(yql, function(res) {
				logger(res);

				var rss = ""
				for (var i = 0; i < rssStoryCount; i++){
					logger(res.query.results.item[i].title)
					rss += "<li><a href='" + res.query.results.item[i].link + "'>" + res.query.results.item[i].title + "</a></li>";
				}
				$("#rssList").html(rss);
				//$("#rssListBBG").html(rss);

			}, "jsonp");

		});

	}

}




function createGraphic(graphicID){
	widthGraphic = $("#graphic").width();

	myGraphic = d3.select("#"+ graphicID)
		.append("svg")
		.attr("class", "mySVG")
		.attr("height", heightGraphic + margin.top + margin.bottom);

	drawGraphic(defaultCountry, defaultMetric, "graphic")

	window.addEventListener("resize", redrawGraphic);
}


// Use the default values (the last set values) for redrawing the graphic on resize
function redrawGraphic(){

	waitForFinalEvent(function(){
		widthGraphic = $("#graphic").width();

		// Only redraw the graphic if the width changed
		// Fixes unecessary redraw on iOS Safari
		if (widthGraphic != widthGraphicOld){
			//d3.select("svg").remove();
			d3.select("#yAxis").remove();
			//createGraphic("graphic");
			drawGraphic(defaultCountry, defaultMetric);
		}

	}, 500, "some unique string");

}



function drawGraphic(country, metric, graphicID){
	//widthGraphic = $("#graphic").width();
	widthGraphicOld = widthGraphic;

	logger("country: " + defaultCountry);
	logger("metric: " + defaultMetric);

	$("#graphicName").text(country + " | " + metric + " (" + data__CARI[metric].yearStart + " - present)" );


	yscale = d3.scaleLinear()
		.domain([0, maxValues[metric] ])
		.range([heightGraphic, margin.top])


	yAxis = d3.axisLeft()
		.scale(yscale)
		.ticks(2);


	myGraphic.selectAll("rect")
		.remove();

	myGraphic.selectAll("text")
		.remove();

	arrayLength = data__CARI[metric].dataset.length;
	widthBar = (widthGraphic - margin.left - margin.right)  / arrayLength -1;


	//if (!axisBuilt) {
		myGraphic.append("g")
			.attr("class", "axis")
			.attr("id", "yAxis")
			.attr("transform", "translate(" + margin.left + "," + 0 + ")")
			.call(yAxis);

		//axisBuilt = true;
	/*} else {
		myGraphic.select("#yAxis")
			.call(yAxis);
	} */


	myGraphic.selectAll("rect")
		.data(data__CARI[metric].dataset)
		.enter()
		.append("rect")
		.attr("width", widthBar)
		.on("click", function(d,i){
			console.log("Clicked: " + d) 
		})
        .on("mouseover", function(d) {
        	var loanValueNumberFull = d * scale;
			loanValueNumberFull = prefix + formatComma(loanValueNumberFull) + suffix;

            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(loanValueNumberFull)	
                .style("left", (d3.event.pageX - 45) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
		.attr("x", function(d,i){
			return i * (widthBar + 1) + margin.left
		})
		.attr("y", heightGraphic)
		.style("fill", "#900")
		.transition()
		.duration(1000)
		.attr("height", function(d,i){
			return heightGraphic - yscale(d);
		})
		.attr("y", function(d,i){
			return yscale(d)
		})



	var startYear = data__CARI[metric].yearStart;
	var endYear = data__CARI[metric].yearStart + data__CARI[metric].dataset.length - 1;

	myGraphic.append("text")
		.text(startYear + " - " + endYear)
		.attr("transform", "translate(" + ( ( widthGraphic / 2) + margin.left / 2 ) + "," + (heightGraphic + margin.top) + ")")
		.attr("text-anchor", "middle")
		.attr("class", "textLabelXAxis")

	myGraphic.append("text")
		.text(scaleLabel)
		.attr('transform', 'translate(12,' + heightGraphic/2 + ')rotate(-90)')
		.attr("text-anchor", "middle")
		.attr("class", "textLabelYAxis")


		/*
	myGraphic.selectAll(".textLabelValue")
		.data(data__CARI[metric].dataset)
		.enter()
		.append("text")
		.attr("class", "textLabelValue")
		.attr("x", function(d,i){
			return i * (widthBar + 1) + margin.left + widthBar * .5
		})
		.attr("y", function(d,i){
			return yscale(d) - 2
		})
		.text(function(d,i){
			return d;//data__CARI[metric].yearStart + i
		})
		.attr('text-anchor',"middle")
		*/


	myGraphic.selectAll(".textLabelYear")
		.data(data__CARI[metric].dataset)
		.enter()
		.append("text")
		.attr("class", "textLabelYear")
		.attr("x", function(d,i){
			return i * (widthBar + 1) + margin.left + widthBar * .5
		})
		.attr("y",heightGraphic + 20)
		.text(function(d,i){
			var year = String(data__CARI[metric].yearStart + i);
			year = year.substr(2);
			year = "’" + year;
			return year;//String(data__CARI[metric].yearStart + i)
		})
		.attr('text-anchor',"middle")


	defaultCountry = country;
	defaultMetric = metric;
}





$(document).ready(function(){

	// ============================
	// |  Load country date       |
	// |  Start building graphic  |
	// ============================

	var countryNameCondensed = simplifyName(defaultCountry)

	// Define the div for the tooltip
	div = d3.select("body").append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 0);


	/*

	//If you want to load the JSON client side do this:
	$.getJSON( urlDataPrefix + "/data/data_profile_" + countryNameCondensed + ".json", function( data ) {
		logger("Loaded data for " + defaultCountry);
		logger("/data/data_profile_" + countryNameCondensed + ".json\n\n")

		data__CARI = data;
		logger(data__CARI);

		logger("\n\nAttempting to create graphic")
		createGraphic("graphic")


		//
		console.log("\n\nSorting the sectors")
		var sortedSectors=sortProperties(data__CARI.Loans.sector);
		console.log(sortedSectors);


		var formatComma = d3.format(",");

		//var sortedSectorsString = '<ul class="" style="padding-left: 0; list-style: none;">';
		var sortedSectorsString = '<table class="bbg__table__data">';
		sortedSectorsString += '<thead><tr><th>Sector</th><th>Money</th></tr></thead>';
		sortedSectorsString += '<tbody>';
		for (var i = sortedSectors.length - 1; i >= 0; i--) {
			if (sortedSectors[i][1] > 0){
				//console.log(sortedSectors[i][0] + ": " + sortedSectors[i][1]);

				var loanValueNumberFull = sortedSectors[i][1] * 1000000;
				loanValueNumberFull = formatComma(loanValueNumberFull);
				//console.log("$"+ loanValueNumberFull);

				//sortedSectorsString += "<li>" + sortedSectors[i][0] + ": $" + sortedSectors[i][1] + "</li>";
				sortedSectorsString += "<tr><td>" + sortedSectors[i][0] + "</td><td class='money'>$" + loanValueNumberFull + "</td></tr>";
			}
		}
		//sortedSectorsString += '</ul>';
		sortedSectorsString += '</tbody></table>'

		$("#sectorRanking").html(sortedSectorsString);
	});
	*/

	// If you've baked the country JSON into the project
		data__CARI = countryData;

		createGraphic("graphic");


	// ==================================
	// |  Create table ranking sectors  |
	// ==================================

	var sortedSectors=sortProperties(data__CARI.Loans.sector);
	formatComma = d3.format(",");

	var sortedSectorsString = '<table class="bbg__table__data">';
	sortedSectorsString += '<thead><tr><th>Sector</th><th>Money</th></tr></thead>';
	sortedSectorsString += '<tbody>';
	for (var i = sortedSectors.length - 1; i >= 0; i--) {
		if (sortedSectors[i][1] > 0){
			var loanValueNumberFull = sortedSectors[i][1] * scale;
			loanValueNumberFull = formatComma(loanValueNumberFull);
			sortedSectorsString += "<tr><td>" + sortedSectors[i][0] + "</td><td class='money'>" + prefix + loanValueNumberFull + suffix + "</td></tr>";
		}
	}
	sortedSectorsString += '</tbody></table>';
	$("#sectorRanking").html(sortedSectorsString);




	// ===================
	// |  Dropdown menu  |
	// ===================
	$(function() {
		$('#main-menu').smartmenus({
			subMenusSubOffsetX: 1,
			subMenusSubOffsetY: -8
		});
	});

	$( "#menuButton" ).click(function() {
		logger("clicked menu toggle")
	  $( ".main-menu-nav").toggle();
	});

	$( ".main-menu-nav a").not(".has-submenu").click(function() {
	  $( ".main-menu-nav").hide();
	});

	$( ".voa__section__full-width" ).click(function() {
	  $( ".main-menu-nav").hide();
	});




	// =========================================
	// |  load RSS spreadsheet via tabletopJS  |
	// =========================================
	loadSpreadsheet();




	// ===============================
	// |  load Tweets (if included)  |
	// ===============================
	function showTweet(){
		$( ".tweet" ).each(function( index ) {
			var tweet = $(this)[0];
			var id = $(this).data("tweet");

			twttr.widgets.createTweet(
			  id, tweet, 
				{
					conversation : 'none',    // or all
					cards        : 'visible',  // or visible 
					//linkColor    : '#900', // default is blue
					theme        : 'light'    // or dark
				})

		});

	}
	if (includeTweets){
		showTweet();
	}
});

