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

// Send a message
const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    try {
        let pool = await sql.connect(config);

        const result = await pool.request()
            .input('senderId', sql.Int, senderId)
            .input('receiverId', sql.Int, receiverId)
            .input('message', sql.NVarChar, message)
            .query('INSERT INTO messages (sender_id, receiver_id, message, timestamp) VALUES (@senderId, @receiverId, @message, GETDATE())');

        return res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Retrieve messages between two users
const getMessages = async (req, res) => {
    const { userId, contactId } = req.params;

    try {
        let pool = await sql.connect(config);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('contactId', sql.Int, contactId)
            .query('SELECT * FROM messages WHERE (sender_id = @userId AND receiver_id = @contactId) OR (sender_id = @contactId AND receiver_id = @userId) ORDER BY timestamp');

        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Retrieve contact ID by email
const getContactId = async (req, res) => {
    const { contactEmail } = req.params;

    if (!contactEmail) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        let pool = await sql.connect(config);

        const result = await pool.request()
            .input('contactEmail', sql.NVarChar, contactEmail)
            .query('SELECT id FROM users WHERE email = @contactEmail');

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ id: result.recordset[0].id });
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Retrieve all users
const getAllUsers = async (req, res) => {
    try {
        let pool = await sql.connect(config);

        const result = await pool.request()
            .query('SELECT id, email, firstName, lastName FROM users');

        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getContactId,
    getAllUsers
};
