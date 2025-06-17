# Weather Dashboard
University of Denver - Module 09 Challenge.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Description
This is a web browser application that uses the OpenWeather External API to render a 5-day weather forecast to a dashboard for specific cities. Users are able to search for a specific city's weather, and that city is then saved to search history and displayed as a clickable button on the left-hand side of the browser to easily search for that city again. Current and future weather information is presented, including the date, an icon representation of weather conditions, temperature in Fahrenheit, wind speed, and humidity.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Contributing](#contributing)
4. [Tests](#tests)
5. [License](#license)
6. [Questions](#questions)


## Installation
To install the application locally, perform the following in your terminal:

1. Clone the repository to your local computer.  
   `git clone git@github.com:lwebert/WeatherDashboard_APIs-Servers.git`
2. Check that node.js is installed.  
   `node -v`
3. Install dependencies.  
   `npm i`

## Usage
To run the application locally, use the following command in your terminal: `npm run start:dev`.

You can also utilize the deployed application hosted on Render: [https://challenge-09-weather-apis.onrender.com/](https://challenge-09-weather-apis.onrender.com/). Please contact [Lauren Webert](#questions) for help troubleshooting the deployed application, as the server may need to be re-started.

## Contributing
The back-end code for this application, including implementation of the external Web API, was built by Lauren Webert. Front-end code was provided by the University of Denver boot camp.

Here are some guidelines on ways to contribute:

Report a bug fix.
1. Create a new Issue in the GitHub repo.

Make local changes to push up.
1. Create a new branch (`git checkout -b <your-feature-branch-name>`)
2. Make your changes locally
3. Push the code back to the GitHub repo (`git push origin <your-feature-branch-name>`)
4. Create a pull request to merge your changes

## Tests
The application is working correctly if are able to search for a city in the search bar, and the current weather, as well as the weather for the next 5 days, is shown in the browser. The city should be added to the side pannel of previously searched cities.

![alt text](image.png)

## License
The application is covered under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt).   
https://www.apache.org/licenses/LICENSE-2.0.txt


## Questions
- GitHub username: [lwebert](https://github.com/lwebert).
- Reach me at [lauren@weberts.org](lauren@weberts.org) with additional questions.
