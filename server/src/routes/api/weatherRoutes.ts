import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
	// TODO: GET weather data from city name
	const city = req.body.cityName;
	// console.log('parsed city', city);
	// let weather: Weather[] = [];
	const weather = await WeatherService.getWeatherForCity(city);
	// TODO: save city to search history
	HistoryService.addCity(city);
	  console.log('weather', weather);
	// return weather;
	return res.json(weather);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
	const cities = await HistoryService.getCities();
	return res.json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
	const id = req.params.id;
	HistoryService.removeCity(id);
	return res.json(undefined); //to get a 204, always want to respond back to the client
});

export default router;
