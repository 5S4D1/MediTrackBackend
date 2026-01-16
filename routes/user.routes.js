const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

// Check user endpoint (creates Firestore user if not exists)
router.get("/profile", auth, userController.userProfile);

// Temporary profile test route
router.get("/check", auth, async (req, res) => {
  res.json({
    message: "User verified",
    uid: req.user.uid
  });
});

module.exports = router;
