# MediTrack Backend API Documentation

## Overview
MediTrack provides APIs for reminders, prescriptions, health notes, AI chat, and emergency access. Stack: Express.js, Firebase Firestore, Cloudinary (media), and OpenAI.

- Base URL (Production): https://meditrackbackend.onrender.com
- Base URL (Local): http://localhost:3000
- Version: 1.0.0

---

## Table of Contents
- [Authentication](#authentication)
- [User Endpoints](#user-endpoints)
  - [GET /user/profile](#get-userprofile)
  - [PUT /user/profile](#put-userprofile)
  - [GET /user/check](#get-usercheck)
- [Reminders Endpoints](#reminders-endpoints)
  - [POST /reminders](#post-reminders)
  - [GET /reminders](#get-reminders)
  - [GET /reminders/:id](#get-remindersid)
  - [PUT /reminders/:id](#put-remindersid)
  - [DELETE /reminders/:id](#delete-remindersid)
- [Prescriptions Endpoints](#prescriptions-endpoints)
  - [POST /prescriptions](#post-prescriptions)
  - [GET /prescriptions](#get-prescriptions)
  - [GET /prescriptions/:id](#get-prescriptionsid)
  - [PUT /prescriptions/:id](#put-prescriptionsid)
  - [DELETE /prescriptions/:id](#delete-prescriptionsid)
- [Health Notes Endpoints](#health-notes-endpoints)
  - [POST /notes](#post-notes)
  - [GET /notes](#get-notes)
  - [GET /notes/:id](#get-notesid)
  - [PUT /notes/:id](#put-notesid)
  - [DELETE /notes/:id](#delete-notesid)
- [AI Chat Endpoints](#ai-chat-endpoints)
  - [POST /chat](#post-chat)
  - [GET /chat/history](#get-chathistory)
- [Emergency Endpoints](#emergency-endpoints)
  - [GET /emergency/:uid/:accessId](#get-emergencyuidaccessid)
  - [POST /emergency/contacts](#post-emergencycontacts)
  - [GET /emergency/contacts](#get-emergencycontacts)
  - [PUT /emergency/contacts/:id](#put-emergencycontactsid)
  - [DELETE /emergency/contacts/:id](#delete-emergencycontactsid)
- [Error Handling](#error-handling)
- [Data Models](#data-models)
- [Running the Server](#running-the-server)
- [Key Features](#key-features)
- [Notes](#notes)
- [Dependencies](#dependencies)
- [Support](#support)

---

## Authentication
All endpoints (except emergency retrieval) require Firebase Authentication.

- Header: Authorization: Bearer <FIREBASE_ID_TOKEN>
- Middleware verifies token, attaches `uid` and `email`, returns 401 on failure.

---

## User Endpoints

### GET /user/profile
Returns profile with health details; creates the user document and emergency access if absent.

**Response**
```
{
  "success": true,
  "message": "User verified",
  "uid": "user_firebase_uid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://example.com/photo.jpg",
  "bloodType": "A+",
  "weight": 70,
  "height": 175,
  "phone": "+1234567890",
  "allergies": ["Penicillin", "Peanuts"],
  "medicalConditions":["Hypertension", "Type 2 Diabetes"],
  "dateOfBirth": "1990-05-15",
  "emergencyAccess": {
    "accessId": "default",
    "displayName": "John Doe",
    "bloodType": "A+",
    "dateOfBirth": "1990-05-15",
    "emergencyContacts": [],
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
}
```

### PUT /user/profile
Updates optional profile/health fields. Only provided fields change. **Profile changes (displayName, bloodType, dateOfBirth) automatically sync to the user's emergency access document.**

**Request Body (any subset)**
```
{
  "displayName": "John Doe",
  "photoURL": "https://example.com/avatar.jpg",
  "bloodType": "A+",
  "weight": 70,
  "height": 175,
  "phone": "+1234567890",
  "allergies": ["Penicillin", "Peanuts"],
  "medicalConditions":["Hypertension", "Type 2 Diabetes"],
  "dateOfBirth": "1990-05-15"
}
```

**Response**
```
{
  "success": true,
  "message": "Profile updated",
  "user": {
    "uid": "user_firebase_uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/avatar.jpg",
    "bloodGroup": "A+",
    "weight": 70,
    "height": 175,
    "phone": "+1234567890",
    "allergies": ["Penicillin", "Peanuts"],
    "medicalConditions":["Hypertension", "Type 2 Diabetes"],
    "dateOfBirth": "1990-05-15",
    "emergencyAccess": {
      "accessId": "default",
      "displayName": "John Doe",
      "bloodType": "A+",
      "dateOfBirth": "1990-05-15",
      "emergencyContacts": [],
      "createdAt": "2026-01-20T10:00:00.000Z"
    }
  }
}
```

### GET /user/check
Lightweight auth check.

**Response**
```
{
  "message": "User verified",
  "uid": "firebase_user_id"
}
```

---

## Reminders Endpoints

### POST /reminders
Create a reminder.

**Request Body**
```
{
  "medicineName": "Aspirin",
  "dosage": "100mg",
  "time": "09:00 AM",
  "repeat": "daily",
  "imageURL": "https://example.com/image.jpg",
  "voiceNoteURL": "https://example.com/voice.mp3"
}
```
Required: medicineName, dosage, time, repeat. Optional: imageURL, voiceNoteURL.

**Response**
```
{
  "success": true,
  "message": "Reminder created",
  "reminderId": "auto_generated_id"
}
```

### GET /reminders
List reminders (newest first).

**Response**
```
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

### GET /reminders/:id
Fetch a reminder by ID.

**Response (Success)**
```
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

**Response (Not Found)**
```
{
  "error": "Reminder not found"
}
```

### PUT /reminders/:id
Update a reminder.

**Request Body**
```
{
  "medicineName": "Updated Medicine",
  "dosage": "200mg",
  "time": "10:00 AM",
  "status": "completed"
}
```

**Response**
```
{
  "success": true,
  "message": "Reminder updated"
}
```

### DELETE /reminders/:id
Delete a reminder.

**Response**
```
{
  "success": true,
  "message": "Reminder deleted"
}
```

---

## Prescriptions Endpoints

### POST /prescriptions
Create prescription; optional file upload to Cloudinary.

- Content-Type: multipart/form-data
- Fields: `image` (file, optional, max 10MB), `doctorName`, `hospital`, `dateIssued`, `notes` (all optional)

**Response**
```
{
  "success": true,
  "message": "Prescription created",
  "prescriptionId": "auto_generated_id",
  "warning": "File upload failed, prescription saved without attachment"
}
```
`warning` only appears if upload fails.

Notes: Stored under `meditrack/{uid}/prescriptions` in Cloudinary; use `fileURL` to view and `publicId` to delete.

### GET /prescriptions
List prescriptions (newest first).

**Response**
```
{
  "success": true,
  "prescriptions": [
    {
      "prescriptionId": "prescription_id_1",
      "fileURL": "https://res.cloudinary.com/...",
      "fileType": "image/jpeg",
      "fileName": "prescription_scan.jpg",
      "publicId": "meditrack/uid/prescriptions/1737549000_prescription_scan",
      "resourceType": "image",
      "doctorName": "Dr. John Smith",
      "hospital": "City Hospital",
      "dateIssued": "2026-01-20T00:00:00.000Z",
      "notes": "Take medicine after meals",
      "createdAt": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

### GET /prescriptions/:id
Fetch a prescription by ID.

**Response (Success)**
```
{
  "success": true,
  "prescription": {
    "prescriptionId": "prescription_id_1",
    "fileURL": "https://res.cloudinary.com/...",
    "fileType": "application/pdf",
    "fileName": "prescription.pdf",
    "publicId": "meditrack/uid/prescriptions/1737549000_prescription",
    "resourceType": "raw",
    "doctorName": "Dr. John Smith",
    "hospital": "City Hospital",
    "dateIssued": "2026-01-20T00:00:00.000Z",
    "notes": "Take medicine after meals",
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
}
```

**Response (Not Found)**
```
{
  "error": "Prescription not found"
}
```

### PUT /prescriptions/:id
Update prescription metadata.

**Request Body**
```
{
  "doctorName": "Dr. Jane Doe",
  "notes": "Updated notes"
}
```

**Response**
```
{
  "success": true,
  "message": "Prescription updated"
}
```

### DELETE /prescriptions/:id
Delete a prescription and its Cloudinary asset when `publicId` exists.

**Response**
```
{
  "success": true,
  "message": "Prescription deleted"
}
```
Notes: 404 if not found; Cloudinary delete failure does not block DB delete.

---

## Health Notes Endpoints

### POST /notes
Create a health note.

**Request Body**
```
{
  "title": "Doctor Appointment",
  "content": "Discussed treatment plan and follow-up schedule"
}
```
Required: title, content.

**Response**
```
{
  "success": true,
  "message": "Note created",
  "noteId": "auto_generated_id"
}
```

### GET /notes
List notes (newest first).

**Response**
```
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

### GET /notes/:id
Fetch a note by ID.

**Response (Success)**
```
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

**Response (Not Found)**
```
{
  "error": "Note not found"
}
```

### PUT /notes/:id
Update a note.

**Request Body**
```
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response**
```
{
  "success": true,
  "message": "Note updated"
}
```

### DELETE /notes/:id
Delete a note.

**Response**
```
{
  "success": true,
  "message": "Note deleted"
}
```

---

## AI Chat Endpoints

### POST /chat
Send a message to the AI assistant (OpenAI GPT-4o-mini).

**Request Body**
```
{
  "message": "What foods should I avoid with high blood pressure?",
  "topic": "diet"
}
```
Required: message. Optional: topic (diet, health, medication, general).

**Response**
```
{
  "success": true,
  "reply": "For high blood pressure, it's recommended to avoid..."
}
```

**Error (400)**
```
{
  "error": "Message is required"
}
```

Notes: AI provides non-diagnostic advice; chats are saved; history capped at 50.

### GET /chat/history
Get chat history (max 50, newest first).

**Response**
```
{
  "success": true,
  "history": [
    {
      "chatId": "chat_id_1",
      "userMessage": "What foods should I avoid with high blood pressure?",
      "botReply": "For high blood pressure, it's recommended to avoid...",
      "topic": "diet",
      "timestamp": "2026-01-20T10:30:00.000Z"
    }
  ]
}
```

---

## Emergency Endpoints

**Auto-Setup:** An `emergencyAccess/default` document is automatically created when a user joins. Profile changes (displayName, bloodType, dateOfBirth) automatically sync to this document. Emergency contacts are stored as an array within this document.

### GET /emergency/:uid/:accessId
Public retrieval of emergency data (no auth required). Use `accessId = "default"` for the main emergency access.

**Response (Success)**
```
{
  "success": true,
  "data": {
    "accessId": "default",
    "uid": "user_firebase_uid",
    "displayName": "John Doe",
    "bloodType": "A+",
    "dateOfBirth": "1990-05-15",
    "emergencyContacts": [
      {
        "id": "contact_id_1",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1234567891",
        "relationship": "Spouse",
        "createdAt": "2026-01-20T10:15:00.000Z",
        "updatedAt": "2026-01-20T10:15:00.000Z"
      }
    ],
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T10:15:00.000Z"
  }
}
```

**Response (Not Found)**
```
{
  "error": "Emergency access not found"
}
```

### POST /emergency/contacts
Add an emergency contact to the user's emergency access document.

**Request Body**
```
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567891",
  "relationship": "Spouse"
}
```
Required: name, phone, relationship. Optional: email.

**Response**
```
{
  "success": true,
  "message": "Emergency contact added",
  "contacts": [
    {
      "id": "contact_id_1",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+1234567891",
      "relationship": "Spouse",
      "createdAt": "2026-01-20T10:15:00.000Z",
      "updatedAt": "2026-01-20T10:15:00.000Z"
    }
  ]
}
```

### GET /emergency/contacts
Fetch all emergency contacts for the user.

**Response**
```
{
  "success": true,
  "contacts": [
    {
      "id": "contact_id_1",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+1234567891",
      "relationship": "Spouse",
      "createdAt": "2026-01-20T10:15:00.000Z",
      "updatedAt": "2026-01-20T10:15:00.000Z"
    },
    {
      "id": "contact_id_2",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1234567892",
      "relationship": "Friend",
      "createdAt": "2026-01-20T10:20:00.000Z",
      "updatedAt": "2026-01-20T10:20:00.000Z"
    }
  ]
}
```

### PUT /emergency/contacts/:id
Update an emergency contact by ID.

**Request Body (any subset)**
```
{
  "name": "Jane Doe",
  "email": "jane.updated@example.com",
  "phone": "+1234567899",
  "relationship": "Wife"
}
```

**Response**
```
{
  "success": true,
  "message": "Emergency contact updated",
  "contact": {
    "id": "contact_id_1",
    "name": "Jane Doe",
    "email": "jane.updated@example.com",
    "phone": "+1234567899",
    "relationship": "Wife",
    "createdAt": "2026-01-20T10:15:00.000Z",
    "updatedAt": "2026-01-20T10:25:00.000Z"
  }
}
```

**Response (Not Found)**
```
{
  "error": "Contact not found"
}
```

### DELETE /emergency/contacts/:id
Delete an emergency contact by ID.

**Response**
```
{
  "success": true,
  "message": "Emergency contact deleted"
}
```

---

## Error Handling

### Standard Error Responses

#### 401 Unauthorized
```
{
  "error": "No token provided"
}
```
```
{
  "error": "Invalid token"
}
```

#### 404 Not Found
```
{
  "error": "Resource not found"
}
```

#### 400 Bad Request
```
{
  "error": "Message is required"
}
```

#### 500 Internal Server Error
```
{
  "error": "Failed to [action description]"
}
```

---

## Data Models

### User
```
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
  dateOfBirth?: string | null;
  emergencyAccess?: {
    accessId: string;
    displayName?: string | null;
    bloodType?: string | null;
    dateOfBirth?: string | null;
    emergencyContacts: EmergencyContact[];
    createdAt: Date;
    updatedAt: Date;
  };
}
```

### Reminder
```
{
  reminderId: string;
  medicineName: string;
  dosage: string;
  time: string;
  repeat: string;
  imageURL?: string;
  voiceNoteURL?: string;
  status?: "pending" | "completed";
  createdAt: Date;
}
```

### Prescription
```
{
  prescriptionId: string;
  doctorName?: string;
  hospital?: string;
  dateIssued?: Date;
  notes?: string;
  fileURL?: string;
  fileType?: string;
  fileName?: string;
  publicId?: string;
  resourceType?: "image" | "raw" | "video";
  createdAt: Date;
}
```

### Health Note
```
{
  noteId: string;
  title: string;
  content: string;
  createdAt: Date;
}
```

### Chat Message
```
{
  chatId: string;
  userMessage: string;
  botReply: string;
  topic?: "diet" | "health" | "medication" | "general";
  timestamp: Date;
}
```

### Emergency Access
```
{
  accessId: "default";
  uid: string;
  displayName?: string | null;
  bloodType?: string | null;
  dateOfBirth?: string | null;
  emergencyContacts: [
    {
      id: string;
      name: string;
      email?: string | null;
      phone: string;
      relationship: string;
      createdAt: Date;
      updatedAt: Date;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Running the Server

### Development
```
npm run dev
```

### Production
```
npm start
```

Server defaults to http://localhost:3000.

---

## Key Features
- **Multipart uploads to Cloudinary** for prescriptions (10MB limit; images/PDF/audio/video/other docs; auto cleanup via `publicId`).
- **Profile auto-sync** - Changes to displayName, bloodType, dateOfBirth automatically sync from user profile to emergency access document.
- **Emergency access auto-created** for new users with a single `default` document. Contacts stored as an embedded array.
- **Emergency contacts CRUD** - Add, view, update, delete multiple emergency contacts. Profile and contacts viewable publicly via shared link.
- **AI chat via OpenAI GPT-4o-mini** - Non-diagnostic guidance; history capped at 50.
- **Firebase Authentication** for secured endpoints; Firestore data isolation per user.

---

## Notes
- Timestamps stored as JavaScript `Date` in Firestore.
- User data stored under `/users/{uid}/` with subcollections per feature.
- Emergency access stored as `/users/{uid}/emergencyAccess/default` (single document per user).
- Emergency contacts stored as an array within the `default` emergency access document.
- Profile changes automatically sync to emergency access (displayName, bloodType, dateOfBirth).
- CORS enabled for all origins.
- Cloudinary assets deletable via stored `publicId`.

---

## Dependencies
```
cors ^2.8.5
dotenv ^17.2.3
cloudinary ^2.9.0
express ^5.2.1
firebase-admin ^13.6.0
multer ^2.0.2
openai ^6.16.0
```

---

## Support
For issues or questions, contact the development team or refer to the project repository.
