import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
	lat: number;
	lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
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
	private async fetchLocationData(query: string) { //set up promise to get JSON response back. Handle error catching.
		const locationData = await fetch(query);
		return locationData.json();
	}

	// TODO: Create destructureLocationData method //Handle errors (location data is not passed). Destructure data.
	private destructureLocationData(locationData: Coordinates): Coordinates {
		const { lat, lon } = locationData; //make more clear we are only grabbing lat & long in case it has other stuff in locationData object!
		return { lat, lon };
	}

	// TODO: Create buildGeocodeQuery method
	private buildGeocodeQuery(): string {
		return `${this.baseURL}/data/2.5/forcast?q=${this.cityName}&apiid=${this.apiKey}`;
	}

	// TODO: Create buildWeatherQuery method
	private buildWeatherQuery(coordinates: Coordinates): string {
		const { lat, lon } = this.destructureLocationData(coordinates);
		return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&apiid=${this.apiKey}`;
	}

	// TODO: Create fetchAndDestructureLocationData method //Call the fetchLocaitonData, chain a promise to destructure the data, return the destructured location data
	private async fetchAndDestructureLocationData() {
		const locationData = await this.fetchLocationData(this.cityName);
		return this.destructureLocationData(locationData);
	}

	// TODO: Create fetchWeatherData method //fetch on weather query, do error handling, then get weather into a weather object via parseCurrrentWeather method. Get list of weather objects with buildForecaseArray method. Return forcast.
	private async fetchWeatherData(coordinates: Coordinates) {
		const weatherData = await fetch();
	}

	// TODO: Build parseCurrentWeather method //Create new weather object from response we are reading in. 
	private parseCurrentWeather(response: any) {}

	// TODO: Complete buildForecastArray method //Filter weather data. If there is a time, filter to display that time/date. For each day of filtered weather, read it into an array of forcast objects. Create a list of weather objects.
	private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}

	// TODO: Complete getWeatherForCity method //fetchAndDestructureLocationData to get coordinates. Call fetchWeatherData on coordinates. Error handling.
	async getWeatherForCity(city: string) {}
}

export default new WeatherService();
