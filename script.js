$(document).ready(function () {
	var apiKey = "ab1c0d78c19197471fbb5348c3b1f2f1";
	var cityHistory = loadFromStorage();
	
	drawHistory(cityHistory);
	
	function drawWeather(city, apiKey) {
		var date = moment().format("M/DD/YY");
		var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + apiKey;

		$.ajax({
			url: queryURL,
			method: "GET"
		})
			.then(function (weather) {
				//get city data from weather api and display on page in main body section
				var cityName = weather.name;
				var cityTemp = weather.main.temp;
				var cityHumi = weather.main.humidity;
				var cityWind = weather.wind.speed;
				var icon = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
				var image = $("<img>").attr("src", icon);

				var lat = weather.coord.lat.toFixed(2);
				var lon = weather.coord.lon.toFixed(2);

				clearCityInfo();

				$("#city-name").append(cityName + " (" + date + ") ");
				$("#city-name").append(image);
				$("#city-temp").append(cityTemp + " \u00B0F");
				$("#city-humi").append(cityHumi + "%");
				$("#city-wind").append(cityWind + " MPH");

				//UV Index Call
				var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,daily,alerts&appid=" + apiKey;

				$.ajax({
					url: oneCallURL,
					method: "GET"
				})
					.then(function (onecall) {
						//grab UVI data, append to div, and apply appropriate styling
						var cityUvi = onecall.current.uvi;
						$("#city-uvi").append(cityUvi);

						if (cityUvi < 2.99) {
							removeUvClasses();
							$("#city-uvi").addClass("bg-success text-black");
						} else if (cityUvi < 5.99) {
							removeUvClasses();
							$("#city-uvi").addClass("bg-warning text-black");
						} else if (cityUvi < 10.99) {
							removeUvClasses();
							$("#city-uvi").addClass("bg-danger text-black");
						} else if (cityUvi > 11) {
							removeUvClasses();
							$("#city-uvi").addClass("bg-dark text-white");
						} else {
							console.log("Error: " + cityUvi);
						}
					})
			})

		var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&q=" + city + "&appid=" + apiKey;

		$.ajax({
			url: forecastURL,
			method: "GET"
		})
			.then(function (forecast) {
				//iterate through array of forecast data and create html elements for each future day
				for (var i = 3; i < 40; i += 8) {
					//converts OWapi date from "2021-01-05 18:00:00" to "01/05/2021" format
					var newDate = forecast.list[i].dt_txt.split(" ", 1)
					newDate = newDate[0].split("-")
					newDate = newDate[1] + "/" + newDate[2] + "/" + newDate[0];

					//create outer column div
					var newForeCastItem = $("<div>").addClass("col");

					//create blue card div
					var newBlueCard = $("<div>").addClass("card text-white bg-primary shadow mb-5 rounded");

					//create inner card body div
					var newCardBody = $("<div>").addClass("card-body");

					//create inner card data elements
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
				}
			})
	}

	function savetoStorage(array) {

		if (array.length > 10) {
			array.pop();
		}

		localStorage.setItem("history", JSON.stringify(array));

		drawHistory(loadFromStorage());
	}

	function loadFromStorage() {
		if (localStorage.length === 0) {
			//checks for empty localStorage; if empty does nothing
			console.log("history = null")
		} else {
			cityHistory = JSON.parse(localStorage.getItem("history"));
			return cityHistory;
		}
	}

	function drawHistory(arr) {
		$(".list-group").empty();
		if (arr) {
			for (var i = 0; i < arr.length; i++) {
				var newListItem = $("<button>");
				newListItem.attr("type", "button");
				newListItem.attr("data-name", arr[i]);
				newListItem.addClass("list-group-item list-group-item-action history-btn");
				newListItem.text(arr[i]);
				$(".list-group").append(newListItem);
			}
		}
	}

	function clearCityInfo() {
		$("#city-name").empty();
		$("#city-temp").empty();
		$("#city-humi").empty();
		$("#city-wind").empty();
		$("#city-uvi").empty();
		$("#forecast-area").empty();
	}

	function removeUvClasses() {
		$("#city-uvi").removeClass("bg-success bg-warning bg-danger bg-dark text-white text-black");
	}

	// function clearHistory() {
	// 	$(".list-group").empty();
	// 	//clearCityInfo();
	// }

	$("#search-city").on("click", function (event) {
		event.preventDefault();

		var city = $("input").eq(0).val();

		if (cityHistory) {
			// console.log(city);
			cityHistory.unshift(city);
			// console.log(cityHistory);
		} else {
			cityHistory = [city];
		}

		$("#field-input").val("");
		savetoStorage(cityHistory);
		drawWeather(city, apiKey);
	})

	$(".history-btn").on("click", function (event) {
		event.stopPropagation();
		city = $(this).attr("data-name");
		drawWeather(city, apiKey);
	})

	// $("#clear-search").on("click", clearHistory());
})