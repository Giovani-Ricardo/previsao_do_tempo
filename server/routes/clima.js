var express = require('express');
var axios = require('axios');

var router = express.Router();

const host = 'https://api.openweathermap.org/data/2.5/weather';
var param = {
    q: 'Caraveals, BA',
    appid: process.env.API_KEY,
    units: 'metric',
    lang: 'pt_br'
}

router.get('/', async function (req, res, next) {
    try {
        const city = req.query.city;

        const response = await axios.get(
            host, { params: param }
        );

        res.json(response.data);

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json({
                error: error.response.data.message
            });
        }

        next(error);
    }
});

module.exports = router;