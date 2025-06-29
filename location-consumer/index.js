const express = require('express');
const mongoose = require('mongoose');
// const kafka = require('../shared/kafka');
const kafka = require('./shared/kafka');

const { broadcast } = require('./websocket');
const Location = require('./models/Location');
require('dotenv').config(); 

const app = express();
const PORT = 3000;
const buffer = [];

const consumer = kafka.consumer({ groupId: 'location-group' });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/locationdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('MongoDB connected via Mongoose');
});

// Kafka + WebSocket logic
async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'location-updates', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("Consumed:", data);
      buffer.push(data);
      broadcast(data); // sending to frontend
    },
  });

  // Bulk insert every 10 sec
  setInterval(async () => {
    if (buffer.length > 0) {
      const bulk = buffer.splice(0);
      const bulkOps = bulk.map(loc => ({
        updateOne: {
          filter: { vehicleId: loc.vehicleId, timestamp: loc.timestamp },
          update: { $set: loc },
          upsert: true,
        }
      }));

      console.log("bulk op ::::::", bulkOps );
      await Location.bulkWrite(bulkOps);
      console.log(`Saved ${bulkOps.length} location records`);
    }
  }, 10000);
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Flushing buffer before shutdown...');
  if (buffer.length > 0) {
    await Location.insertMany(buffer);
  }
  process.exit();
});

// Start server
app.listen(PORT, () => {
  console.log(`location-consumer running on http://localhost:${PORT}`);
  run().catch(console.error);
});
