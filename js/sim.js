var MINTEMP = -50, //Global variables
	MAXTEMP = 30,
	MINALT = 0,
	MAXALT = 40000,
	NUMPICS = 101;

getData(); //Initial get of data

function callback(data){ //Callback once data has been loaded
	
	var alt = data.ALTITUDE; //Extract variables from raw data
	var temp = data.TEMP;
	displayAltImg(alt); //Load the images onto the page once we know which one to load
	displayTempImg(temp);

	$(".alt").text(alt + "m"); //Add in text
	$(".temp").text(temp + "\u00B0C");
	//TODO make text change colour depending on value
}

function displayAltImg(alt){
	//TODO once background is done for altitude this function should display that image in the same place.
	var altRange = MAXALT - MINALT;
	var picsPerMet = NUMPICS / altRange;
	var altFromMin = alt - MINALT;
	var altPicNo = NUMPICS - parseInt(picsPerMet*altFromMin);
	var backImg = "<img src='img/simImagesForeground/" + altPicNo + ".png'/>";
	$(".sim").prepend(backImg);
}
function displayTempImg(temp){ //Function that displays image depending on temperature given
	var tempRange = MAXTEMP - MINTEMP;
	var picsPerDeg = NUMPICS / tempRange;
	var degFromMin = temp - MINTEMP;
	var tempPicNo = NUMPICS - parseInt(picsPerDeg*degFromMin);
	var forImg = "<img src='img/simImagesForeground/" + tempPicNo + ".png'/>";
	$(".sim").prepend(forImg);
}

function getTempColour(temp){
}
//TODO repeatedly call this function in order to refresh the data on page live
function getData(){ // Function for refreshing the data tag in the html (effectively refreshing the data)
  if($(".data").length) $(".data").remove(); //Check if data has been got before if it has then remove it
  var script_el = "<script type='application/javascript' class='data' src='http://balloon.mybluemix.net/latestsim'>"; 
  $("script").after(script_el); //Add in script tag to get data
}

