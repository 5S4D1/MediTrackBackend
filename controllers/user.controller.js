const { createUserIfNotExists } = require("../services/user.service");

exports.checkUser = async (req, res) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email;

    // Create Firestore user document if not exists
    await createUserIfNotExists(uid, { email });

    res.json({
      success: true,
      message: "User verified",
      uid,
      email
    });

  } catch (error) {
    console.error("checkUser error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
