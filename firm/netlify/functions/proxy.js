const axios = require('axios');

exports.handler = async (event) => {
    try {
        const response = await axios.post('https://firmtracker-server.onrender.com/api/user/login', JSON.parse(event.body), {
            headers: { 'Content-Type': 'application/json' },
        });

        return {
            statusCode: response.status,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};