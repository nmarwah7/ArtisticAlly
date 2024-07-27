const sql = require('mssql');

// SQL Server connection configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use encryption if required
        trustServerCertificate: false, // Change according to your security settings
    },
};

// Get accepted connections
const getAcceptedConnections = async (req, res) => {
    const { email } = req.params;
    const query = `
        SELECT u.id, u.firstName, u.lastName, u.email
        FROM connections c
        JOIN users u ON (c.receiver_email = u.email AND c.sender_email = @email) OR (c.sender_email = u.email AND c.receiver_email = @email)
        WHERE c.status = 'accepted'
    `;

    try {
        let pool = await sql.connect(config);
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(query);

        return res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching accepted connections:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get connection details
const getConnectionDetails = async (req, res) => {
    const { email } = req.params;
    const queryUser = 'SELECT * FROM users WHERE email = @contactEmail';
    const queryEndorsements = `
        SELECT e.skill, u.firstName as endorsedByFirstName, u.lastName as endorsedByLastName
        FROM endorsements e
        JOIN users u ON e.sender_email = u.email
        WHERE e.receiver_email = @contactEmail
    `;

    try {
        let pool = await sql.connect(config);
        const userResult = await pool.request()
            .input('contactEmail', sql.NVarChar, email)
            .query(queryUser);

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.recordset[0];
        user.dateOfBirth = new Date(user.dateOfBirth).toISOString().split('T')[0];

        const endorsementResult = await pool.request()
            .input('contactEmail', sql.NVarChar, email)
            .query(queryEndorsements);

        user.skills = endorsementResult.recordset;
        return res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching connection details:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAcceptedConnections,
    getConnectionDetails
};
