const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');  

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const event = req.body;
    console.log('Received Event:', event.type);
    const services = [
        'http://localhost:4000/events',
        'http://localhost:4001/events',
        // 'http://localhost:4002/events'
    ];
    const promises = services.map((url) => {
        return axios.post(url, event).catch((err) => {
            console.log(`Error posting event to  ${url}:`);
        });
    });
    await Promise.all(promises);
    res.send({ status: 'OK' });
});

app.listen(4005, () => {
    console.log('Event Bus is running on http://localhost:4005');
});