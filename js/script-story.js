//Grab the spreadsheet KEY from the URL bar (NOT from the published window)
var public_spreadsheet_url = '1YWA_xgglptdYQEyUQsro9j05004gTibHTqkItY0lEYw';
//var map; //defined here for global access.
var entities = ["Alhurra", "Martí", "RFA", "RFERL", "VOA"];//"mbn", "rferl", "rfa", 
var currentSlideNumber = 0;
var captionHeight = 10;

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



	// =================================
	// |  load slides in modal window  |
	// =================================


	var totalPhotos = $(".bbg__load-photo").length - 1;

	$(".bbg__load-photo").click(function(){
		currentSlideNumber = $(this).data("slide");

		displayPhoto();

		$('body').addClass("noScroll");

		$("#modalContainer").fadeIn( "slow", function() {
			//alert("clicked: " + headline);
		  });

		$(".bbg__modal__button").addClass("show");
	})

	$("#nextButton").click(function(){
		if (currentSlideNumber < totalPhotos){
			currentSlideNumber ++;
		} else {
			currentSlideNumber = 0;
		}
		displayPhoto();
	})
	$("#previousButton").click(function(){
		if (currentSlideNumber > 0){
			currentSlideNumber --;
		} else {
			currentSlideNumber = totalPhotos;
		}
		displayPhoto();
	})

	function displayPhoto(){
		var currentSlide = "#slide"+currentSlideNumber + " img";
		var caption = $(currentSlide).data("caption");
		var photoUrl = $(currentSlide).data("url");

		$("#photoCutline").text(caption);
		$("#modalPhoto").attr("src", photoUrl)

		captionHeight = $("#photoCutline").height();
		var modalHeight = $(window).height() * .9;

		$(".bbg__modal__popup").css('max-height', modalHeight);
		captionHeight = $("#photoCutline").height();

		$("#photoContainer").css('max-height', modalHeight - captionHeight - 40);
	}

	$("#modalContainer").click(function(){
		$("#modalContainer").fadeOut( "slow", function() {
			$("#modalPhoto").attr("src", "")
			$('body').removeClass("noScroll");
			$(".bbg__modal__button").removeClass("show");

		});
	})


});