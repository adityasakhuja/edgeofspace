var MINTEMP = -50, //Global variables
	MAXTEMP = 30,
	MINALT = 0,
	MAXALT = 40000,
	NUMPICS = 101;

var prevAlt = 0,
	prevTemp = 0;

getData(); //Initial get of data
setInterval(getData, 2000); //Re-render every 2 seconds

function callback(data){ //Callback once data has been loaded
	var alt = data.ALTITUDE; //Extract variables from raw data
	var temp = data.TEMP;
	
	if(!alt || alt == prevAlt) return; //Error checking
	if(!temp || temp == prevTemp) return;
	prevAlt = alt; prevTemp = temp;

	displayTempImg(temp); //Load the images onto the page once we know which one to load
	displayAltImg(alt); 

	$(".alt").text(prevAlt + "m"); //Add in text
	$(".temp").text(prevTemp + "\u00B0C");
	//TODO make text change colour depending on value
}

function displayAltImg(alt){
	//TODO once background is done for altitude this function should display that image in the same place.
	var altRange = MAXALT - MINALT;
	var picsPerMet = NUMPICS / altRange;
	var altFromMin = alt - MINALT;
	var altPicNo = NUMPICS - parseInt(picsPerMet*altFromMin);
	var foreImg = "<img class='foreground' src='img/simImagesForeground/" + altPicNo + ".png'/>";
	$(".sim").append(foreImg);
}
function displayTempImg(temp){ //Function that displays image depending on temperature given
	var tempRange = MAXTEMP - MINTEMP;
	var picsPerDeg = NUMPICS / tempRange;
	var degFromMin = temp - MINTEMP;
	var tempPicNo = NUMPICS - parseInt(picsPerDeg*degFromMin);
	var backImg = "<img class='background' src='img/simImagesBackground/" + tempPicNo + ".png'/>";
	$(".sim").append(backImg);
}

function getTempColour(temp){
}

function getData(){ // Function for refreshing the data tag in the html (effectively refreshing the data)
  if($(".data").length) $(".data").remove(); //Check if data has been got before if it has then remove it
  var script_el = "<script type='application/javascript' class='data' src='http://balloon.mybluemix.net/latestsim'>"; 
  $("script").after(script_el); //Add in script tag to get data
}