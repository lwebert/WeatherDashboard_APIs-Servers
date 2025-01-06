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
			return JSON.parse(data);
		} catch (error) {
			console.error('Error reading search history:', error);
		}
	}

	// TODO: Define a write method that writes the updated cities array to the searchHistory.json file
	private async write(cities: City[]) {
		return await fs.promises.writeFile(
			'db/searchHistory.json',
			JSON.stringify(cities, null, '\t')
		);

		// const data = JSON.stringify(cities, null, '\t');
		// await fs.promises.writeFile('db/searchHistory.json', data);
	}

	// TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
	async getCities() {
		const cities = await this.read();
		return cities;
	}

	// TODO: Define an addCity method that adds a city to the searchHistory.json file
	async addCity(city: string) {
		if (!city) {
			throw new Error('city cannot be blank');
		}

		const newCity: City = { name: city, id: uuidv4() };
		const cities = await this.getCities();

		if (cities.find((index: City) => index.name === city)) {
			return cities;
		} else {
			// const updatedCities = [...cities, newCity];
			const updatedCities = cities.concat(newCity);
			this.write(updatedCities);
		}
	}

	// * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
	async removeCity(id: string) {
		const data = await this.getCities();
		const filteredCities = data.filter(
			(data: { id: string }) => data.id !== id
		); //why this data typing?
		return await this.write(filteredCities);
	}
}

export default new HistoryService();
