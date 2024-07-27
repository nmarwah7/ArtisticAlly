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

// Function to send a connection request
const sendConnectionRequest = async (req, res) => {
    const { senderEmail, receiverEmail } = req.body;

    // Check if sender and receiver emails are the same
    if (senderEmail === receiverEmail) {
        return res.status(400).json({ error: 'Invalid request: Sender and receiver emails cannot be the same' });
    }

    try {
        let pool = await sql.connect(config);

        // Check if sender email exists
        const senderResult = await pool.request()
            .input('email', sql.VarChar, senderEmail)
            .query('SELECT email FROM users WHERE email = @email');
        if (senderResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Sender email not found' });
        }

        // Check if receiver email exists
        const receiverResult = await pool.request()
            .input('email', sql.VarChar, receiverEmail)
            .query('SELECT email FROM users WHERE email = @email');
        if (receiverResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Receiver email not found' });
        }

        // Insert connection request into connections table
        await pool.request()
            .input('senderEmail', sql.VarChar, senderEmail)
            .input('receiverEmail', sql.VarChar, receiverEmail)
            .input('status', sql.VarChar, 'pending')
            .query(`
                INSERT INTO connections (sender_email, receiver_email, status, created_at) 
                VALUES (@senderEmail, @receiverEmail, @status, GETDATE())
            `);

        res.status(200).json({ message: 'Connection request sent successfully' });
    } catch (error) {
        console.error('Error sending connection request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to accept a connection request
const acceptConnectionRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('status', sql.VarChar, 'accepted')
            .query('UPDATE connections SET status = @status WHERE id = @requestId');

        res.status(200).json({ message: 'Connection request accepted successfully' });
    } catch (error) {
        console.error('Error accepting connection request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to reject a connection request
const rejectConnectionRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('requestId', sql.Int, requestId)
            .input('status', sql.VarChar, 'rejected')
            .query('UPDATE connections SET status = @status WHERE id = @requestId');

        res.status(200).json({ message: 'Connection request rejected successfully' });
    } catch (error) {
        console.error('Error rejecting connection request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest
};
