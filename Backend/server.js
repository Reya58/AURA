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
  origin: "https://aurafrontend.vercel.app", // your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
connectDB();




// Run every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("⏳ Resetting medication status at 12 AM...");

    // Update every patient's medication timing slots to pending
    await Patient.updateMany(
      {},
      {
        $set: {
          "diseases.$[].medications.$[].timing.$[].status": "pending"
        }
      }
    );

    console.log("✅ All medication statuses reset to 'pending'.");
  } catch (error) {
    console.error("❌ Error resetting medication:", error);
  }
});


app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
