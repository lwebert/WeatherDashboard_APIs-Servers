import dotenv from 'dotenv';
// import { Response } from 'express';
import dayjs, { type Dayjs } from 'dayjs';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
	lat: number;
	lon: number;
}

// TODO: Define a class for the Weather object
export class Weather {
	city: string;
	date: Dayjs | string;
	icon: string;
	iconDescription: string;
	tempF: number;
	windSpeed: number;
	humidity: number;

	constructor(
		city: string,
		date: Dayjs | string,
		icon: string,
		iconDescription: string,
		tempF: number,
		windSpeed: number,
		humidity: number
	) {
		this.city = city;
		this.date = date;
		this.icon = icon;
		this.iconDescription = iconDescription;
		this.tempF = tempF;
		this.windSpeed = windSpeed;
		this.humidity = humidity;
	}
}

// TODO: Complete the WeatherService class
class WeatherService {
	// TODO: Define the baseURL, API key, and city name properties
	private baseURL?: string;
	private apiKey?: string;
	private cityName: string = '';

	constructor() {
		this.baseURL =
			process.env.API_BASE_URL || 'https://api.openweathermap.org';
		this.apiKey = process.env.API_KEY || '';
	}

	// TODO: Create fetchLocationData method
	// private async fetchLocationData() {
	private async fetchLocationData(query: string) {
		//set up promise to get JSON response back. Handle error catching.
		this.cityName = query;

		const geocodeQuery = this.buildGeocodeQuery();

		try {
			const response = await fetch(geocodeQuery);
			return response.json();
		} catch (error) {
			console.error(error);
			throw new Error('Error fetching coordinate data.');
		}
	}

	// TODO: Create destructureLocationData method
	// //Handle errors (location data is not passed). Destructure data.
	private destructureLocationData(locationData: Coordinates): Coordinates {
		//supposed to be this!!
		// private destructureLocationData(locationData: any): Coordinates {
		const { lat, lon } = locationData; //make more clear we are only grabbing lat & long in case it has other stuff in locationData object!

		// const { lat, lon } = locationData.city.coord; //make more clear we are only grabbing lat & long in case it has other stuff in locationData object!
		return { lat, lon };
	}

	// TODO: Create buildGeocodeQuery method
	private buildGeocodeQuery(): string {
		return `${this.baseURL}/data/2.5/forecast?q=${this.cityName}&appid=${this.apiKey}&units=imperial`;
	}

	// TODO: Create buildWeatherQuery method
	private buildWeatherQuery(coordinates: Coordinates): string {
		const { lat, lon } = coordinates;
		return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
	}

	// TODO: Create fetchAndDestructureLocationData method
	// //Call the fetchLocaitonData, chain a promise to destructure the data, return the destructured location data
	private async fetchAndDestructureLocationData() {
		const locationData = await this.fetchLocationData(this.cityName);
		// console.log("fetchAndDestructureLocationData ~ locationData:", locationData);

		return this.destructureLocationData(locationData.city.coord);
	}

	// TODO: Create fetchWeatherData method
	// //fetch on weather query, do error handling, then get weather into a weather object via parseCurrrentWeather method. Get list of weather objects with buildForecaseArray method. Return forcast.
	private async fetchWeatherData(coordinates: Coordinates) {
		const query = this.buildWeatherQuery(coordinates);
		
		let response: any;
		try {
			// response = await fetch(query);
			const fetchResponse = await fetch(query);
			response = await fetchResponse.json();

			// console.log('fetchWeatherData ~ response:', response);

			if (!response.list) {
				console.error('No weather data available in the response');
				throw new Error('Weather data not found');
			}
		} catch (err) {
			console.error(err);
			throw new Error('Unable to fetch weather data.');
		}

		// console.log('fetchWeatherData ~ response:', response);

		const currentWeather = this.parseCurrentWeather(response);

		// const { weather, forecast } = await this.parseCurrentWeather(response);

		const forecast = response.list;
		return this.buildForecastArray(currentWeather, forecast);
	}

	// TODO: Build parseCurrentWeather method //Create new weather object from response we are reading in.
	private parseCurrentWeather(response: any) {
		//stuck here!
		//TODO: Test response format for correct parsing
		
		// const date = dayjs.unix(response.dt).format('M/D/YYYY');
		// const newWeather = new Weather(
		// 	this.cityName,
		// 	date,
		// 	response.weather.icon,
		// 	response.weather.description,
		// 	response.main.temp,
		// 	response.wind.speed,
		// 	response.list[0].main.humidity
		// );

		// response.list[0].weather

		// const weatherData: any = await response.json(); //this is doing something similar to JSON.parse(response), but .json() method is asynchronous
		// const weatherData: any = response; //this is doing something similar to JSON.parse(response), but .json() method is asynchronous
		// const forecast = weatherData.list;
		// if (!weatherData) {
		// 	console.error('weatherData is undefined!');
		// 	return
		// }

		const currentWeatherItem = response.list[0];

		console.log("parseCurrentWeather ~ currentWeatherItem:", currentWeatherItem);


		const currentWeather = new Weather(
			this.cityName,
			dayjs.unix(currentWeatherItem.dt).format('M/D/YYYY'),
			currentWeatherItem.weather[0].icon,
			currentWeatherItem.weather[0].description,
			currentWeatherItem.main.temp,
			currentWeatherItem.wind.speed,
			currentWeatherItem.main.humidity
		);
		return currentWeather;
	}

	// TODO: Complete buildForecastArray method
	// //Filter weather data. If there is a time, filter to display that time/date. For each day of filtered weather, read it into an array of forcast objects. Create a list of weather objects.
	private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
		const forecast: Weather[] = [currentWeather];
		console.log(weatherData[1]);
		const weatherDataFiltered = weatherData.filter((data: any) => {
			return data.dt_txt.includes('12:00:00');
		});

		for (let i = 0; i < weatherDataFiltered.length; i++) {
			// for (let i = 7; i < weatherData.length; i += 8) {
			//get 6 days of weather, day 1=[0:6], i=[7:15] is day 2
			// let weatherItem = weatherData[i];
			let weatherItem = weatherDataFiltered[i];
			
			forecast.push(
				new Weather(
					this.cityName,
					dayjs.unix(weatherItem.dt).format('M/D/YYYY'),
					weatherItem.weather[0].icon,
					weatherItem.weather[0].description,
					weatherItem.main.temp,
					weatherItem.wind.speed,
					weatherItem.main.humidity
				)
			);
		}

		return forecast;
	}

	// TODO: Complete getWeatherForCity method
	// //fetchAndDestructureLocationData to get coordinates. Call fetchWeatherData on coordinates. Error handling.
	async getWeatherForCity(city: string) {
		this.cityName = city;
		const coordinates = await this.fetchAndDestructureLocationData();
		return this.fetchWeatherData(coordinates);
	}
}

export default new WeatherService();
