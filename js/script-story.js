//Grab the spreadsheet KEY from the URL bar (NOT from the published window)
var public_spreadsheet_url = '1YWA_xgglptdYQEyUQsro9j05004gTibHTqkItY0lEYw';
//var map; //defined here for global access.
var entities = ["Alhurra", "Martí", "RFA", "RFERL", "VOA"];//"mbn", "rferl", "rfa", 


var debugMode = true;
// Basic function to replace console.log() statements so they can all be disabled as needed;
function logger(logString){
	if (debugMode){
		console.log(logString);
	}
}








// ============================
// |  Basic tabletopJS setup  |
// ============================
function loadSpreadsheet() {
	if ( mode == "editing") {
		//multisheet version: 
		Tabletop.init( { key: public_spreadsheet_url,
		 	callback: showInfo,
		 	wanted: entities } )
	} else if ( mode == "production") {
		//buildPresidents(d3target);
		showInfo(bakedData);
	} else {
		console.log("You need to define the 'mode' ('editing' or 'production')");
	}
}
//function showInfo(data, tabletop) {
function showInfo(data) {
	logger("loaded spreadsheet data: ");
	logger(data);

	/*
	var promo = "<h3 class='voa__label' style='font-size: 14px;'>More from " + currentEntity + "</h3>";
	promo += "<a href='" + data[currentEntity].elements[0].link + "'>"
	if (data[currentEntity].elements[0].thumbnail != ""){
		promo += "<img src='" + data[currentEntity].elements[0].thumbnail + "'/>"
	}
	promo += "<h4>" + data[currentEntity].elements[0].headline + "</h4>"
	promo += "</a>"

	$("#storyPromo").html(promo)
	*/

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



$(document).ready(function(){
	logger("Ready");

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



	$("#introLink").click(function(){
		$("html, body").animate({ scrollTop: $("#intro").offset().top }, 500);
		return false;
	})


	balanceText();


	/*
	//=====================================================
	// |  Add support for query strings (for languages)   |
	//=====================================================
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		    results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	// you'll need to use this after the document has loaded.
	languageQuery = getParameterByName('language');
	if (languageQuery && languageQuery!=""){
		language = languageQuery;
	}

	*/



	/*
	// ================================================
	// |  Opens a pop-up with twitter sharing dialog  |
	// ================================================
	$('#shareTwitter').click(function(){
		var url = shareUrl;
		var text = shareText;
		window.open('http://twitter.com/share?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(text), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
	})
	*/



	// =====================================
	// |  load spreadsheet via tabletopJS  |
	// =====================================
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