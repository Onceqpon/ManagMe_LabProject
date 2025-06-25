import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import UsersDB from "../db/users";

const app = express();
const PORT = process.env.PORT || 5000;

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || "your_refresh_secret_key";
const TOKEN_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = "7d";

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.post("/api/login", (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: "Brakuje loginu lub hasła." });
  }

  const user = UsersDB.getAll().find(
    (u) => u.name === login && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Nieprawidłowy login lub hasło." });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRATION,
  });

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  res.status(200).json({ token, refreshToken });
});

app.post("/api/refresh-token", (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Brakuje refresh tokenu." });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as JwtPayload;

    const newToken = jwt.sign({ id: payload.id }, SECRET_KEY, {
      expiresIn: TOKEN_EXPIRATION,
    });

    res.status(200).json({ token: newToken });
  } catch (err) {
    console.error("Błąd przy weryfikacji refresh tokenu:", err);

    const isExpired = err instanceof jwt.TokenExpiredError;


    res.status(401).json({
      message: isExpired
        ? "Refresh token wygasł. Zaloguj się ponownie."
        : "Nieprawidłowy refresh token.",
    });
  }
});

app.get("/api/userinfo", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Brak tokenu autoryzacyjnego." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Błąd weryfikacji JWT:", err);

      const isExpired =
        err instanceof jwt.TokenExpiredError || err?.name === "TokenExpiredError";

      return res.status(401).json({
        message: isExpired ? "Token wygasł." : "Nieautoryzowany.",
      });
    }

    const userId = (decoded as JwtPayload).id;
    const user = UsersDB.getAll().find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony." });
    }

    res.status(200).json({ message: "Authorized", user });
  });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
