const sql = require('mssql');

// MSSQL connection configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: false, // Change to true for local dev / self-signed certs
    },
};

// Controller to add a new job
const addJob = async (req, res) => {
    const { category, title, company, prerequisites, expectations, apply_link } = req.body;
    if (!category || !title || !company) {
        return res.status(400).json({ error: 'Category, title, and company are required' });
    }

    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('category', sql.VarChar, category)
            .input('title', sql.VarChar, title)
            .input('company', sql.VarChar, company)
            .input('prerequisites', sql.Text, prerequisites)
            .input('expectations', sql.Text, expectations)
            .input('apply_link', sql.VarChar, apply_link)
            .query(`
                INSERT INTO jobs (category, title, company, prerequisites, expectations, apply_link)
                VALUES (@category, @title, @company, @prerequisites, @expectations, @apply_link)
            `);

        return res.status(201).json({ message: 'Job added successfully' });
    } catch (err) {
        console.error('Error adding job:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to get all jobs
const getAllJobs = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT * FROM jobs ORDER BY created_at DESC');

        return res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching jobs:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to report a job
const reportJob = async (req, res) => {
    const { jobId, reason } = req.body;

    if (!jobId || !reason) {
        return res.status(400).json({ error: 'Job ID and reason are required' });
    }

    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('jobId', sql.Int, jobId)
            .input('reason', sql.Text, reason)
            .query('INSERT INTO job_reports (job_id, reason) VALUES (@jobId, @reason)');

        return res.status(201).json({ message: 'Job reported successfully' });
    } catch (err) {
        console.error('Error reporting job:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addJob,
    getAllJobs,
    reportJob
};
