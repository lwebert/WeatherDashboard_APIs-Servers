import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
	name: string;
	id: string;

	constructor(name: string, id: string) {
		this.name = name;
		this.id = id;
	}
}

// TODO: Complete the HistoryService class
class HistoryService {
	// TODO: Define a read method that reads from the searchHistory.json file
	private async read() {
		try {
			const data = await fs.promises.readFile('db/searchHistory.json', {
				flag: 'a+',
				encoding: 'utf8',
			});
			if (!data) {
				return [];
			}
			return JSON.parse(data);
		} catch (error) {
			console.error(error);
			throw new Error('Error reading search history.');
		}
	};

	// TODO: Define a write method that writes the updated cities array to the searchHistory.json file
	private async write(cities: City[]) {
		await fs.promises.writeFile(
			'db/searchHistory.json',
			JSON.stringify(cities, null, '\t')
		);

		// const data = JSON.stringify(cities, null, '\t');
		// await fs.promises.writeFile('db/searchHistory.json', data);
	}

	// TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
	async getCities() {
		const cities: City[] = await this.read();
		return cities;
	}


	// TODO: Define an addCity method that adds a city to the searchHistory.json file
	async addCity(name: string) {
		// async addCity(city: string) {
		if (!name) {
			throw new Error('city cannot be blank');
		}
		const newCity: City = { name, id: uuidv4() };
		// const newCity: City = { name: city, id: uuidv4() };
		const cities = await this.getCities();
		// console.log(cities);
		// console.log(!cities.find((city) => city.name !== name));
		// console.log(!cities.find((city) => city.name === name));

		if (!cities.find((city) => city.name === name)) { //.find method --> return Undefined if it doesn't find something matching what you pass in; if it finds it, will be true, but the ! makes it false, so it will not run the logic; if it doesn't find it, it will run the logic
			// const updatedCities = cities.concat(newCity); //concat is meant to take 2+ arrays and create a new array from it, doesn't work with an array + object
			const updatedCities = [...cities, newCity];
			this.write(updatedCities);
		}
	}

	// * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
	async removeCity(id: string) {
		const data = await this.getCities();
		const filteredCities = data.filter(
			(city) => city.id !== id //city is an object in the data array (city is an iterative value)
		);
		await this.write(filteredCities);
	}
}

export default new HistoryService();
