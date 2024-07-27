const sql = require('mssql');

// MSSQL connection configuration (ensure this matches your main server configuration)
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: false, // Change to true for local dev / self-signed certs
    },
};

// Function to fetch pending requests
const getPendingRequests = async (req, res) => {
    const { userEmail } = req.params;

    try {
        // Connect to the database
        let pool = await sql.connect(config);

        // Query to get pending requests
        const result = await pool.request()
            .input('userEmail', sql.VarChar, userEmail)
            .query(`
                SELECT * FROM connections 
                WHERE receiver_email = @userEmail AND status = 'pending'
            `);

        // Send the results as the response
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ error: 'Failed to fetch pending requests' });
    }
};

module.exports = {
    getPendingRequests
};
