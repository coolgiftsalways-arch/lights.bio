const jwt = require("jsonwebtoken");

// Protects admin routes: expects "Authorization: Bearer <token>" from /api/admin/login
module.exports = function requireAdmin(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Please log in." });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") throw new Error();
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
};
