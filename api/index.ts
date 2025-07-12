require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});

// Endpoint laporan kirim ke WhatsApp (via Fonnte)
app.post('/api/laporan', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ status: 'error', message: 'Pesan tidak boleh kosong!' });
    }

    const response = await axios.post(
      'https://api.fonnte.com/send',
      {
        target: process.env.MY_WHATSAPP_NUMBER, // nomor tujuan
        message: message,                       // isi pesan
        countryCode: '62'                       // kode negara Indonesia
      },
      {
        headers: {
          Authorization: process.env.FONNTE_TOKEN // Token dari Fonnte
        }
      }
    );

    if (response.data.status === true) {
      console.log('Pesan berhasil dikirim:', response.data);
      res.json({ status: 'success', message: 'Laporan Anda telah dikirim melalui WhatsApp!' });
    } else {
      console.error('Gagal kirim:', response.data);
      res.status(500).json({ status: 'error', message: 'Gagal mengirim pesan WhatsApp.' });
    }

  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan saat mengirim pesan.' });
  }
});

app.listen(3000, () => console.log('Server aktif di port 3000.'));
module.exports = app;
