# MediTrack Backend API Documentation

## Overview
MediTrack is a backend API for managing medicine reminders, prescriptions, health notes, AI chat assistance, and emergency access. Built with Express.js, Firebase Firestore, Firebase Storage, and OpenAI.

**Base URL (Production):** `https://meditrackbackend.onrender.com`  
**Base URL (Local):** `http://localhost:3000`  
**Author:** Sheikh Sadi  
**Version:** 1.0.0

---

## Table of Contents
- [Authentication](#authentication)
- [User Endpoints](#user-endpoints)
- [Reminders Endpoints](#reminders-endpoints)
- [Prescriptions Endpoints](#prescriptions-endpoints)
- [Health Notes Endpoints](#health-notes-endpoints)
- [AI Chat Endpoints](#ai-chat-endpoints)
- [Emergency Access Endpoints](#emergency-access-endpoints)
- [Error Handling](#error-handling)

---

## Authentication

All endpoints (except emergency data retrieval) require Firebase Authentication.

### Headers Required
```
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

### Authentication Middleware
- Validates Firebase ID tokens
- Extracts user information (uid, email)
- Returns `401 Unauthorized` for invalid/missing tokens

---

## User Endpoints

### User Profile
Gets comprehensive user profile information including health data and emergency access details. Creates user document if it doesn't exist.

**Endpoint:** `GET /user/profile`  
**Auth Required:** Yes

#### What It Does
- Validates Firebase ID token
- Creates user document if not exists with automatic emergency access setup
- Returns complete user profile with health information

#### Response
```json
{
  "success": true,
  "message": "User verified",
  "uid": "user_firebase_uid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://example.com/photo.jpg",
  "bloodGroup": "A+",
  "weight": 70,
  "height": 175,
  "phone": "+1234567890",
  "allergies": ["Penicillin", "Peanuts"],
  "emergencyAccess": {
    "id": "emergency_access_id",
    "accessId": "emergency_access_id",
    "sharedData": [],
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
}
```

#### Notes
- Emergency access is automatically created for new users
- All health fields (bloodGroup, weight, height, phone, allergies) are optional
- This endpoint should be called after user authentication to ensure user profile exists

---

### Check User (Simple)
Simple endpoint for checking user authentication status.

**Endpoint:** `GET /user/check`  
**Auth Required:** Yes

#### Response
```json
{
  "message": "User verified",
  "uid": "firebase_user_id"
}
```

---

## Reminders Endpoints

### Create Reminder
Creates a new medicine reminder for the authenticated user.

**Endpoint:** `POST /reminders`  
**Auth Required:** Yes

#### Request Body
```json
{
  "medicineName": "Aspirin",
  "dosage": "100mg",
  "time": "09:00 AM",
  "repeat": "daily",
  "imageURL": "https://example.com/image.jpg",
  "voiceNoteURL": "https://example.com/voice.mp3"
}
```

#### Required Fields
- `medicineName` (string)
- `dosage` (string)
- `time` (string)
- `repeat` (string)

#### Optional Fields
- `imageURL` (string)
- `voiceNoteURL` (string)

#### Response
```json
{
  "success": true,
  "message": "Reminder created",
  "reminderId": "auto_generated_id"
}
```

---

### Get All Reminders
Retrieves all reminders for the authenticated user, ordered by creation date (descending).

**Endpoint:** `GET /reminders`  
**Auth Required:** Yes

#### Response
```json
{
  "success": true,
  "reminders": [
    {
      "reminderId": "reminder_id_1",
      "medicineName": "Aspirin",
      "dosage": "100mg",
      "time": "09:00 AM",
      "repeat": "daily",
      "imageURL": "https://example.com/image.jpg",
      "voiceNoteURL": "https://example.com/voice.mp3",
      "status": "pending",
      "createdAt": "2026-01-09T10:00:00.000Z"
    }
  ]
}
```

---

### Get Single Reminder
Retrieves a specific reminder by ID.

**Endpoint:** `GET /reminders/:id`  
**Auth Required:** Yes

#### URL Parameters
- `id` - Reminder ID

#### Response (Success)
```json
{
  "success": true,
  "reminder": {
    "reminderId": "reminder_id_1",
    "medicineName": "Aspirin",
    "dosage": "100mg",
    "time": "09:00 AM",
    "repeat": "daily",
    "imageURL": "https://example.com/image.jpg",
    "voiceNoteURL": "https://example.com/voice.mp3",
    "status": "pending",
    "createdAt": "2026-01-09T10:00:00.000Z"
  }
}
```

#### Response (Not Found)
```json
{
  "error": "Reminder not found"
}
```
**Status Code:** `404`

---

### Update Reminder
Updates an existing reminder.

**Endpoint:** `PUT /reminders/:id`  
**Auth Required:** Yes

#### URL Parameters
- `id` - Reminder ID

#### Request Body
```json
{
  "medicineName": "Updated Medicine",
  "dosage": "200mg",
  "time": "10:00 AM",
  "status": "completed"
}
```

#### Response
```json
{
  "success": true,
  "message": "Reminder updated"
}
```

---

### Delete Reminder
Deletes a reminder.

**Endpoint:** `DELETE /reminders/:id`  
**Auth Required:** Yes

#### URL Parameters
- `id` - Reminder ID

#### Response
```json
{
  "success": true,
  "message": "Reminder deleted"
}
```

---

## Prescriptions Endpoints

### Create Prescription
Creates a new prescription record with optional file upload to Firebase Storage.

**Endpoint:** `POST /prescriptions`  
**Auth Required:** Yes  
**Content-Type:** `multipart/form-data`

#### Request (Multipart Form Data)
```
Field: image (file) - Optional prescription image/PDF (max 10MB)
Field: doctorName (text) - Optional
Field: hospital (text) - Optional
Field: dateIssued (text) - Optional
Field: notes (text) - Optional
```

#### Features
- Automatic file upload to Firebase Storage
- Generates signed URL valid for 1 year
- Supports images and PDFs up to 10MB
- Stores file metadata (name, type, storage path)

#### Response
```json
{
  "success": true,
  "message": "Prescription created",
  "prescriptionId": "auto_generated_id"
}
```

#### Notes
- If file is uploaded, `fileURL`, `fileType`, `fileName`, and `storagePath` are automatically added
- Files are stored in path: `users/{uid}/prescriptions/{timestamp}_{filename}`
- Signed URLs are valid for 1 year from creation

---

### Get All Prescriptions
Retrieves all prescriptions for the authenticated user, ordered by creation date (descending).

**Endpoint:** `GET /prescriptions`  
**Auth Required:** Yes

#### Response
```json
{
  "success": true,
  "prescriptions": [
    {
      "prescriptionId": "prescription_id_1",
      "fileURL": "https://storage.googleapis.com/...",
      "fileType": "image/jpeg",
      "fileName": "prescription_scan.jpg",
      "storagePath": "users/uid123/prescriptions/1234567890_prescription_scan.jpg",
      "doctorName": "Dr. John Smith",
      "hospital": "City Hospital",
      "dateIssued": "2026-01-20T00:00:00.000Z",
      "notes": "Take medicine after meals",
      "createdAt": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### Get Single Prescription
Retrieves a specific prescription by ID.

**Endpoint:** `GET /prescriptions/:id`  
**Auth Required:** Yes

#### URL Parameters
- `id` - Prescription ID

#### Response (Success)
```json
{
  "success": true,
  "prescription": {
    "prescriptionId": "prescription_id_1",
    "fileURL": "https://storage.googleapis.com/...",
    "fileType": "application/pdf",
    "fileName": "prescription.pdf",
    "storagePath": "users/uid123/prescriptions/1234567890_prescription.pdf",
    "doctorName": "Dr. John Smith",
    "hospital": "City Hospital",
    "dateIssued": "2026-01-20T00:00:00.000Z",
    "notes": "Take medicine after meals",
    "createdAt": "2026-01-09T10:00:00.000Z"
  }
}
```

#### Response (Not Found)
```json
{
  "error": "Prescription not found"
}
```
**Status Code:** `404`

---

### Update Prescription
Updates an existing prescription.

**Endpoint:** `PUT /prescriptions/:id`  
**Auth Required:** Yes

#### URL Parameters
- `id` - Prescription ID

#### Request Body
```json
{
  "doctorName": "Dr. Jane Doe",
  "notes": "Updated notes"
}
```

#### Response
```json
{
  "success": true,
  "message": "Prescription updated"
}
```

---

### Delete Prescription
Deletes a prescription record and associated file from Firebase Storage.

**Endpoint:** `DELETE /prescriptions/:id`  
**Auth Required:** Yes

#### URL Parameters
- `id` - Prescription ID

#### Response
```json
{
  "success": true,
  "message": "Prescription deleted"
}
```

#### Notes
- Automatically deletes the file from Firebase Storage if it exists
- Returns 404 if prescription not found

---

## Health Notes Endpoints

### Create Health Note
Creates a new health note for the authenticated user.

**Endpoint:** `POST /notes`  
**Auth Required:** Yes

#### Request Body
```json
{
  "title": "Doctor Appointment",
  "content": "Discussed treatment plan and follow-up schedule"
}
```

#### Required Fields
- `title` (string)
- `content` (string)

#### Response
```json
{
  "success": true,
  "message": "Note created",
  "noteId": "auto_generated_id"
}
```

---

### Get All Health Notes
Retrieves all health notes for the authenticated user, ordered by creation date (descending).

**Endpoint:** `GET /notes`  
**Auth Required:** Yes

#### Response
```json
{
  "success": true,
  "notes": [
    {
      "noteId": "note_id_1",
      "title": "Doctor Appointment",
      "content": "Discussed treatment plan and follow-up schedule",
      "createdAt": "2026-01-09T10:00:00.000Z"
    }
  ]
}
```

---

### Get Single Health Note
Retrieves a specific health note by ID.

**Endpoint:** `GET /notes/:id`  
**Auth Required:** Yes

#### URL Parameters
- `id` - Note ID

#### Response (Success)
```json
{
  "success": true,
  "note": {
    "noteId": "note_id_1",
    "title": "Doctor Appointment",
    "content": "Discussed treatment plan and follow-up schedule",
    "createdAt": "2026-01-09T10:00:00.000Z"
  }
}
```

#### Response (Not Found)
```json
{
  "error": "Note not found"
}
```
**Status Code:** `404`

---

### Update Health Note
Updates an existing health note.

**Endpoint:** `PUT /notes/:id`  
**Auth Required:** Yes

#### URL Parameters
- `id` - Note ID

#### Request Body
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Response
```json
{
  "success": true,
  "message": "Note updated"
}
```

---

### Delete Health Note
Deletes a health note.

**Endpoint:** `DELETE /notes/:id`  
**Auth Required:** Yes

#### URL Parameters
- `id` - Note ID

#### Response
```json
{
  "success": true,
  "message": "Note deleted"
}
```

---

## AI Chat Endpoints

### Chat with AI
Send a message to the AI assistant for medical and diet advice. Uses OpenAI GPT-4o-mini model.

**Endpoint:** `POST /chat`  
**Auth Required:** Yes

#### Request Body
```json
{
  "message": "What foods should I avoid with high blood pressure?",
  "topic": "diet"
}
```

#### Required Fields
- `message` (string) - The user's question or message

#### Optional Fields
- `topic` (string) - Category of the chat (e.g., "diet", "health", "medication", "general")

#### Response
```json
{
  "success": true,
  "reply": "For high blood pressure, it's recommended to avoid: 1) High sodium foods like processed meats and canned soups, 2) Excessive caffeine, 3) Alcohol in large amounts..."
}
```

#### Error Response (No Message)
```json
{
  "error": "Message is required"
}
```
**Status Code:** `400`

#### Features
- Powered by OpenAI GPT-4o-mini
- AI acts as a friendly medical and diet assistant
- Provides safe, simple, non-diagnostic advice
- All conversations are automatically saved to chat history

#### Notes
- The AI is configured to provide friendly, non-diagnostic health advice
- Each chat interaction is logged in Firestore with timestamp
- Limited to 50 most recent chats per user in history

---

### Get Chat History
Retrieves user's chat history with the AI assistant.

**Endpoint:** `GET /chat/history`  
**Auth Required:** Yes

#### Response
```json
{
  "success": true,
  "history": [
    {
      "chatId": "chat_id_1",
      "userMessage": "What foods should I avoid with high blood pressure?",
      "botReply": "For high blood pressure, it's recommended to avoid...",
      "topic": "diet",
      "timestamp": "2026-01-20T10:30:00.000Z"
    },
    {
      "chatId": "chat_id_2",
      "userMessage": "How much water should I drink daily?",
      "botReply": "Generally, adults should aim for 8 glasses...",
      "topic": "health",
      "timestamp": "2026-01-20T09:15:00.000Z"
    }
  ]
}
```

#### Notes
- Returns up to 50 most recent chat messages
- Ordered by timestamp (most recent first)
- Includes both user messages and AI responses

---

## Emergency Access Endpoints

### Create Emergency Access
Generates an emergency access token for sharing medical information.

**Endpoint:** `POST /emergency`  
**Auth Required:** Yes

#### Request Body
```json
{
  "sharedData": ["prescriptions", "reminders", "healthNotes"]
}
```

#### Response
```json
{
  "success": true,
  "message": "Emergency access created",
  "data": {
    "accessId": "auto_generated_access_id",
    "emergencyURL": "https://meditrackweb.vercel.app/emergency/auto_generated_access_id"
  }
}
```

---

### Get Emergency Data
Retrieves emergency medical data using access ID (public endpoint).

**Endpoint:** `GET /emergency/:uid/:accessId`  
**Auth Required:** No

#### URL Parameters
- `uid` - User ID (Firebase UID)
- `accessId` - Emergency Access ID

#### Response (Success)
```json
{
  "success": true,
  "data": {
    "accessId": "access_id_1",
    "sharedData": ["prescriptions", "reminders", "healthNotes"],
    "createdAt": "2026-01-09T10:00:00.000Z"
  }
}
```

#### Response (Not Found)
```json
{
  "error": "Emergency access not found"
}
```
**Status Code:** `404`

---

## Error Handling

### Standard Error Responses

#### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```
or
```json
{
  "error": "Invalid token"
}
```

#### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

#### 400 Bad Request
```json
{
  "error": "Message is required"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Failed to [action description]"
}
```

---

## Data Models

### User
```typescript
{
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  bloodType?: string | null;
  weight?: number | null;
  height?: number | null;
  phone?: string | null;
  allergies?: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Reminder
```typescript
{
  reminderId: string;
  medicineName: string;
  dosage: string;
  time: string;
  repeat: string;
  imageURL?: string | null;
  voiceNoteURL?: string | null;
  status: string; // "pending" by default
  createdAt: Date;
}
```

### Prescription
```typescript
{
  prescriptionId: string;
  fileURL?: string;
  fileType?: string;
  fileName?: string;
  storagePath?: string; // Firebase Storage path
  doctorName?: string | null;
  hospital?: string | null;
  dateIssued?: Date;
  notes?: string | null;
  createdAt: Date;
}
```

### Health Note
```typescript
{
  noteId: string;
  title: string;
  content: string;
  createdAt: Date;
}
```

### Chat Log
```typescript
{
  chatId: string;
  userMessage: string;
  botReply: string;
  topic: string; // "general", "diet", "health", "medication", etc.
  timestamp: Date;
}
```

### Emergency Access
```typescript
{
  accessId: string;
  sharedData: string[];
  createdAt: Date;
}
```

---

## Environment Variables

Create a `.env` file with the following:

```env
PORT=3000

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_STORAGE_BUCKET=your_storage_bucket

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

---

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start at `http://localhost:3000`

---

## Key Features

### File Upload Support
- Prescriptions support multipart/form-data file uploads
- Files stored in Firebase Storage with signed URLs
- Automatic cleanup when prescriptions are deleted
- Maximum file size: 10MB
- Supported formats: Images (JPG, PNG) and PDFs

### AI Integration
- Powered by OpenAI GPT-4o-mini
- Provides medical and diet advice
- Non-diagnostic, educational responses
- Automatic chat history logging
- Topic categorization support

### Emergency Access
- Automatically created for new users
- Shareable access via QR codes
- Public endpoint for emergency data retrieval
- No authentication required for emergency access

### Authentication
- Firebase Authentication integration
- JWT token validation
- Automatic user profile creation
- Secure user data isolation

---

## Notes

- All timestamps are stored as JavaScript `Date` objects in Firestore
- User data is stored in subcollections under `/users/{uid}/`
- All authenticated endpoints automatically extract user UID from the Firebase token
- Emergency access URLs can be used to generate QR codes for quick sharing
- The API uses Firebase Firestore for data persistence and Firebase Storage for file storage
- CORS is enabled for all origins
- AI chat is limited to 50 messages per user in history
- Prescription file signed URLs expire after 1 year

---

## Dependencies

```json
{
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "firebase-admin": "^13.6.0",
  "multer": "^2.0.2",
  "openai": "^6.16.0"
}
```

---

## Support

For issues or questions, please contact the development team or refer to the project repository.
