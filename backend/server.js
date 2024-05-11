const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    user: 'default',
    host: 'ep-super-breeze-a1d0bpfn-pooler.ap-southeast-1.aws.neon.tech',
    database: 'verceldb',
    password: 'em0VrFtb7Ukl',
    port: 5432,
});

app.use(express.json());

// Endpoint untuk login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Cari user berdasarkan username
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Verifikasi password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Buat token JWT
        const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error authenticating user:', error.message);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Coba membuat koneksi pool
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to database');
    release(); // Lepaskan client kembali ke pool
});
