import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "az@system.com";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hash = await bcrypt.hash("az123", 10);

  await User.create({
    name: "System Admin",
    email,
    passwordHash: hash,
    role: "ADMIN",
    authProvider: "LOCAL"
  });

  console.log("Admin created successfully");
  process.exit();
};

run();
