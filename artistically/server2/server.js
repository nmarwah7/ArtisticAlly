const express = require('express');
const sql = require('mssql'); // Import mssql for SQL Server
const authRoutes = require('./routes/authroutes'); // Import authentication routes
const messageRoutes = require('./routes/messageRoutes'); // Import message routes
const connRoutes = require('./routes/connectionRoutes');
const pendingRequestsRoutes = require('./routes/pendingRequests');
const portfolioRoutes = require('./routes/portfolioRoutes')
const connectionFetchRouter = require('./routes/acceptRoutes');
const endorsementsRouter = require('./routes/endorsementRoutes');
const jobRoutes = require('./routes/jobRoutes');
const eventRoutes = require('./routes/eventRoutes');
const path = require('path'); // Import path module to handle file paths
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001; // Set port number

// Body Parser middleware configuration
app.use(bodyParser.json({ limit: '10mb' }));  // Increase JSON payload limit
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));  // Increase URL-encoded payload limit

// SQL Server connection configuration
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

// Connect to SQL Server database
sql.connect(config).then(() => {
    console.log('Connected to SQL Server database');
}).catch(err => {
    console.error('Error connecting to SQL Server:', err.stack);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Use authentication routes
app.use('/auth', authRoutes);

// Use message routes
app.use('/messages', messageRoutes);

app.use('/connections', connRoutes);

app.use('/pending', pendingRequestsRoutes); // Use /pending instead of /pending-requests
app.use('/portfolio', portfolioRoutes);
app.use('/fetch', connectionFetchRouter);
app.use('/endorsements', endorsementsRouter);
app.use('/jobs', jobRoutes);
app.use('/events', eventRoutes);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
