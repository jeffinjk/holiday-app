import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Endpoint to get holiday data
app.get('/api/holidays', async (req, res) => {
    const { country, year } = req.query;

    // Check if required parameters are provided
    if (!country || !year) {
        return res.status(400).json({ error: 'Country and year are required' });
    }

    // Use the API key from environment variables
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key is not configured' });
    }

    const apiUrl = `https://holidayapi.com/v1/holidays?key=${apiKey}&country=${country}&year=${year}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Handle API errors
        if (data.status === 402) {
            return res.status(402).json({ error: 'Access to current or future holiday data is restricted. Please upgrade your account.' });
        }

        res.json(data); // Send the holiday data as the response
    } catch (error) {
        console.error('Error fetching holidays:', error);
        res.status(500).json({ error: 'Failed to fetch holiday data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
