	var alt = 2350;
	var temp = -20;
	var picno = 15;

	$(".alt").text(alt + "m"); 
	$(".temp").text(temp + "\u00B0C");
	var img = "<img src='img/simImagesForeground/" + picno + ".png'/>";
	$(".sim").prepend(img);

	var fact01 = "This is a fact and its awesome";
	$(".fact").text(fact01);