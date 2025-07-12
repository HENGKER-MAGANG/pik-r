require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

// Route utama
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});

// Endpoint untuk menerima laporan
app.post('/api/laporan', async (req, res) => {
	try {
		const { message } = req.body;

		if (!message || !message.trim()) {
			return res.status(400).json({ status: 'error', message: 'Pesan tidak boleh kosong!' });
		}

		// Kirim pesan ke Fonnte
		const response = await axios.post('https://api.fonnte.com/send', {
			target: process.env.MY_WHATSAPP_NUMBER, // contoh: '6281234567890'
			message: message,
			delay: 0,
			schedule: 0
		}, {
			headers: {
				Authorization: process.env.FONNTE_TOKEN // Token dari Fonnte
			}
		});

		console.log('Pesan dikirim via Fonnte:', response.data);
		res.json({ status: 'success', message: 'Laporan Anda telah diterima!' });
	} catch (error) {
		console.error('Terjadi kesalahan:', error.message);
		res.status(500).json({ status: 'error', message: 'Gagal mengirim pesan.' });
	}
});

app.listen(3000, () => console.log('Server berjalan di port 3000'));

module.exports = app;
