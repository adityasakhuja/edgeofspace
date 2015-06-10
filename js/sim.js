var MINTEMP = -40,
	MAXTEMP = 30,
	MINALT = 0,
	MAXALT = 40000;

function callback(data){
	var alt = data.ALTITUDE;
	var temp = data.TEMP;
	displayAltImg(alt);
	displayTempImg(temp);



	$(".alt").text(alt + "m");
	$(".temp").text(temp + "\u00B0C");
}

function displayAltImg(alt){
}
function displayTempImg(temp){

}

function getTempColour(temp){
	if(temp >= 0){
		MAXTEMP
	}
}

function getData(){ // Function for refreshing the data tag in the html (effectively refreshing the data)
  if($(".data").length) $(".data").remove();
  var script_el = "<script type='application/javascript' class='data' src='http://balloon.mybluemix.net/latestsim'>";
  $("script").after(script_el);
}


$(".sim").