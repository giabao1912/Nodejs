const express = require('express');
require("dotenv").config();
const axios = require('axios')

const PORT = process.env.PORT

const app = express();

const API_KEY = process.env.API_KEY

app.use(express.static('public'));


app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const endpoint = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;

    try {
        const response = await axios.get(endpoint);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve weather data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
