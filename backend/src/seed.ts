import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

import * as fs from 'fs';

// Manually parse .env to bypass any global shell environment variable overrides
let MONGO_URI = 'mongodb://localhost:27017/school-admission';
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^MONGO_URI=(.+)$/m);
    if (match && match[1]) {
      // Remove any surrounding quotes
      MONGO_URI = match[1].trim().replace(/^['"]|['"]$/g, '');
    }
  }
} catch (error) {
  console.warn('Manual .env parsing failed, falling back to process.env:', error);
  MONGO_URI = process.env.MONGO_URI || MONGO_URI;
}

console.log('Connecting to URI:', MONGO_URI);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['parent', 'admission_team'] },
  },
  { timestamps: true },
);

const UserModel = mongoose.model('User', UserSchema);

const ExamSlotSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    capacity: { type: Number, required: true, default: 1 },
    isBooked: { type: Boolean, required: true, default: false },
    bookedStudentIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Student',
      default: [],
    },
  },
  { timestamps: true },
);

const ExamSlotModel = mongoose.model('ExamSlot', ExamSlotSchema);

async function seed() {
  console.log('Connecting to database for seeding...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected successfully.');

  const adminEmail = 'admin@school.com';
  const adminPassword = 'admin123';
  const adminName = 'Admission Admin';

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const existingAdmin = await UserModel.findOne({ email: adminEmail });
  if (existingAdmin) {
    existingAdmin.password = hashedPassword;
    await existingAdmin.save();
    console.log('==================================================');
    console.log('  Database Seeding Updated Successfully (Admin)');
    console.log('==================================================');
    console.log(`  Name:     ${adminName}`);
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`  Role:     admission_team`);
    console.log('==================================================');
  } else {
    const newAdmin = new UserModel({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admission_team',
    });
    await newAdmin.save();
    console.log('==================================================');
    console.log('  Database Seeding Completed Successfully (Admin)');
    console.log('==================================================');
    console.log(`  Name:     ${adminName}`);
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`  Role:     admission_team`);
    console.log('==================================================');
  }

  // Seed default exam slots
  const slotsToSeed = [
    { date: new Date('2026-07-15T00:00:00Z'), time: '10:00 AM' },
    { date: new Date('2026-07-15T00:00:00Z'), time: '2:00 PM' },
    { date: new Date('2026-07-16T00:00:00Z'), time: '10:00 AM' },
  ];

  console.log('Seeding default exam slots...');
  for (const slot of slotsToSeed) {
    const existingSlot = await ExamSlotModel.findOne({
      date: slot.date,
      time: slot.time,
    });
    if (existingSlot) {
      console.log(
        `Exam slot ${slot.date.toISOString().split('T')[0]} at ${slot.time} already exists. Skipping.`,
      );
    } else {
      const newSlot = new ExamSlotModel({
        date: slot.date,
        time: slot.time,
        capacity: 1,
        isBooked: false,
        bookedStudentIds: [],
      });
      await newSlot.save();
      console.log(
        `Seeded exam slot for ${slot.date.toISOString().split('T')[0]} at ${slot.time}.`,
      );
    }
  }

  await mongoose.connection.close();
  console.log('Database connection closed.');
}

seed().catch((err) => {
  console.error('Seeding database failed:', err);
  process.exit(1);
});
