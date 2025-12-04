import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from '../src/server/routes/authRoutes.js';
import analyticsRoutes from '../src/server/routes/analyticsRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const conn = await mongoose.connect(process.env.MONGO_URI);
  cachedDb = conn.connection;
  return cachedDb;
}

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Heartbeat Insights API funcionando!' });
});

export default async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
