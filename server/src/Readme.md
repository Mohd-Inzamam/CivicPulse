# CivikPlus Backend

Node.js backend for CivikPlus application with user authentication, avatar upload, and SSN management.

## Features

- User signup and login with JWT authentication
- Password and confirm password encryption using bcrypt
- Avatar upload support with Cloudinary
- MongoDB database integration
- Secure refresh token management
- Validation for all required fields

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Bcrypt (Password hashing)
- JSON Web Token (JWT)
- Cloudinary (for avatar upload)

## Installation

1. Clone the repository

```bash
git clone https://github.com/username/CivikPlus.git
Install dependencies

bash
Copy code
cd CivikPlus
npm install
Setup .env file with:

ini
Copy code
MONGODB_URI=<your_mongodb_uri>
ACCESSTOKEN_SECRET=<your_access_token_secret>
ACCESSTOKEN_EXPIRY=15m
REFRESHTOKEN_SECRET=<your_refresh_token_secret>
REFRESHTOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
Start the server

bash
Copy code
npm run dev
API Endpoints
POST /api/register → Register new user

POST /api/login → Login user

GET /api/users → Get all users (password hidden)

POST /api/upload-avatar → Upload user avatar

(Add more endpoints as your project grows)

Notes
Make sure to add .env file to keep secrets safe

.gitignore should include node_modules and .env

Author
Nishant Solanki

yaml
Copy code

---







```
