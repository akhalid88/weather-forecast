$(document).ready(function () {
	var apiKey = "ab1c0d78c19197471fbb5348c3b1f2f1";
	var cityHistory = [];
	var searchHistory = [];

	drawHistory(loadFromStorage());

	$("#search-city").on("click", function (event) {
		event.preventDefault();

		var date = moment().format("M/DD/YY");
		var city = $("input").eq(0).val();
		cityHistory.push(city);
		var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + apiKey;
		console.log(cityHistory);
		savetoStorage(cityHistory);
		$.ajax({
			url: queryURL,
			method: "GET"
		})
			.then(function (response) {
				$("input").eq(0).empty();
				//$("#field-input").empty();
				var cityName = response.name;
				var cityTemp = response.main.temp;
				var cityHum = response.main.humidity;
				var cityWind = response.wind.speed;

				// var date = new Date(response.sys.sunrise);
				// var date = date.toDateString();
				var image = $("<img>");
				var icon = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
				image.attr("src", icon);
				console.log(response.sys.sunrise);

				clearData();

				$("#city-name").append(cityName + " (" + date + ") ");
				$("#city-name").append(image);
				$("#city-temp").append(cityTemp + " \u00B0F");
				$("#city-hum").append(cityHum + "%");
				$("#city-wind").append(cityWind + " MPH");
			})

		function clearData() {
			$("#city-name").empty();
			$("#city-name").empty();
			$("#city-temp").empty();
			$("#city-hum").empty();
			$("#city-wind").empty();
		}

	})

	function savetoStorage(array) {
		localStorage.setItem("history", JSON.stringify(array));
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
		var searchHistory = loadFromStorage();
		console.log(searchHistory)
	}

})