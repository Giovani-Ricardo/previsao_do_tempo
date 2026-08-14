const axios = require('axios');

const host = 'https://api.openweathermap.org/data/2.5';
const apiKey = process.env.OPENWEATHER_API_KEY;

const params = {
    appid: apiKey,
    units: 'metric',
    lang: 'pt_br'
};

module.exports = {
    axios,
    host,
    params
};