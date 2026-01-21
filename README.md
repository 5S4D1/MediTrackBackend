# 💊 MediTrack Backend

A robust RESTful API backend for managing medicine reminders, prescriptions, health notes, and emergency access. Built with **Node.js**, **Express.js**, and **Firebase** (Firestore & Authentication).

## 🚀 Live Demo

**Production URL:** [https://meditrackbackend.onrender.com](https://meditrackbackend.onrender.com)

## 📋 Features

- 🔐 **Firebase Authentication** - Secure user authentication with Firebase ID tokens
- 👤 **User Management** - Automatic user profile creation and management
- ⏰ **Medicine Reminders** - Create, read, update, and delete medicine reminders
- 💊 **Prescriptions** - Manage prescription records with images and voice notes
- 📝 **Health Notes** - Store and retrieve personal health notes
- 🚨 **Emergency Access** - Share health data via emergency access codes
- 🔒 **Secure API** - Token-based authentication for all endpoints

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5.2.1
- **Database:** Firebase Firestore
- **Authentication:** Firebase Admin SDK
- **Storage:** Firebase Cloud Storage
- **Environment:** dotenv

## 📁 Project Structure

```
MediTrackBackend/
├── config/
│   └── firebase.js              # Firebase Admin configuration
├── controllers/
│   ├── emergency.controller.js
│   ├── healthNotes.controller.js
│   ├── prescriptions.controller.js
│   ├── reminders.controller.js
│   └── user.controller.js
├── middleware/
│   └── auth.middleware.js       # Firebase token verification
├── routes/
│   ├── emergency.routes.js
│   ├── healthNotes.routes.js
│   ├── prescriptions.routes.js
│   ├── reminders.routes.js
│   └── user.routes.js
├── services/
│   ├── emergency.service.js
│   ├── healthNotes.service.js
│   ├── prescriptions.service.js
│   ├── reminders.service.js
│   └── user.service.js
├── .env                         # Environment variables
├── index.js                     # Main server file
├── package.json
└── API_DOCUMENTATION.md         # Detailed API docs
```

## 🔧 Installation

### Prerequisites

- Node.js (v16 or higher)
- Firebase project with Firestore and Authentication enabled
- Firebase Admin SDK service account key

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MediTrackBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_API_KEY=your_firebase_web_api_key
   ```

   **Where to find these:**
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: Firebase Console → Project Settings → Service Accounts → Generate New Private Key
   - `FIREBASE_STORAGE_BUCKET`: Firebase Console → Storage → Your bucket name
   - `FIREBASE_API_KEY`: Firebase Console → Project Settings → General → Web API Key

4. **Start the server**
   
   **Development mode:**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm start
   ```

   Server will run at `http://localhost:3000`

## 📡 API Endpoints

### User
- `GET /user/check` - Verify user and create profile if not exists
- `GET /user/profile` - Get user profile

### Reminders
- `POST /reminders` - Create a reminder
- `GET /reminders` - Get all user reminders
- `GET /reminders/:id` - Get specific reminder
- `PUT /reminders/:id` - Update a reminder
- `DELETE /reminders/:id` - Delete a reminder

### Prescriptions
- `POST /prescriptions` - Create a prescription
- `GET /prescriptions` - Get all user prescriptions
- `GET /prescriptions/:id` - Get specific prescription
- `PUT /prescriptions/:id` - Update a prescription
- `DELETE /prescriptions/:id` - Delete a prescription

### Health Notes
- `POST /notes` - Create a health note
- `GET /notes` - Get all user notes
- `GET /notes/:id` - Get specific note
- `PUT /notes/:id` - Update a note
- `DELETE /notes/:id` - Delete a note

### Emergency Access
- `POST /emergency/code` - Generate emergency access code
- `GET /emergency/data/:code` - Access emergency data (No auth required)
- `DELETE /emergency/code` - Revoke emergency access code

For detailed API documentation, see [API_DOCUMENTATION.md](Documentation/API_DOCUMENTATION.md)

## 🧪 Testing

### Using Thunder Client / Postman

1. Start the server
2. Create a new request
3. Set the method and URL (e.g., `GET http://localhost:3000/user/check`)
4. Add Authorization header: `Bearer <your_firebase_token>`
5. Send the request

### Using cURL

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/user/check
```

## 🌐 Deployment

This project is deployed on [Render](https://render.com). To deploy your own:

1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Add environment variables in Render dashboard
4. Deploy!

## 🔒 Security Features

- ✅ Firebase ID token verification on all protected endpoints
- ✅ User data isolation (users can only access their own data)
- ✅ CORS enabled for secure cross-origin requests
- ✅ Environment variables for sensitive configuration
- ✅ Emergency access codes with optional expiry

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**Sheikh Sadi**

## 📄 License

ISC

## 📞 Support

For issues or questions, please open an issue in the GitHub repository.

---

Made with ❤️ for better health management
