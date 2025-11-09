import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import cron from "node-cron";
import Patient from './src/models/Patient.js';

const app = express();

app.use(cors({
  origin: "https://aurafrontend-p577yi3cs-shreyas-projects-f842d25f.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

connectDB();

// CRON job runs every midnight
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("⏳ Resetting medication status at 12 AM...");
    await Patient.updateMany(
      {},
      { $set: { "diseases.$[].medications.$[].timing.$[].status": "pending" } }
    );
    console.log("✅ Medication reset done.");
  } catch (error) {
    console.error("❌ Error resetting medication:", error);
  }
});


export default app;
