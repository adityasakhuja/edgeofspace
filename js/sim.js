var MINTEMP = -60, //Global variables
	MAXTEMP = 40,
	MINALT = 0,
	MAXALT = 40000,
	NUMPICS = 100;

var prevAlt = 0,
	prevTemp = 0;

getData(); //Initial get of data
setInterval(getData, 2000); //Re-render every 2 seconds

function callback(data){ //Callback once data has been loaded
	var alt = data.ALTITUDE; //Extract variables from raw data
	var temp = data.TEMPERATURE;
	
	if(!alt || alt == prevAlt) return; //Error checking
	if(!temp || temp == prevTemp) return;
	prevAlt = alt; prevTemp = temp;

	// Load the images onto the page once we know which one to load
	displayAltImg(alt); 
	displayTempImg(temp); 

	// Add in text
	$(".alt").text(alt + "m"); 
	$(".temp").text(temp + "\u00B0C");
	
	// Add in facts
	 displayAltFacts(alt);
	// displayTempFacts(temp);

}

function displayAltImg(alt){
	//TODO once background is done for altitude this function should display that image in the same place.
	var altRange = MAXALT - MINALT;
	var picsPerMet = NUMPICS / altRange;
	var altFromMin = alt - MINALT;
	var altPicNo = parseInt(picsPerMet*altFromMin);
	var backImg = "<img class='background' src='img/simImagesBackground/" + altPicNo + ".png'/>";
	$(".background").remove();
	$(".sim").append(backImg);
}
function displayTempImg(temp){ //Function that displays image depending on temperature given
	var tempRange = MAXTEMP - MINTEMP;
	var picsPerDeg = NUMPICS / tempRange;
	var degFromMin = temp - MINTEMP;
	var tempPicNo = NUMPICS - parseInt(picsPerDeg*degFromMin);
	var foreImg = "<img class='foreground' src='img/simImagesForeground/" + tempPicNo + ".png'/>";
	$(".foreground").remove();
	$(".sim").append(foreImg);
}

