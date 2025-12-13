require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { db } = require("./config/firebase");

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Meditrack backend running...');
})

// db.listCollections()
//     .then(() => {
//         console.log("Firestore connected successfully");
//     })
//     .catch((err) => {
//         console.log("Firestore connection failde: ", err);
//     });

// Test read from Firestore
db.collection("test").doc("check").get()
    .then((doc) => {
        if (doc.exists) {
            console.log("🔥 Firestore read OK:", doc.data());
        } else {
            console.log("⚠️ No test document found.");
        }
    })
    .catch((err) => {
        console.log("❌ Firestore read failed:", err);
    });

// Register routes
app.use("/user", require("./routes/user.routes"));
app.use("/reminders", require("./routes/reminders.routes"));
app.use("/prescriptions", require("./routes/prescriptions.routes"));
app.use("/notes", require("./routes/healthNotes.routes"));
// app.use("/chat", require("./routes/chat.routes"));
app.use("/emergency", require("./routes/emergency.routes"));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log("===============================================");
    console.log(`\n  Server is running at http://localhost:${PORT}\n`);
    console.log("===============================================");
});
