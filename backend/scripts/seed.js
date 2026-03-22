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

const Country = require('../src/models/country.model');
const AreaCode = require('../src/models/areaCode.model');
const IndiaSTD = require('../src/models/indiaSTD.model');
const Carrier = require('../src/models/carrier.model');
const SpamSeed = require('../src/models/spamSeed.model');
const MobileSeries = require('../src/models/mobileSeries.model');
const PhoneDirectory = require('../src/models/phoneDirectory.model');

// --- Main Seed Function ---
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const rawDir = path.join(__dirname, 'raw');

    // Due to time constraints in this mock script, we'll focus on the Indian DBs
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
    const dynamicSpam = parseCSV(path.join(rawDir, 'india-spam-numbers.csv'));
    const allSpam = [...spamNumbers, ...dynamicSpam];
    
    // De-duplicate spam by phone
    const uniqueSpam = Array.from(new Map(allSpam.map(item => [item.PhoneNumber, item])).values());
    
    await SpamSeed.insertMany(
      uniqueSpam.map((r) => ({
        phoneNumber: r.PhoneNumber,
        name: r.Name,
        type: r.Type,
        reason: r.Reason,
        reportCount: parseInt(r.ReportCount) || 0,
        spamScore: parseFloat(r.SpamScore) || Math.min(100, parseInt(r.ReportCount || 0) * 0.5),
        source: r.Source || 'synthetic',
      }))
    );
    console.log(`   ✅ ${uniqueSpam.length} known spam numbers loaded`);

    // 6. Seed Mobile Series
    console.log('📦 Seeding India Mobile Series...');
    await MobileSeries.deleteMany({});
    const mobileSeries = parseCSV(path.join(rawDir, 'india-mobile-series.csv'));
    await MobileSeries.insertMany(
      mobileSeries.map((r) => ({
        series: r.Series,
        operator: r.Operator,
        circle: r.Circle,
        type: r.Type,
      }))
    );
    console.log(`   ✅ ${mobileSeries.length} mobile series loaded`);

    // 7. Seed Phone Directory
    console.log('📦 Seeding Phone Directory...');
    await PhoneDirectory.deleteMany({});
    const directory = parseCSV(path.join(rawDir, 'india-phone-directory.csv'));
    
    // Bulk insert is safer for 10k items
    const chunkSize = 1000;
    for (let i = 0; i < directory.length; i += chunkSize) {
      const chunk = directory.slice(i, i + chunkSize);
      await PhoneDirectory.insertMany(
        chunk.map((r) => ({
          phoneNumber: r.PhoneNumber,
          name: r.Name,
          city: r.City,
          state: r.State,
          carrier: r.Carrier,
          type: r.Type,
          spamScore: parseInt(r.SpamScore) || 0,
        }))
      );
    }
    console.log(`   ✅ ${directory.length} directory numbers loaded`);

    // Summary
    console.log('\n🎉 Database seeding complete!');
    console.log('   Collections created:');
    console.log(`   • indiastds: ${stdCodes.length}`);
    console.log(`   • carriers: ${carriers.length}`);
    console.log(`   • spamseeds: ${uniqueSpam.length}`);
    console.log(`   • mobileseries: ${mobileSeries.length}`);
    console.log(`   • directory: ${directory.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
