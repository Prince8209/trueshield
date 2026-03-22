# Module 4: User Module & Profile Management

## 🎯 Objectives
- Extend the `User` model to handle profile data (`name`, `email`, `avatar`, `isVerified`).
- Introduce `spamBlockingPreferences` to let users customize how spam is handled.
- Create secure, JWT-protected API endpoints for fetching and updating user profiles.

## 🏗️ Architecture & Changes

### 1. Database Model (`src/models/user.model.js`)
We expanded the schema to include new fields essential for a caller ID application:
- `avatar`: URL to the user's profile picture.
- `isVerified`: Boolean indicating if the profile's OTP phone verification was successful.
- `spamBlockingPreferences`:
  - `blockKnownSpam`: Automatically blocks numbers flagged as high-risk in the database.
  - `blockHiddenNumbers`: Blocks numbers that hide their caller ID.

### 2. User Controller (`src/controllers/user.controller.js`)
Handles the business logic for the profile:
- `getUserProfile`: Retrieves the currently logged-in user based on the JWT `req.user.id`.
- `updateUserProfile`: Allows the user to update their `name`, `email`, and `avatar`. It also handles isolated, deep updates for the `spamBlockingPreferences` object to prevent accidental data overwriting.

### 3. User Routes (`src/routes/user.route.js`)
Defined the RESTful endpoints for the User profile:
- `GET /api/users/profile` -> Fetch my profile.
- `PUT /api/users/profile` -> Update my profile.
- **Middleware:** Both routes are protected by the `protect` JWT middleware from `auth.middleware.js`, guaranteeing only authenticated users can access them.

### 4. Integration (`src/app.js`)
Mounted the new User routes onto the main Express application under the `/api/users` path.

## 🧪 Testing the Module
A full end-to-end integration test is provided in `tests/test_module4.js`. 

**Run the test:**
```bash
node tests/test_module4.js
```

**Test Flow:**
1. Requests an OTP for a test phone number (`+919876543210`).
2. Verifies the OTP (using the dev-environment mock OTP) and receives a JWT.
3. Performs a `GET` request to `/api/users/profile` passing the JWT in the Authorization header.
4. Performs a `PUT` request to `/api/users/profile` to update the name to "John Doe" and invert the spam preferences.
5. Verifies the returned updated data matches the inputs.

## 🚀 Next Steps
With user accounts established, we can now map phone numbers to users and start building the core lookup engine in **Module 5: Phone Number Module**.
