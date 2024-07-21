const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const connRoutes = require('./routes/connectionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const pendingRequestsRoutes = require('./routes/pendingRequests');
const endorsementsRouter = require('./routes/endorsementRoutes');
const connectionFetchRouter = require('./routes/acceptRoutes');
const applyRouter = require('./routes/applicationRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'test',
    database: 'artistically',
}).promise()

app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);
app.use('/connections', connRoutes);
app.use('/pending', pendingRequestsRoutes);
app.use('/endorsements', endorsementsRouter);
app.use('/fetch', connectionFetchRouter);
app.use('/apply', applyRouter);


app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});
