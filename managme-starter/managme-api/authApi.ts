import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import UsersDB from "./db/users";
import jwt, { JwtPayload } from "jsonwebtoken";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const SECRET_KEY = "your_secret_key";
const REFRESH_SECRET_KEY = "your_refresh_secret_key";
const TOKEN_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = "7d";

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;

  const user = UsersDB.getAll().find(
    (u) => u.name === login && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Nieprawidłowy login lub hasło" });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRATION,
  });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  res.json({ token, refreshToken });
});

app.post("/api/refresh-token", (req, res) => {
  const { refreshToken } = req.body;

  try {
    const payload: JwtPayload = jwt.verify(
      refreshToken,
      REFRESH_SECRET_KEY
    ) as JwtPayload;
    const newToken = jwt.sign({ id: payload["id"] }, SECRET_KEY, {
      expiresIn: TOKEN_EXPIRATION,
    });

    res.json({ token: newToken });
  } catch (e) {
    res.status(401).json({ message: "Nieprawidłowy refresh token" });
  }
});

app.get("/api/userinfo", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    console.log("Error:", err, "Decoded:", decoded);

    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = UsersDB.getAll().find(
      (u) => u.id === (decoded as JwtPayload)["id"]
    );
    console.log("User:", user);
    res.json({ message: "Authorized", user: user });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
