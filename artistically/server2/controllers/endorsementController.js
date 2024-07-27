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

const endorseSkill = async (req, res) => {
    const { senderEmail, receiverEmail, skill } = req.body;

    if (senderEmail === receiverEmail) {
        return res.status(400).json({ error: 'Invalid request: Please endorse skill for another user' });
    }

    const checkReceiverQuery = 'SELECT email FROM users WHERE email = @receiverEmail';
    const checkEndorsementQuery = 'SELECT * FROM endorsements WHERE sender_email = @senderEmail AND receiver_email = @receiverEmail AND skill = @skill';
    const endorseSkillQuery = 'INSERT INTO endorsements (sender_email, receiver_email, skill, created_at) VALUES (@senderEmail, @receiverEmail, @skill, GETDATE())';

    try {
        let pool = await sql.connect(config);

        // Check if receiver exists
        const receiverResult = await pool.request()
            .input('receiverEmail', sql.NVarChar, receiverEmail)
            .query(checkReceiverQuery);

        if (receiverResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Receiver email not found' });
        }

        // Check if the endorsement already exists
        const endorsementResult = await pool.request()
            .input('senderEmail', sql.NVarChar, senderEmail)
            .input('receiverEmail', sql.NVarChar, receiverEmail)
            .input('skill', sql.NVarChar, skill)
            .query(checkEndorsementQuery);

        if (endorsementResult.recordset.length > 0) {
            return res.status(400).json({ error: 'Skill already endorsed by you' });
        }

        // Endorse the skill
        await pool.request()
            .input('senderEmail', sql.NVarChar, senderEmail)
            .input('receiverEmail', sql.NVarChar, receiverEmail)
            .input('skill', sql.NVarChar, skill)
            .query(endorseSkillQuery);

        return res.status(200).json({ message: 'Skill endorsed successfully' });
    } catch (err) {
        console.error('Error endorsing skill:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    endorseSkill
};
