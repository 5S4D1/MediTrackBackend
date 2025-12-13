const { admin } = require("../config/firebase");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // uid + email
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
