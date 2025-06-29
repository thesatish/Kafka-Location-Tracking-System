# 🚗 Real-Time Location Tracking System using Kafka, Node.js & MongoDB

This project is a real-time microservices-based system to simulate and store vehicle live location updates. It uses Kafka for message streaming, MongoDB for storage, Docker for orchestration, and Angular for live map visualization.

---

## 📦 Tech Stack

- **Node.js** – Producer & Consumer services
- **Kafka** – Message streaming
- **MongoDB** – Persistent location storage
- **WebSocket** – Real-time location streaming
- **Docker + Docker Compose** – Local orchestration

---

## 📌 Project Structure

```bash
Kafka-Location-System/
│
├── docker-compose.yml
├── location-producer/
│   ├── Dockerfile
│   ├── index.js
│   └── shared/kafka.js
│
├── location-consumer/
│   ├── Dockerfile
│   ├── index.js
│   ├── models/Location.js
│   ├── websocket.js
│   └── shared/kafka.js
│
└── .env  # Environment variables
```
---

## 🚀 Features

- 📡 **Producer** generates random vehicle coordinates every second and sends them to Kafka.
- 📥 **Consumer**:
  - Buffers received messages
  - Saves them in bulk to MongoDB every 10 seconds
  - Broadcasts live data to the frontend via WebSocket
- 📊 MongoDB stores location history
- 🐳 All services run using Docker Compose

---


## 1️⃣ Clone the Repository

```bash
git clone https://github.com/thesatish/Kafka-Location-Tracking-System.git
cd Kafka-Location-Tracking-System
