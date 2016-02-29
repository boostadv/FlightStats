$(function () {

	var g = Snap("#map");
	g.attr({ viewBox: [0, 0, 1000, 600] });

	var monthNames = ["январь", "февраль", "март", "апрель", "май", "июнь",
		"июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];

	var currentDate = new Date();
	
	function showDates(date)
	 {	
		 
	var _date = new Date(date.getTime());
		 
	$("#blocks").empty();
			 
	for (var i = 0; i < 5; i++) {
		$("#blocks").append('<div class="block"><h2>' + _date.getDate() + '</h2><p>' + monthNames[_date.getMonth()] + '</p></div>');
	   		_date.setDate(_date.getDate() + 1);
	}};
	
	showDates(currentDate);
	
	$("#showNextDates").click(function() {
	currentDate.setDate(currentDate.getDate() + 5);
	showDates(currentDate);
	$("#showPrevDates").css("visibility", "visible");
	});
	
		
	$("#showPrevDates").click(function() {
	currentDate.setDate(currentDate.getDate() - 5);
	showDates(currentDate);
	if (currentDate < new Date()) {
		$("#showPrevDates").css("visibility", "hidden");
	}
	});
	
	var cities = [

		{ x: 583, y: 275, current: true, name: "Москва" },
		//{ x: 557, y: 251, current: false, name: "Санкт-Петербург" },
		{ x: 271, y: 340, current: false, name: "Нью-Йорк", white: true },
		{ x: 631, y: 390, current: false, name: "Дубай" },
		{ x: 896, y: 568, current: false, name: "Канберра", white: true },
		//{ x: 651, y: 260, current: false, name: "Екатеринбург" },
		{ x: 360, y: 528, current: false, name: "Рио-де-Жанейро", white: true },
		{ x: 872, y: 354, current: false, name: "Токио", white: true },
	];


	Snap.load("res/map.svg", function (f) {
		var gr = f.select("svg"),
			top = g.g();

		var currentPos = { x: 0, y: 0 };

		function drawCity(x, y, name, current, white) {
			if (current == true) { currentPos.x = x; currentPos.y = y; }
			var rad = 3, fillColor = "#044D69", fontSize = "11pt", fontColor = "#000";
			if (current == true) { rad = 4; fillColor = "#044D69"; fontSize = "11pt" }
			if (white == true) { fontColor = "#fff"; }
			var city = gr.circle(x, y, rad).attr({ fill: fillColor });



			if (current != true) {

				var lineX, lineY;

				if (currentPos.x - x > 0) {
					lineX = currentPos.x - Math.abs(currentPos.x - x) / 2;
				} else {
					lineX = currentPos.x + Math.abs(currentPos.x - x) / 2;
				}

				if (currentPos.y - y > 0) {
					lineY = currentPos.y - Math.abs(currentPos.y - y) / 2 - 10 - ((Math.abs(currentPos.y - y) / 100) * 20);
				} else {
					lineY = currentPos.y + Math.abs(currentPos.y - y) / 2 + 10 + ((Math.abs(currentPos.y - y) / 100) * 20);
				}

				var path = gr.path("M" + currentPos.x + " " + currentPos.y + " Q " + lineX + " " + lineY + " " + x + " " + y).attr({
					fill: "none",
					stroke: "#174665",
					strokeWidth: 0.75,
					strokeDasharray: "5 1"
				});

				cityAnimate(path, 0.5);

			}



			gr.text(city.getBBox().x2 + 3, city.getBBox().y2 - 8, name).attr({ fontSize: fontSize, fill: fontColor});

		}



		function cityAnimate(path, startPos) {

			var plane = gr.path("M-2.282-6.074l0.001,3.926l-3.318,2.101C-5.7-0.66-6.141-1.885-6.775-1.891c-0.734,0.003-1.203,1.596-1.208,2.062l0.001,1.29l-2.328,1.474v2.858l2.327-0.827v0.116h2.406l0.001-0.972l3.299-1.172l0.593,4.73l-2.83,2.773v1.611l3.217-1.877h2.588l3.214,1.877v-1.611l-3.007-2.95l0.776-4.552L5.58,4.107V5.08l2.401-0.006V4.959l2.327,0.825V2.926L7.982,1.452L7.981,0.169c0-0.461-0.472-2.058-1.208-2.062c-0.629-0.01-1.08,1.227-1.182,1.838L2.277-2.162V-6.08c-0.006-1.333-0.89-5.986-2.286-5.972C-1.388-12.056-2.282-7.413-2.282-6.074z").attr({ fill: "#1E73A0" });


			var flag, len = Snap.path.getTotalLength(path.attr("d"));

			var sizet = 1;

			Snap.animate(len * startPos, len, function (l) {

				g.attr({ width: 100 + (flag = !flag ? 1e-5 : 0) + "%" });

				var dot = path.getPointAtLength(l);


				if (((len - l) / l) * 100 <= 3) if (sizet > 0.05) { sizet = sizet - 0.05; }

				plane.attr({
					transform: "t" + [dot.x, dot.y] +
					"r" + (dot.alpha - 90) + "s" + sizet
				});

				if (l == len) {
					plane.remove();
				}

			}, getRandomInt(20000, 60000), null, function () {
				cityAnimate(path, 0);
			});

		}


		for (var i = 0; i < cities.length; i++) {
			drawCity(cities[i].x, cities[i].y, cities[i].name, cities[i].current, cities[i].white);
		}


		top.add(gr);


	});


});

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
