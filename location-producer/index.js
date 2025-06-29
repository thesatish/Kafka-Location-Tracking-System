require('dotenv').config(); // load .env

const express = require('express');
const kafka = require('./shared/kafka');
const producer = kafka.producer();
const app = express();

const PORT = process.env.PORT || 3001;
const TOPIC = process.env.TOPIC_NAME || 'location-updates';

app.use(express.json());

async function startProducer() {
  let connected = false;
  let attempts = 0;
  const maxRetries = 10;

  while (!connected && attempts < maxRetries) {
    try {
      await producer.connect();
      connected = true;
      console.log('Kafka connected.');
    } catch (err) {
      attempts++;
      console.error(`Kafka connection failed (attempt ${attempts}):`, err.message);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  if (!connected) {
    console.error('Kafka connection failed after retries. Exiting.');
    process.exit(1);
  }

  // Start producing location data every 1 sec
  setInterval(async () => {
    const data = {
      vehicleId: 'vehicle-123',
      lat: (Math.random() * 90).toFixed(6),
      lon: (Math.random() * 180).toFixed(6),
      timestamp: new Date().toISOString(),
    };

    try {
      await producer.send({
        topic: TOPIC,
        messages: [{ value: JSON.stringify(data) }],
      });
      console.log('Produced:', data);
    } catch (err) {
      console.error('Failed to produce message:', err.message);
    }
  }, 1000);
}

app.listen(PORT, () => {
  console.log(`Producer running on http://localhost:${PORT}`);
  startProducer(); // don’t await here — run as async
});
