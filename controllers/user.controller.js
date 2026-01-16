const { createUserIfNotExists, getUserById } = require("../services/user.service");

exports.checkUser = async (req, res) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email;
    const displayName = req.user.name || null;
    const photoURL = req.user.picture || null;

    // Create Firestore user document if not exists
    await createUserIfNotExists(uid, { email, displayName, photoURL });

    // Get user data from Firestore
    const userData = await getUserById(uid);

    res.json({
      success: true,
      message: "User verified",
      uid,
      email,
      displayName: userData?.displayName || null,
      photoURL: userData?.photoURL || null,
      bloodGroup: userData?.bloodType || null,
      weight: userData?.weight || null,
      height: userData?.height || null,
      phone: userData?.phone || null,
      allergies: userData?.allergies || null,
      emergencyAccess: userData?.emergencyAccess || null
    });

  } catch (error) {
    console.error("checkUser error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
