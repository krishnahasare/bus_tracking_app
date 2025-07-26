// deleteAdmins.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js'; // Adjust the path if needed

dotenv.config(); // Load .env file

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const result = await Admin.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} admin(s)`);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Error deleting admins:', err);
    mongoose.disconnect();
  });
