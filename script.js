$(document).ready(function () {
	var apiKey = "ab1c0d78c19197471fbb5348c3b1f2f1";
	var cityHistory = [];
	var searchHistory = [];
	var city;

	// cityHistory = loadFromStorage();
	// drawHistory(cityHistory);
	//DEBUG
	// console.log("Init")
	// console.log(loadFromStorage());

	drawHistory(loadFromStorage());
	

	$("#search-city").on("click", function (event) {
		event.preventDefault();

		var date = moment().format("M/DD/YY");
		city = $("input").eq(0).val();

		if (cityHistory) {
			cityHistory.push(city);
		} else {
			cityHistory = [city];
		}

		var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + apiKey;

		savetoStorage(cityHistory);

		$.ajax({
			url: queryURL,
			method: "GET"
		})
			.then(function (weather) {

				$("input").empty();

				var cityName = weather.name;
				var cityTemp = weather.main.temp;
				var cityHumi = weather.main.humidity;
				var cityWind = weather.wind.speed;
				var icon = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
				var image = $("<img>").attr("src", icon);

				clearData();

				$("#city-name").append(cityName + " (" + date + ") ");
				$("#city-name").append(image);
				$("#city-temp").append(cityTemp + " \u00B0F");
				$("#city-humi").append(cityHumi + "%");
				$("#city-wind").append(cityWind + " MPH");
			})


		queryUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + city + "&appid=" + apiKey;

		$.ajax({
			url: queryUrl,
			method: "GET"
		})
			.then(function (forecast) {
				for(var i = 0; i < 5; i++) {
					// console.log(forecast.list[i].weather[0].icon);
					var newForeCastItem = $("<div>").addClass("col");
					var newBlueCard = $("<div>").addClass("card text-white bg-primary");
					
					var newCardBody = $("<div>").addClass("card-body");
					var newcardTitle = $("<h5>").addClass("card-title").text("1/6/2021");
					var newIcon = "https://openweathermap.org/img/wn/" + forecast.list[i].weather[0].icon + ".png";
					var newCardImage = $("<img>").attr("src", newIcon);
					var newTemp = $("<p>").addClass("card-text").text("Temp: " + forecast.list[i].main.temp + " \u00B0F");
					var newHumi = $("<p>").addClass("card-text").text("Humidity: " + forecast.list[i].main.humidity + "%");

					newCardBody.append(newcardTitle).append(newCardImage).append(newTemp).append(newHumi);
					newBlueCard.append(newCardBody);
					newForeCastItem.append(newBlueCard);
					$("#forecast-area").append(newForeCastItem);
					// $("#forecast-area").append(newForeCastItem).append(newBlueCard).append(newCardBody).append(newcardTitle).append(newCardImage).append(newTemp).append(newHumi);
				}
			})
	})

	function savetoStorage(array) {
		localStorage.setItem("history", JSON.stringify(array));
		console.log("Save")
		console.log(array);
		drawHistory(loadFromStorage());
	}

	function loadFromStorage() {
		if (localStorage.length === 0) {
			console.log("history = null")
		} else {
			searchHistory = JSON.parse(localStorage.getItem("history"));
			return searchHistory;
		}
	}

	function drawHistory(arr) {

		//DEBUG
		// console.log("Draw");
		// console.log(arr);
		$(".list-group").empty();
		if (arr) {
			
			for (var i = 0; i < arr.length; i++) {
				if (arr[i]) {
					var newListItem = $("<button>");
					newListItem.attr("type", "button");
					newListItem.addClass("list-group-item list-group-item-action");
					newListItem.text(arr[i]);
					$(".list-group").prepend(newListItem);
				}
			}
		}
	}

	function clearData() {
		$("#city-name").empty();
		$("#city-name").empty();
		$("#city-temp").empty();
		$("#city-humi").empty();
		$("#city-wind").empty();
		$("#forecast-area").empty();
	}

	function clearHistory() {
		$(".list-group").empty();
		clearData();
	}

	$("#clear-search").on("click", clearHistory());
})