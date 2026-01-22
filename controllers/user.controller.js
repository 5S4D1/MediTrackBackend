const { createUserIfNotExists, getUserById, updateUserById } = require("../services/user.service");

exports.userProfile = async (req, res) => {
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
      weight: userData?.weight || null,
      height: userData?.height || null,
      phone: userData?.phone || null,
      allergies: userData?.allergies || null,
      bloodType: userData?.bloodType || null,
      dateOfBirth: userData?.dateOfBirth || null,
      emergencyAccess: userData?.emergencyAccess || null
    });

  } catch (error) {
    console.error("checkUser error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const allowedFields = [
      "displayName",
      "photoURL",
      "bloodType",
      "weight",
      "height",
      "phone",
      "allergies",
      "dateOfBirth",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await updateUserById(uid, updates);

    res.json({
      success: true,
      message: "Profile updated",
      user: {
        uid,
        email: updatedUser?.email || null,
        displayName: updatedUser?.displayName || null,
        photoURL: updatedUser?.photoURL || null,
        bloodType: updatedUser?.bloodType || null,
        weight: updatedUser?.weight || null,
        height: updatedUser?.height || null,
        phone: updatedUser?.phone || null,
        allergies: updatedUser?.allergies || null,
        dateOfBirth: updatedUser?.dateOfBirth || null,
        emergencyAccess: updatedUser?.emergencyAccess || null
      }
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
