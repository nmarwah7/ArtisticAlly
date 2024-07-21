const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'test',
    database: 'artistically' 
});

const endorseSkill = (req, res) => {
    const { senderEmail, receiverEmail, skill } = req.body;

    
    if (senderEmail === receiverEmail) {
        return res.status(400).json({ error: 'Invalid request: Please endorse skill for another user' });
    }

    const checkReceiverQuery = 'SELECT email FROM users WHERE email = ?';
    connection.query(checkReceiverQuery, [receiverEmail], (err, receiverResults) => {
        if (err) {
            console.error('Error checking receiver email:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (receiverResults.length === 0) {
            return res.status(404).json({ error: 'Receiver email not found' });
        }

        const checkEndorsementQuery = 'SELECT * FROM endorsements WHERE sender_email = ? AND receiver_email = ? AND skill = ?';
        connection.query(checkEndorsementQuery, [senderEmail, receiverEmail, skill], (err, endorsementResults) => {
            if (err) {
                console.error('Error checking endorsement:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (endorsementResults.length > 0) {
                return res.status(400).json({ error: 'Skill already endorsed by you' });
            }

            const endorseSkillQuery = 'INSERT INTO endorsements (sender_email, receiver_email, skill, created_at) VALUES (?, ?, ?, NOW())';
            connection.query(endorseSkillQuery, [senderEmail, receiverEmail, skill], (err, results) => {
                if (err) {
                    console.error('Error endorsing skill:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                return res.status(200).json({ message: 'Skill endorsed successfully' });
            });
        });
    });
};

module.exports = {
    endorseSkill
};
