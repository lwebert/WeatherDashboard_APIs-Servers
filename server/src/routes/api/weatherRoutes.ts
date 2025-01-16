import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
	// TODO: GET weather data from city name
	const city = req.body.cityName; //this is passed into the body section of the request via the payload. You can see this in the payload section of Network (inspect)

	const weather = await WeatherService.getWeatherForCity(city);

	// TODO: save city to search history
	HistoryService.addCity(city);
	return res.json(weather);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
	const cities = await HistoryService.getCities();
	return res.json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
	const cityId = req.params.id;
	HistoryService.removeCity(cityId).catch((err: any) => {
		console.error(err);
		throw new Error('Unable to delete city from history.');
	});
	return res.json(undefined); //to get a 204, always want to respond back to the client
	//200 and 204 are http response codes, indicative of what the consumer of the API endpoint should be expecting. Something should be there if 200 series code. 
	//204 code = it was successful, we did what you needed, nothing you need to know/see/get back. Ex. void returning
	//Ex. post request or get request --> 200 response code. We got your request, did something, and inside of response.data you'll find the response
});

export default router;
