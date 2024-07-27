const sql = require('mssql');

// MSSQL connection configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: false, // Change to true for local dev / self-signed certs
    },
};

// Controller to add a new event
const addEvent = async (req, res) => {
    const { category, title, description, event_date, event_time, place, rsvp_link } = req.body;

    if (!category || !title || !description || !event_date || !event_time || !place) {
        return res.status(400).json({ error: 'Category, title, description, event_date, event_time, and place are required' });
    }

    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('category', sql.VarChar, category)
            .input('title', sql.VarChar, title)
            .input('description', sql.Text, description)
            .input('event_date', sql.Date, event_date)
            .input('event_time', sql.VarChar, event_time)  // Updated parameter type
            .input('place', sql.VarChar, place)
            .input('rsvp_link', sql.VarChar, rsvp_link)
            .query(`
                INSERT INTO events (category, title, description, event_date, event_time, place, rsvp_link)
                VALUES (@category, @title, @description, @event_date, @event_time, @place, @rsvp_link)
            `);

        return res.status(201).json({ message: 'Event added successfully' });
    } catch (err) {
        console.error('Error adding event:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to get all events
const getAllEvents = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT * FROM events ORDER BY event_time DESC');

        return res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching events:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addEvent,
    getAllEvents
};
