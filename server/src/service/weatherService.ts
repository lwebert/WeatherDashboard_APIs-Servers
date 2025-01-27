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
	private destructureLocationData(locationData: Coordinates): Coordinates {
		const { lat, lon } = locationData; //make more clear we are only grabbing lat & long in case it has other stuff in locationData object!
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
	private async fetchAndDestructureLocationData() {
		const locationData = await this.fetchLocationData(this.cityName);
		return this.destructureLocationData(locationData.city.coord);
	}

	// TODO: Create fetchWeatherData method
	private async fetchWeatherData(coordinates: Coordinates) {
		const query = this.buildWeatherQuery(coordinates);

		let response: any;
		try {
			const fetchResponse = await fetch(query);
			response = await fetchResponse.json();

			if (!response.list) {
				console.error('No weather data available in the response');
				throw new Error('Weather data not found');
			}
		} catch (err) {
			console.error(err);
			throw new Error('Unable to fetch weather data.');
		}

		const currentWeather = this.parseCurrentWeather(response);

		return this.buildForecastArray(currentWeather, response.list);
	}

	// TODO: Build parseCurrentWeather method 
	private parseCurrentWeather(response: any) {
		const currentWeatherItem = response.list[0];

		if (
			!currentWeatherItem ||
			!currentWeatherItem.weather ||
			!currentWeatherItem.main
		) {
			throw new Error('Invalid current weather data!');
		}

		return new Weather(
			this.cityName,
			dayjs.unix(currentWeatherItem.dt).format('M/D/YYYY'),
			currentWeatherItem.weather[0].icon,
			currentWeatherItem.weather[0].description,
			currentWeatherItem.main.temp,
			currentWeatherItem.wind.speed,
			currentWeatherItem.main.humidity
		);
	}

	// TODO: Complete buildForecastArray method
	private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
		const forecast: Weather[] = [currentWeather];
		console.log(weatherData[1]);
		const weatherDataFiltered = weatherData.filter((data: any) => {
			return data.dt_txt.includes('12:00:00');
		});

		for (let i = 0; i < weatherDataFiltered.length; i++) {
		
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
	async getWeatherForCity(city: string) {
		this.cityName = city;
		const coordinates = await this.fetchAndDestructureLocationData();
		return this.fetchWeatherData(coordinates);
	}
}

export default new WeatherService();
