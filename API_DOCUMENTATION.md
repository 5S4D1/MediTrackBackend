# MediTrack Backend API Documentation

## Overview
MediTrack is a backend API for managing medicine reminders, prescriptions, health notes, and emergency access. Built with Express.js and Firebase Firestore.

**Base URL:** `http://localhost:3000`  
**Author:** Sheikh Sadi  
**Version:** 1.0.0

---

## Table of Contents
- [Authentication](#authentication)
- [User Endpoints](#user-endpoints)
- [Reminders Endpoints](#reminders-endpoints)
- [Prescriptions Endpoints](#prescriptions-endpoints)
- [Health Notes Endpoints](#health-notes-endpoints)
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

### Check User
Verifies user authentication and creates Firestore user document if not exists.

**Endpoint:** `GET /user/check`  
**Auth Required:** Yes

#### Response
```json
{
  "success": true,
  "message": "User verified",
  "uid": "firebase_user_id",
  "email": "user@example.com"
}
```

---

### Get User Profile
Temporary profile test route for user verification.

**Endpoint:** `GET /user/profile`  
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
Creates a new prescription record for the authenticated user.

**Endpoint:** `POST /prescriptions`  
**Auth Required:** Yes

#### Request Body
```json
{
  "fileURL": "https://storage.example.com/prescription.pdf",
  "fileType": "pdf",
  "doctorName": "Dr. John Smith",
  "hospital": "City Hospital",
  "dateIssued": "2026-01-09",
  "notes": "Take medicine after meals"
}
```

#### Required Fields
- `fileURL` (string)
- `fileType` (string)

#### Optional Fields
- `doctorName` (string)
- `hospital` (string)
- `dateIssued` (date)
- `notes` (string)

#### Response
```json
{
  "success": true,
  "message": "Prescription created",
  "prescriptionId": "auto_generated_id"
}
```

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
      "fileURL": "https://storage.example.com/prescription.pdf",
      "fileType": "pdf",
      "doctorName": "Dr. John Smith",
      "hospital": "City Hospital",
      "dateIssued": "2026-01-09T00:00:00.000Z",
      "notes": "Take medicine after meals",
      "createdAt": "2026-01-09T10:00:00.000Z"
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
    "fileURL": "https://storage.example.com/prescription.pdf",
    "fileType": "pdf",
    "doctorName": "Dr. John Smith",
    "hospital": "City Hospital",
    "dateIssued": "2026-01-09T00:00:00.000Z",
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
Deletes a prescription.

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

#### 500 Internal Server Error
```json
{
  "error": "Failed to [action description]"
}
```

---

## Data Models

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
  fileURL: string;
  fileType: string;
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

### Emergency Access
```typescript
{
  accessId: string;
  sharedData: string[];
  createdAt: Date;
}
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

## Testing the API

### Example: Create a Reminder
```bash
curl -X POST http://localhost:3000/reminders \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medicineName": "Aspirin",
    "dosage": "100mg",
    "time": "09:00 AM",
    "repeat": "daily"
  }'
```

### Example: Get All Reminders
```bash
curl -X GET http://localhost:3000/reminders \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

## Notes

- All timestamps are stored as JavaScript `Date` objects in Firestore
- User data is stored in subcollections under `/users/{uid}/`
- All authenticated endpoints automatically extract user UID from the Firebase token
- Emergency access URLs can be used to generate QR codes for quick sharing
- The API uses Firebase Firestore for data persistence
- CORS is enabled for all origins

---

## Support

For issues or questions, please contact the development team or refer to the project repository.
