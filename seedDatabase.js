require("dotenv").config();
const { db } = require("./config/firebase");

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed for test user...\n");

    // Test User UID (use this for testing)
    const testUID = "test_user_001";

    // 1. Create User Document
    const userData = {
      uid: testUID,
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      dateOfBirth: "1990-05-15",
      bloodType: "O+",
      allergies: ["Penicillin", "Aspirin"],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection("users").doc(testUID).set(userData);
    console.log("✅ User created:", userData);

    // 2. Create Sample Reminders
    const reminders = [
      {
        medicineName: "Aspirin",
        dosage: "500mg",
        time: "09:00 AM",
        repeat: "daily",
        status: "pending",
        createdAt: new Date()
      },
      {
        medicineName: "Vitamin D",
        dosage: "1000 IU",
        time: "08:00 AM",
        repeat: "daily",
        status: "pending",
        createdAt: new Date()
      },
      {
        medicineName: "Metformin",
        dosage: "500mg",
        time: "02:00 PM",
        repeat: "twice daily",
        status: "pending",
        createdAt: new Date()
      }
    ];

    for (const reminder of reminders) {
      const ref = db.collection("users").doc(testUID).collection("reminders").doc();
      await ref.set({
        reminderId: ref.id,
        ...reminder
      });
      console.log(`✅ Reminder created: ${reminder.medicineName}`);
    }

    // 3. Create Sample Prescriptions
    const prescriptions = [
      {
        doctorName: "Dr. Smith",
        hospital: "General Hospital",
        dateIssued: new Date("2024-11-01"),
        notes: "Take with food",
        fileURL: "https://example.com/prescription1.pdf",
        fileType: "pdf",
        createdAt: new Date()
      },
      {
        doctorName: "Dr. Johnson",
        hospital: "City Medical Center",
        dateIssued: new Date("2024-12-01"),
        notes: "Take before meals",
        fileURL: "https://example.com/prescription2.pdf",
        fileType: "pdf",
        createdAt: new Date()
      }
    ];

    for (const prescription of prescriptions) {
      const ref = db.collection("users").doc(testUID).collection("prescriptions").doc();
      await ref.set({
        prescriptionId: ref.id,
        ...prescription
      });
      console.log(`✅ Prescription created: ${prescription.doctorName}`);
    }

    // 4. Create Sample Health Notes
    const healthNotes = [
      {
        title: "Blood Pressure Check",
        content: "BP: 120/80 mmHg - Normal",
        category: "Vitals",
        createdAt: new Date()
      },
      {
        title: "Weight Update",
        content: "Current weight: 75 kg",
        category: "Health",
        createdAt: new Date()
      }
    ];

    for (const note of healthNotes) {
      const ref = db.collection("users").doc(testUID).collection("healthNotes").doc();
      await ref.set({
        noteId: ref.id,
        ...note
      });
      console.log(`✅ Health note created: ${note.title}`);
    }

    // 5. Create Emergency Data (accessible by UID + accessId)
    const emergencyRef = db.collection("users").doc(testUID).collection("emergencyAccess").doc();
    const emergencyAccessId = emergencyRef.id;
    
    const emergencyData = {
      accessId: emergencyAccessId,
      uid: testUID,
      // Basic Patient Information
      fullName: userData.fullName,
      dateOfBirth: userData.dateOfBirth,
      bloodType: userData.bloodType,
      allergies: userData.allergies,
      phone: userData.phone,
      email: userData.email,
      // Emergency Contacts
      emergencyContacts: [
        {
          name: "Jane Doe",
          relationship: "Spouse",
          phone: "+1234567891",
          email: "jane@example.com"
        },
        {
          name: "Mike Doe",
          relationship: "Son",
          phone: "+1234567892",
          email: "mike@example.com"
        }
      ],
      // Current Medications
      currentMedications: [
        { name: "Aspirin", dosage: "500mg", frequency: "daily" },
        { name: "Vitamin D", dosage: "1000 IU", frequency: "daily" },
        { name: "Metformin", dosage: "500mg", frequency: "twice daily" }
      ],
      // Medical Conditions
      medicalConditions: ["Diabetes Type 2", "Hypertension"],
      // Recent Prescriptions
      lastDoctorVisit: "2024-12-01",
      lastDoctor: "Dr. Smith",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await emergencyRef.set(emergencyData);
    console.log(`✅ Emergency data created with access ID: ${emergencyAccessId}`);

    console.log("\n🌱 Database seed completed successfully!");
    console.log("\n📝 Test User UID: " + testUID);
    console.log("📊 Data created:");
    console.log("   - 1 User profile");
    console.log("   - 3 Medicine Reminders");
    console.log("   - 2 Prescriptions");
    console.log("   - 2 Health Notes");
    console.log("   - 1 Emergency Access");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }

  // Exit the process
  process.exit();
};

// Run the seed
seedDatabase();
