import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/job-tracker';

// Configure MongoDB connection
console.log('Attempting to connect to MongoDB...');

// Fix for the TLS error with Node.js and MongoDB Atlas
mongoose.connect(MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 30000
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    if (err.stack) {
      console.error('Error stack:', err.stack);
    }
    console.log('Running without database connection. Some features will not work.');
  });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Handle MongoDB disconnection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

app.get('/', (req, res) => {
  res.send('Job Application Tracker API');
});

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
