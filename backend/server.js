const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint untuk autentikasi login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Lakukan autentikasi disini (contoh sederhana, seharusnya menggunakan database)
    if (username === 'user' && password === 'password') {
        const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Authentication failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
