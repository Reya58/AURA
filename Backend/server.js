import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import cron from "node-cron";
import Patient from './src/models/user.model.js';

const app = express();
app.use(cors({
  origin: "https://aurafrontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));



app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Aura Health App API');
});

// Inside server.js
app.get("/api/cron/run", async (req, res) => {
  try {
    // Your cron logic
    await Patient.updateMany(
      {},
      { $set: { "diseases.$[].medications.$[].timing.$[].status": "pending" } }
    );
    return res.status(200).json({ message: "Cron triggered!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}

);