import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import cron from "node-cron";


const app = express();
app.use(cors({
  origin: "https://aurafrontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));



app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Aura Health App API');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}

);