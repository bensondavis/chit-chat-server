import jwt from "jsonwebtoken";

export default function AuthenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(403).send("Forbidden");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).send("Session Expired");
    req.username = user.username;
    next();
  });
}
