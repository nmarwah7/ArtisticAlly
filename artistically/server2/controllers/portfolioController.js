const sql = require('mssql');
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

const uploadImage = async (req, res) => {
    const { userId, imageBase64 } = req.body;

    if (!userId || !imageBase64) {
        return res.status(400).json({ error: 'User ID and image are required' });
    }

    const base64Data = imageBase64.replace(/^data:image\/jpeg;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');

    try {
        let pool = await sql.connect(config);
        const query = 'INSERT INTO portfolio (user_id, image_data) VALUES (@userId, @imageBuffer)';
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('imageBuffer', sql.VarBinary, imageBuffer)
            .query(query);

        return res.status(201).json({ message: 'Image uploaded successfully' });
    } catch (err) {
        console.error('Error saving image data to database:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const searchPortfolios = async (req, res) => {
    const { searchTerm } = req.query;

    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    const searchQuery = `%${searchTerm}%`;

    try {
        let pool = await sql.connect(config);
        const query = `
            SELECT u.id AS userId, u.firstName AS FirstName, u.lastName AS LastName, p.image_data AS ImageData
            FROM users u
            JOIN portfolio p ON u.id = p.user_id
            WHERE u.firstName LIKE @searchQuery OR u.lastName LIKE @searchQuery
        `;
        const result = await pool.request()
            .input('searchQuery', sql.NVarChar, searchQuery)
            .query(query);

        const resultsWithBase64 = result.recordset.map(result => ({
            ...result,
            ImageData: `data:image/jpeg;base64,${result.ImageData.toString('base64')}`
        }));

        return res.status(200).json(resultsWithBase64);
    } catch (err) {
        console.error('Error fetching portfolios:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getMyPortfolio = async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        let pool = await sql.connect(config);
        const query = 'SELECT image_data AS ImageData FROM portfolio WHERE user_id = @userId';
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(query);

        const resultsWithBase64 = result.recordset.map(result => ({
            ImageData: `data:image/jpeg;base64,${result.ImageData.toString('base64')}`
        }));

        return res.status(200).json(resultsWithBase64);
    } catch (err) {
        console.error('Error fetching user\'s portfolio:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    uploadImage,
    searchPortfolios,
    getMyPortfolio
};
