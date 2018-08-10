//Grab the spreadsheet KEY from the URL bar (NOT from the published window)
var public_spreadsheet_url = '1YWA_xgglptdYQEyUQsro9j05004gTibHTqkItY0lEYw';
var entities = ["Alhurra", "Martí", "RFA", "RFERL", "VOA", "BBG"];//"mbn", "rferl", "rfa", 
var currentEntity = "BBG";

var videoLoaded = false;

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
	Tabletop.init( { key: public_spreadsheet_url,
	 	callback: showInfo,
	 	wanted: entities } )
}
//function showInfo(data, tabletop) {
function showInfo(data) {
	logger("loaded spreadsheet data: ");
	logger(data);

	var rss = "";

	var RSSnumberOfStories = 3;

	for (var i = 0; i < data[currentEntity].elements.length; i++){
		if (i < RSSnumberOfStories + 1){
			rss += '<li><a href="' + data[currentEntity].elements[i].link + '">' + data[currentEntity].elements[i].headline + ' (' + data[currentEntity].elements[i].byline + ')</a></li>';
		}
	}
	$("#rssListBBG").html(rss);

}



//$(window).on('load', function() {// }); // Runs when all assets are loaded.

//$(document).ready(function(){
$(window).on('load', function() {
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

	$( ".bbg__section__full-width" ).click(function() {
	  $( ".main-menu-nav").hide();
	});


	balanceText();

	$("#introLink").click(function(){
		$("html, body").animate({ scrollTop: $("#intro").offset().top }, 500);
		return false;
	})



	/*
	$(".bbg__navbar__tab a").click(function( event ) {
		//event.preventDefault();
		var currentTarget = "#" + $(this).attr("href"); 

		$("html, body").animate({ scrollTop: $(currentTarget).offset().top - 40}, 500);
		return false;

	})
	*/



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



	// ================================================
	// |  Opens a pop-up with twitter sharing dialog  |
	// ================================================
	$('#shareTwitter').click(function(){
		var url = $(this).attr("href");
		window.open(url, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
		return false;
	})
	$('#shareFacebook').click(function(){
		var url = $(this).attr("href");
		window.open(url, '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
		return false;
	})

		
		/*
		if (currentWidth > 640){
			$("#myVideo").attr("src", "animation/train-with-smoke_5.mp4");
		}
		*/

	window.addEventListener("resize", loadVideo);
	function loadVideo(){

		if (!videoLoaded){
			var currentWidth = $(window).width();

			if (currentWidth > 640){

				var currentWidth = $(window).width();

				$("#videoCard").attr("src", "img/train.mp4?no-cache=0");
				videoLoaded = true;
			} else {
				var currentWidth = $(window).width();

				$("#videoCard").attr("src", "img/train.mp4?no-cache=0");
				videoLoaded = true;
			}
		}
	}
	loadVideo();



	// =====================================
	// |  load spreadsheet via tabletopJS  |
	// =====================================
	loadSpreadsheet();


	/*
	// =================================
	// |  Parsing RSS with Javascript  |
	// |  to reset the styles.         |
	// =================================
	//https://www.raymondcamden.com/2015/12/08/parsing-rss-feeds-in-javascript-options/

	var rssStoryCount = 4;

	$(document).ready(function() {

		//var yql = "https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22https%3A%2F%2Fwww.bbg.gov%2Fcategory%2Fpress-release%2Ffeed%2F%22&format=json&diagnostics=true&callback=";
		//var yql = "https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22https%3A%2F%2Fwww.bbg.gov%2Fcategory%2Fthreats-to-press%2Ffeed%2F%22&format=json&diagnostics=true&callback=";
		var yql = "https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22https%3A%2F%2Fwww.bbg.gov%2Ftag%2Fhot-spots%2Ffeed%2F%22&format=json&diagnostics=true&callback=";

		$.getJSON(yql, function(res) {
			logger(res);

			var rssFeed = ""
			for (var i = 0; i < rssStoryCount; i++){
				logger(res.query.results.item[i].title)
				rssFeed += "<li><a href='" + res.query.results.item[i].link + "'>" + res.query.results.item[i].title + "</a></li>";
			}

			$("#rssListBBG").html(rssFeed);

		}, "jsonp");

	});
	*/

});