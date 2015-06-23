	var alt = 2350;
	var temp = -20;
	var picno = 15;

	$(".alt").text(alt + "m"); 
	$(".temp").text(temp + "\u00B0C");

	var img2 = "<img class='background' src='img/simImagesBackground/" + picno + ".png'/>";
	$(".sim").append(img2);

	var img = "<img class='foreground' src='img/simImagesForeground/" + picno + ".png'/>";
	$(".sim").append(img);
	
	var altFacts = [];
	altFacts[1] = "<p>Before you reach 1200m above sea level, altitude exposure would not have any extreme effects on the human body besides reduces physical experience.</p>";
	altFacts[2] = "<p>Between 1200m and 2400m, the human body starts to experience mild illness and drop in vision</p>";
	altFacts[3] = "<p>Moving up from 2400m, the human body will experience greater illness along with mental and psychological effects like decreased perception, memory, judgement and attention. Rising above 2500m could also lead to High-Altitude Pulmonary Edema: a life-threatening form of non-cardiogenic pulmonary edema (fluid accumulation in the lungs).</p>";
	altFacts[4] = "<p>Well, you're fucked if you went over 36050m!</p>";

	var tempFacts = [];

	if (alt <= 1200) {
		$(".fact").append(altFacts[1]);
	}
	else if ((1200 < alt) && (alt <= 2400)) {
		$(".fact").append(altFacts[2]);
	}
	else if ((2400 < alt) && (alt <= 4000)) {
		$(".fact").append(altFacts[1]);
	}