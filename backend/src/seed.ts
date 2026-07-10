import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environmental configuration
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/school-admission';

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
    bookedByStudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null,
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
  const adminPassword = 'AdminPass123!';
  const adminName = 'Admission Admin';

  const existingAdmin = await UserModel.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log(`User "${adminEmail}" already exists. Skipping seed.`);
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
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
        bookedByStudentId: null,
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
