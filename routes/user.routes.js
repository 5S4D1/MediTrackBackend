const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

// Check user endpoint (creates Firestore user if not exists)
router.get("/check", auth, userController.checkUser);

// Temporary profile test route
router.get("/profile", auth, async (req, res) => {
  res.json({
    message: "User verified",
    uid: req.user.uid
  });
});

module.exports = router;
