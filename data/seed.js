const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trueshield';

/**
 * Seed Script — Import CSV data into MongoDB
 * Run: node data/seed.js
 */

// --- Simple CSV Parser ---
const parseCSV = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    rows.push(row);
  }

  return rows;
};

// --- Schemas for seed data ---
const countrySchema = new mongoose.Schema({
  code: { type: String, index: true },
  country: String,
  mobilePrefix: String,
  format: String,
  exampleNumber: String,
});

const areaCodeSchema = new mongoose.Schema({
  areaCode: { type: String, index: true },
  city: String,
  state: String,
  country: { type: String, default: 'USA' },
});

const indiaSTDSchema = new mongoose.Schema({
  stdCode: { type: String, index: true },
  city: String,
  state: String,
});

const carrierSchema = new mongoose.Schema({
  prefix: { type: String, index: true },
  carrier: String,
  country: String,
});

const spamSeedSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, index: true },
  name: String,
  type: { type: String, enum: ['spam', 'scam'] },
  reason: String,
  reportCount: Number,
  spamScore: Number,
  source: String,
});

const Country = mongoose.model('Country', countrySchema);
const AreaCode = mongoose.model('AreaCode', areaCodeSchema);
const IndiaSTD = mongoose.model('IndiaSTD', indiaSTDSchema);
const Carrier = mongoose.model('Carrier', carrierSchema);
const SpamSeed = mongoose.model('SpamSeed', spamSeedSchema);

// --- Main Seed Function ---
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const rawDir = path.join(__dirname, 'raw');

    // 1. Seed Phone Formats (Countries)
    console.log('\n📦 Seeding phone formats...');
    await Country.deleteMany({});
    const formats = parseCSV(path.join(rawDir, 'phone-formats.csv'));
    await Country.insertMany(
      formats.map((r) => ({
        code: r.CountryCode,
        country: r.Country,
        mobilePrefix: r.MobilePrefix,
        format: r.Format,
        exampleNumber: r.ExampleNumber,
      }))
    );
    console.log(`   ✅ ${formats.length} countries loaded`);

    // 2. Seed US Area Codes
    console.log('📦 Seeding US area codes...');
    await AreaCode.deleteMany({});
    const areaCodes = parseCSV(path.join(rawDir, 'us-area-codes.csv'));
    const areaCodeDocs = areaCodes
      .filter((r) => r['Area Code'] && r.City)
      .map((r) => ({
        areaCode: r['Area Code'],
        city: r.City,
        state: r.State || '',
        country: 'USA',
      }));
    if (areaCodeDocs.length > 0) {
      await AreaCode.insertMany(areaCodeDocs);
    }
    console.log(`   ✅ ${areaCodeDocs.length} US area codes loaded`);

    // 3. Seed India STD Codes
    console.log('📦 Seeding India STD codes...');
    await IndiaSTD.deleteMany({});
    const stdCodes = parseCSV(path.join(rawDir, 'india-std-codes.csv'));
    await IndiaSTD.insertMany(
      stdCodes.map((r) => ({
        stdCode: r.STD_Code,
        city: r.City,
        state: r.State,
      }))
    );
    console.log(`   ✅ ${stdCodes.length} India STD codes loaded`);

    // 4. Seed Carrier Prefixes
    console.log('📦 Seeding carrier prefixes...');
    await Carrier.deleteMany({});
    const carriers = parseCSV(path.join(rawDir, 'carrier-prefixes.csv'));
    await Carrier.insertMany(
      carriers.map((r) => ({
        prefix: r.Prefix,
        carrier: r.Carrier,
        country: r.Country,
      }))
    );
    console.log(`   ✅ ${carriers.length} carrier prefixes loaded`);

    // 5. Seed Known Spam Numbers
    console.log('📦 Seeding known spam numbers...');
    await SpamSeed.deleteMany({});
    const spamNumbers = parseCSV(path.join(rawDir, 'known-spam-numbers.csv'));
    await SpamSeed.insertMany(
      spamNumbers.map((r) => ({
        phoneNumber: r.PhoneNumber,
        name: r.Name,
        type: r.Type,
        reason: r.Reason,
        reportCount: parseInt(r.ReportCount) || 0,
        spamScore: Math.min(100, parseInt(r.ReportCount) * 0.5),
        source: r.Source,
      }))
    );
    console.log(`   ✅ ${spamNumbers.length} known spam numbers loaded`);

    // Summary
    console.log('\n🎉 Database seeding complete!');
    console.log('   Collections created:');
    console.log(`   • countries: ${formats.length}`);
    console.log(`   • areacodes: ${areaCodeDocs.length}`);
    console.log(`   • indiastds: ${stdCodes.length}`);
    console.log(`   • carriers: ${carriers.length}`);
    console.log(`   • spamseeds: ${spamNumbers.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
