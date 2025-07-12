require('dotenv').config();

const express = require('express');
const app = express();
const twilio = require('twilio');

const bodyParser = require('body-parser');
const path = require('path');

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json()); // Use bodyParser to parse JSON

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});

// Configure Twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Endpoint to receive reports
app.post('/api/laporan', async (req, res) => {
    try {
        const { message } = req.body;
        console.log(message);
            // Check if message is valid
            if (!message || !message.trim()) {
                return res.status(400).json({ status: 'error', message: 'Pesan tidak boleh kosong!' });
            }
        // Setup WhatsApp message
        const messageResponse = await twilioClient.messages.create({
            from: 'whatsapp:+14155238886', // Twilio Sandbox number
            to: `whatsapp:${process.env.MY_WHATSAPP_NUMBER}`, // Your WhatsApp number
            body: message
        });

        console.log('WhatsApp message sent: ', messageResponse.sid);
        res.json({ status: 'success', message: 'Laporan Anda Anda Telah Di Terima!!!' });
    } catch (error) {
        console.error('Error occurred: ', error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
