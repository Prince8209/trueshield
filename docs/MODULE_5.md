# Module 5: Phone Number Module

## 🎯 Objectives
Build the core phone number parsing, validation, and local database lookup engine that powers TrueShield's caller ID.

## 🏗️ Architecture & Changes

### 1. Robust Number Parsing (`src/utils/phone.util.js`)
Integrated `google-libphonenumber` to rigorously parse incoming phone numbers into standards-compliant `E.164` format.
- Validates realistic country and mobile prefix patterns.
- Returns E.164 string, National string, Country Code, and Line Type (Mobile vs. Landline).

### 2. Expanded Database Schemas (`src/models/`)
Extracted the raw seed representations into full Mongoose models to allow fast API queries:
- `Carrier`: Global carrier prefixes.
- `IndiaSTD`: Indian landline area mapping.
- `MobileSeries`: Indian mobile prefixes (first 4 digits) to Carrier and State/Circle.
- `PhoneDirectory`: The baseline 10,000 synthetic contacts.
- `SpamSeed`: Community generated spam targets.

### 3. The Lookup Engine (`src/services/phone.service.js`)
Created a Master Lookup Pipeline:
1. `parsePhoneNumber` validates and standardizes the number.
2. We query `PhoneDirectory` for Name/Location exact matches.
3. We query `MobileSeries` (using the 4-digit national prefix) to determine exact Carrier (e.g. Jio, Airtel) and Geolocation (e.g. UP West, Maharashtra).
4. For global numbers, we fallback to the `Carrier` table prefix matching.
5. We check the `SpamSeed` index to calculate a spam score and flag.

### 4. Controller & Routes (`phone.controller.js` & `phone.route.js`)
Exposed the engine securely at `GET /api/phone/lookup/:number`. Must include a valid user JWT.

## 🧪 Testing
We ran the end-to-end lookup test simulating 4 real-world query types (synthetic user, local spam, generic Indian mobile without user report, global US phone number).
```bash
node tests/test_module5.js
```
The endpoint perfectly recognized Carriers (like Vodafone Idea, Airtel, Verizon) and local Geolocation purely through local database crunching.

## 🚀 Next Steps
We will proceed to **Module 6: External APIs**. Since the local database provides extremely fast telecom/geolocation but may miss the exact individual name, Module 6 will implement the failover connection to third-party ID services (like IPQualityScore/Apyflux).
