const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'test',
    database: 'artistically'
});

const getAcceptedConnections = (req, res) => {
    const { email } = req.params;
    const query = '
        SELECT u.id, u.firstName, u.lastName, u.email
        FROM connections c
        JOIN users u ON (c.receiver_email = u.email AND c.sender_email = ?) OR (c.sender_email = u.email AND c.receiver_email = ?)
        WHERE c.status = 'accepted'
    ';
    connection.query(query, [email, email], (err, results) => {
        if (err) {
            console.error('Error fetching accepted connections:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(results);
    });
};

const getConnectionDetails = (req, res) => {
    const { email } = req.params;
    const queryUser = 'SELECT * FROM users WHERE email = ?';
    const queryEndorsements = '
        SELECT e.skill, u.firstName as endorsedByFirstName, u.lastName as endorsedByLastName
        FROM endorsements e
        JOIN users u ON e.sender_email = u.email
        WHERE e.receiver_email = ?
    ';

    connection.query(queryUser, [email], (err, userResults) => {
        if (err) {
            console.error('Error fetching user details:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        userResults[0].dateOfBirth = new Date(userResults[0].dateOfBirth).toISOString().split('T')[0];

        connection.query(queryEndorsements, [email], (err, endorsementResults) => {
            if (err) {
                console.error('Error fetching endorsements:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const userDetails = userResults[0];
            userDetails.skills = endorsementResults;
            res.status(200).json(userDetails);
        });
    });
};

module.exports = {
    getAcceptedConnections,
    getConnectionDetails
};
