$(document).ready(function () {
	var apiKey = "ab1c0d78c19197471fbb5348c3b1f2f1";

	$("#search-city").on("click", function (event) {
		event.preventDefault();

		var city = $("input").eq(0).val();

		var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + apiKey;

		$.ajax({
			url: queryURL,
			method: "GET"
		})
			.then(function (response) {
				console.log(response);
				console.log(response.name);
				console.log(response.main.temp);
				console.log(response.main.humidity);
				console.log(response.wind.speed);

				var cityName = response.name;
				var cityTemp = response.main.temp;
				var cityHum = response.main.humidity;
				var cityWind = response.wind.speed;

				$("#city-name").append(cityName);
				$("#city-temp").append(cityTemp + " \u00B0F");
				$("#city-hum").append(cityHum + "%");
				$("#city-wind").append(cityWind + " MPH");

			})

	})
})