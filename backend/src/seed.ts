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
    console.log('  Database Seeding Completed Successfully');
    console.log('==================================================');
    console.log(`  Name:     ${adminName}`);
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`  Role:     admission_team`);
    console.log('==================================================');
  }

  await mongoose.connection.close();
  console.log('Database connection closed.');
}

seed().catch((err) => {
  console.error('Seeding database failed:', err);
  process.exit(1);
});
