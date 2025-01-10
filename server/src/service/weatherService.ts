import dotenv from 'dotenv';
import { Response } from 'express';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
	lat: number;
	lon: number;
}

// TODO: Define a class for the Weather object
export class Weather {
	city: string;
	date: string;
	icon: string;
	description: string;
	temperature: number;
	windSpeed: number;
	humidity: number;

	constructor(
		city: string,
		date: string,
		icon: string,
		description: string,
		temperature: number,
		windSpeed: number,
		humidity: number
	) {
		this.city = city;
		this.date = date;
		this.icon = icon;
		this.description = description;
		this.temperature = temperature;
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
		this.baseURL = process.env.API_BASE_URL || '';
		this.apiKey = process.env.API_KEY || '';
	}

	// TODO: Create fetchLocationData method
	private async fetchLocationData() {
		//set up promise to get JSON response back. Handle error catching.
		// private async fetchLocationData(query: string) { //set up promise to get JSON response back. Handle error catching.
		const geocodeQuery = this.buildGeocodeQuery();
		try {
			const response = await fetch(geocodeQuery);
			return response.json();
		} catch (error) {
			console.error(error);
			throw new Error('Error fetching coordinate data.');
		}
	}

	// TODO: Create destructureLocationData method //Handle errors (location data is not passed). Destructure data.
	private destructureLocationData(locationData: any): Coordinates {
		const { lat, lon } = locationData.city.coord; //make more clear we are only grabbing lat & long in case it has other stuff in locationData object!
		return { lat, lon };
	}

	// TODO: Create buildGeocodeQuery method
	private buildGeocodeQuery(): string {
		return `${this.baseURL}/data/2.5/forecast?q=${this.cityName}&appid=${this.apiKey}`;
	}

	// TODO: Create buildWeatherQuery method
	private buildWeatherQuery(coordinates: Coordinates): string {
		const { lat, lon } = coordinates;
		return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
	}

	// TODO: Create fetchAndDestructureLocationData method //Call the fetchLocaitonData, chain a promise to destructure the data, return the destructured location data
	private async fetchAndDestructureLocationData() {
		const locationData = await this.fetchLocationData();
		return this.destructureLocationData(locationData);
	}

	// TODO: Create fetchWeatherData method
	// //fetch on weather query, do error handling, then get weather into a weather object via parseCurrrentWeather method. Get list of weather objects with buildForecaseArray method. Return forcast.
	private async fetchWeatherData(coordinates: Coordinates) {
		const query = this.buildWeatherQuery(coordinates);
		let response: any;
		try {
			response = await fetch(query);
		} catch (err) {
			console.error(err);
			throw new Error('Unable to fetch weather data.');
		}

		const { weather, forecast } = await this.parseCurrentWeather(response);
		//TODO: figure out correct args for buildForecastArray
		return this.buildForecastArray(weather, forecast);
	}

	// TODO: Build parseCurrentWeather method //Create new weather object from response we are reading in.
	private async parseCurrentWeather(response: Response) {
		// private async parseCurrentWeather(response: any) {
		// 	const date = dayjs.unix(response.dt).format('M/D/YYYY');
		// 	const newWeather = new Weather(
		// 		this.cityName,
		// 		date,
		// 		response.weather.icon,
		// 		response.weather.description,
		// 		response.main.temp,
		// 		response.wind.speed,
		// 		response.main.humidity
		// 	);

		//TODO: Test response format for correct parsing
		const weatherData: any = await response.json();
		const forecast = weatherData.list;

		const currentWeather = weatherData.list[0];
		const weather = new Weather(
			this.cityName,
			currentWeather.dt_txt,
			currentWeather.weather.icon,
			currentWeather.weather.description,
			currentWeather.main.temp,
			currentWeather.wind.speed,
			currentWeather.main.humidity
		);
		return { weather, forecast };
	}

	// TODO: Complete buildForecastArray method
	// //Filter weather data. If there is a time, filter to display that time/date. For each day of filtered weather, read it into an array of forcast objects. Create a list of weather objects.
	private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
		// console.log('weather data', weatherData);
		const forecast: Weather[] = [];
		weatherData.forEach((weatherItem) => {
			if (weatherItem.dt_txt === currentWeather.date) {
				return;
			}
			forecast.push(
				new Weather(
					this.cityName,
					weatherItem.dt_txt,
					weatherItem.weather.icon,
					weatherItem.weather.description,
					weatherItem.main.temp,
					weatherItem.wind.speed,
					weatherItem.main.humidity
				)
			);
		});
		// console.log('forecast: ', forecast);
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

// export default new WeatherService();
export const CallableWeatherService = new WeatherService();
