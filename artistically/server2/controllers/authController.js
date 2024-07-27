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

// Register a new user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, dateOfBirth, password } = req.body;

    try {
        let pool = await sql.connect(config);

        // Check if the email is already registered
        let result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT COUNT(*) AS count FROM users WHERE email = @email');

        if (result.recordset[0].count > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Insert new user into the database
        result = await pool.request()
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .input('email', sql.NVarChar, email)
            .input('phoneNumber', sql.NVarChar, phoneNumber || null)
            .input('dateOfBirth', sql.Date, dateOfBirth || null)
            .input('password', sql.NVarChar, password)
            .query('INSERT INTO users (firstName, lastName, email, phoneNumber, dateOfBirth, password) VALUES (@firstName, @lastName, @email, @phoneNumber, @dateOfBirth, @password)');

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// User login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let pool = await sql.connect(config);

        // Validate user credentials
        let result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .query('SELECT * FROM users WHERE email = @email AND password = @password');

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.recordset[0];
        return res.status(200).json({
            message: 'Login successful',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user.id,
                phone: user.phoneNumber,
                dateOfBirth: user.dateOfBirth
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    registerUser,
    loginUser
};
