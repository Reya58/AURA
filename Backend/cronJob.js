import 'dotenv/config';
import connectDB from './src/config/db.js';
import Patient from './src/models/user.model.js';
import mongoose from 'mongoose';

// Connect to MongoDB
connectDB();

const runCronJob = async () => {
  try {
    console.log("⏳ Running cron job...");

    await Patient.updateMany(
      {},
      {
        $set: {
          "diseases.$[].medications.$[].timing.$[].status": "pending"
        }
      }
    );

    console.log("✅ Cron job completed successfully");
    process.exit(0); // exit after completion
  } catch (error) {
    console.error("❌ Error in cron job:", error);
    process.exit(1);
  }
};

runCronJob();
