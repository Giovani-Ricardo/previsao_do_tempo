var express = require('express');

var router = express.Router();

const { axios, host, params } = require('../config/openWeather');

// Clima atual
router.get('/', async function(req, res, next) {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({
                error: 'Informe uma cidade.'
            });
        }

        const response = await axios.get(`${host}/weather`, {
            params: {
                ...params,
                q: city
            }
        });

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


// Previsão de 5 dias
router.get('/forecast', async function(req, res, next) {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({
                error: 'Informe uma cidade.'
            });
        }

        const response = await axios.get(`${host}/forecast`, {
            params: {
                ...params,
                q: city
            }
        });

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