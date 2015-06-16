if ("WebSocket" in window){
	console.log("Websockets enabled");
	d3.select("body").append("script")
		.attr("src", "js/data_d3_ws_v2.js")
}
else{
	console.log("Websockets not enabled with browser");
	d3.select("p").insert("p")
		.style("color", "rgba(255,0,0,.7)")
		.text("Websockets are not enabled in your browser. This is likely due to your browser not being the latest version. As a result you are running a limited and slower version of the graphing tool.")
	d3.select("body").append("script")
		.attr("src", "js/data_d3.js")
}