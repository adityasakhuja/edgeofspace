	var alt = 2350;
	var temp = -20;
	var picno = 15;

	$(".alt").text(alt + "m"); 
	$(".temp").text(temp + "\u00B0C");

	var img2 = "<img class='background' src='img/simImagesBackground/" + picno + ".png'/>";
	$(".sim").append(img2);

	var img = "<img class='foreground' src='img/simImagesForeground/" + picno + ".png'/>";
	$(".sim").append(img);
	
	var facts = [];
	facts[1] = "This is the first fact\n";
	facts[2] = "This is the second fact\n";

	var fact_start = "These are facts picked out from the array of facts according to returned values of temperature and altitude:\n";
	$(".fact").text(fact_start + facts[1] + facts[2]);
