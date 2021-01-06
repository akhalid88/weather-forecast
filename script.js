$(document).ready(function () {
	var apiKey = "ab1c0d78c19197471fbb5348c3b1f2f1";
	var cityHistory = [];
	var searchHistory = [];
	var city;
	var lat;
	var lon;

	drawHistory(loadFromStorage());

	$("#search-city").on("click", function (event) {
		event.preventDefault();


		var date = moment().format("M/DD/YY");
		city = $("input").eq(0).val();

		if (cityHistory) {
			console.log(city);
			cityHistory.unshift(city);
			console.log(cityHistory);
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

				lat = weather.coord.lat.toFixed(2);
				lon = weather.coord.lon.toFixed(2);



				clearData();

				$("#city-name").append(cityName + " (" + date + ") ");
				$("#city-name").append(image);
				$("#city-temp").append(cityTemp + " \u00B0F");
				$("#city-humi").append(cityHumi + "%");
				$("#city-wind").append(cityWind + " MPH");

				//UV Index Call
				queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,daily,alerts&appid=" + apiKey;

				$.ajax({
					url: queryURL,
					method: "GET"
				})
					.then(function (onecall) {

						console.log("ONE CALL");
						console.log(onecall);

						var cityUvi = onecall.current.uvi;
						$("#city-uvi").append(cityUvi);

						if (cityUvi < 2.99) {
							$("#city-uvi").addClass("bg-success");
						} else if (cityUvi < 5.99) {
							$("#city-uvi").addClass("bg-warning");
						} else if (cityUvi < 10.99) {
							$("#city-uvi").addClass("bg-danger");
						} else if (cityUvi > 11) {
							$("#city-uvi").addClass("bg-dark");
						} else {
							console.log("Error: " + cityUvi);
						}

					})



			})


		queryURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + city + "&appid=" + apiKey;

		$.ajax({
			url: queryURL,
			method: "GET"
		})
			.then(function (forecast) {

				for (var i = 0; i < 5; i++) {
					//converts OWapi date from "2021-01-05 18:00:00" to "01/05/2021" format
					var newDate = forecast.list[i].dt_txt.split(" ", 1)
					newDate = newDate[0].split("-")
					newDate = newDate[1] + "/" + newDate[2] + "/" + newDate[0];

					// creates necessary html elements for bootstrap to apply its styling
					var newForeCastItem = $("<div>").addClass("col");
					var newBlueCard = $("<div>").addClass("card text-white bg-primary");

					var newCardBody = $("<div>").addClass("card-body");
					var newcardTitle = $("<h5>").addClass("card-title").text(newDate);
					var newIcon = "https://openweathermap.org/img/wn/" + forecast.list[i].weather[0].icon + ".png";
					var newCardImage = $("<img>").attr("src", newIcon);
					var newTemp = $("<p>").addClass("card-text").text("Temp: " + forecast.list[i].main.temp + " \u00B0F");
					var newHumi = $("<p>").addClass("card-text").text("Humidity: " + forecast.list[i].main.humidity + "%");

					//append forecast card html elements from innermost to outermost element
					newCardBody.append(newcardTitle).append(newCardImage).append(newTemp).append(newHumi);
					newBlueCard.append(newCardBody);
					newForeCastItem.append(newBlueCard);
					$("#forecast-area").append(newForeCastItem);
					// $("#forecast-area").append(newForeCastItem).append(newBlueCard).append(newCardBody).append(newcardTitle).append(newCardImage).append(newTemp).append(newHumi);
				}
			})
	})

	function savetoStorage(array) {
		//max array length is 3 for testing
		if (array.length > 3) {
			array.pop();
		}
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
					$(".list-group").append(newListItem);
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
		$("#city-uvi").empty();
		$("#forecast-area").empty();
	}

	function clearHistory() {
		$(".list-group").empty();
		clearData();
	}

	$("#clear-search").on("click", clearHistory());
})