function displayAltFacts(alt) {
	var altFacts = [];
	altFacts[1] = "<p>Up until 1200m, altitude exposure would not have any extreme effects on the human body besides reduces physical experience.</p>";
	altFacts[2] = "<p>Between 1200m and 2400m, the human body starts to experience mild illness and drop in vision</p>";
	altFacts[3] = "<p>Moving up from 2400m, the human body will experience greater illness along with mental and psychological effects like decreased perception, memory, judgement and attention. Rising above 2500m could also lead to High-Altitude Pulmonary Edema: a life-threatening form of non-cardiogenic pulmonary edema (fluid accumulation in the lungs).</p>";
	altFacts[4] = "<p>This is the height we predicted Gary's balloon would burst and fall down back to us</p>";
	altFacts[5] = "<p>At this point, our dear Gary has just risen above the Great Pyramid of Giza!</p>";
	altFacts[6] = "<p>Look at that, Gary just rose above the Notre Dame standing proud at 151m!</p>";
	altFacts[7] = "<p>There goes the Eiffel Tower, Gary! at a height of 300m!</p>";
	altFacts[8] = "<p>As Gary moves up an above 380m, he is now risen above the Empire State Building!</p>";
	altFacts[9] = "<p>Now at a height of 452m, Gary has just reached the height of the Petronas Twin Towers!</p>";
	altFacts[10] = "<p>Reaching a height of 830m now, Gary is going to rise above the tallest building in the world, the Burj Khalifa!</p>";
	altFacts[11] = "<p>Crossing the 1600m mark now, Gary will no longer be able to smell the skunk we had with us during launch (true story!)</p>";
	altFacts[12] = "<p>As Gary crosses the 2400m mark, he his higher than the total length of Oxford Street</p>";
	altFacts[13] = "<p>Now approaching 2737m, Gary will be higher than the total length of the famous Golden Gate Bridge</p>";
	altFacts[14] = "<p>Gary has now reached 4400m, which the highest point a kite has been flown</p>";
	altFacts[15] = "<p>As Gary rises up to 4810m, he is now higher than Mont Blanc mountain</p>";
	altFacts[16] = "<p>Gary has now reached 5500m. This is the point where 50% of the atmospheric mass is contained</p>";
	altFacts[17] = "<p>At 5895m above sea level stands Mt. Kilimanjaro. Touch its tip, Gary!</p>";
	altFacts[18] = "<p>At this point Gary is at a height of 6500m above the sea level, which is equivalent to the length of the Great Wall of China!</p>";
	altFacts[19] = "<p>Gary is now at 7500m, which is the operational altitude of the Reaper Drone</p>";
	altFacts[20] = "<p>At 8611m Gary can now touch the peak of K2</p>";
	altFacts[21] = "<p>And now at 8848m, Gary has just risen above Mt. Everest!</p>";
	altFacts[22] = "<p>Gary is about to cross the 11000m mark, which is where 90% of the atmospheric humidity is contained</p>";
	altFacts[23] = "<p>It has been a while and Gary has finally reached a height of 2730m, which the heighest point a paper airplane has been flown</p>";

	if (alt <= 1200) {
		$(".fact").empty();
		$(".fact").append(altFacts[1]);
	}
	else if ((1200 < alt) && (alt <= 2400)) {
		$(".fact").empty();
		$(".fact").append(altFacts[2]);
	}
	else if ((2400 < alt) && (alt <= 4000)) {
		$(".fact").empty();
		$(".fact").append(altFacts[3]);
	}
	else if ((138 < alt) && (alt <= 150)) {
		$(".fact").empty();
		$(".fact").append(altFacts[5]);
	}
	else if ((150 < alt) && (alt <= 160)) {
		$(".fact").empty();
		$(".fact").append(altFacts[6]);	
	}
	else if ((300 < alt) && (alt <= 380)) {
		$(".fact").empty();
		$(".fact").append(altFacts[7]);		
	}
	else if ((380 < alt) && (alt <= 452)) {
		$(".fact").empty();
		$(".fact").append(altFacts[8]);
	}
	else if ((452 < alt) && (alt >= 470)) {
		$(".fact").empty();
		$(".fact").append(altFacts[9]);
	}
	else if ((800 <= alt) && (alt >= 900)) {
		$(".fact").empty();
		$(".fact").append(altFacts[10]);
	}
	else if ((1590 <= alt) && (alt >= 1610)) {
		$(".fact").empty();
		$(".fact").append(altFacts[11]);
	}
	else if ((2380 <= alt) && (alt >= 2420)) {
		$(".fact").empty();
		$(".fact").append(altFacts[12]);
	}
	else if ((2725 <= alt) && (alt >= 2745)) {
		$(".fact").empty();
		$(".fact").append(altFacts[13]);
	}
	else if ((4375 <= alt) && (alt >= 4430)) {
		$(".fact").empty();
		$(".fact").append(altFacts[14]);
	}
	else if ((4800 <= alt) && (alt >= 4830)) {
		$(".fact").empty();
		$(".fact").append(altFacts[15]);
	}
	else if ((5480 <= alt) && (alt >= 5520)) {
		$(".fact").empty();
		$(".fact").append(altFacts[16]);
	}
	else if ((5880 <= alt) && (alt >= 5910)) {
		$(".fact").empty();
		$(".fact").append(altFacts[17]);
	}
	else if ((6480 <= alt) && (alt >= 6520)) {
		$(".fact").empty();
		$(".fact").append(altFacts[18]);
	}
	else if ((7480 <= alt) && (alt >= 7520)) {
		$(".fact").empty();
		$(".fact").append(altFacts[19]);
	}
	else if ((8600 <= alt) && (alt >= 8630)) {
		$(".fact").empty();
		$(".fact").append(altFacts[20]);
	}
	else if ((8820 <= alt) && (alt >= 8880)) {
		$(".fact").empty();
		$(".fact").append(altFacts[21]);
	}
	else if ((11980 <= alt) && (alt >= 11120)) {
		$(".fact").empty();
		$(".fact").append(altFacts[22]);
	}
	else if ((29420 <= alt) && (alt >= 29510)) {
		$(".fact").empty();
		$(".fact").append(altFacts[23]);
	}
}

function displayTempFacts(temp) {
	var tempFacts = [];
	tempFacts[1] = "<p></p>";
	tempFacts[2] = "<p></p>";
	tempFacts[3] = "<p></p>";
	tempFacts[4] = "<p></p>";

	if (temp <= 1200) {
		$(".fact")
		$(".fact").append(tempFacts[1]);
	}
	else if ((1200 < temp) && (temp <= 2400)) {
		$(".fact").append(tempFacts[2]);
	}
	else if ((2400 < temp) && (temp <= 4000)) {
		$(".fact").append(tempFacts[1]);
	}
}

function getData(){ // Function for refreshing the data tag in the html (effectively refreshing the data)
  if($(".data").length) $(".data").remove(); //Check if data has been got before if it has then remove it
  var script_el = "<script type='application/javascript' class='data' src='http://balloon.mybluemix.net/latestsim'>"; 
  $("script").after(script_el); //Add in script tag to get data
}