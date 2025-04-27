import express from 'express';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';
import { User } from './types/users';

const app = express();
const port = 3000;

const tokenSecret = process.env.TOKEN_SECRET as string;
let refreshTokens: { [key: string]: string } = {};

// Define users here for testing purposes (replace with real user data or a database in production)
const users: User[] = [
  {
    id: '1',
    login: 'admin',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
  },
  {
    id: '2',
    login: 'developer',
    password: 'dev123',
    firstName: 'Anna',
    lastName: 'Smith',
    role: 'developer',
  },
  {
    id: '3',
    login: 'devops',
    password: 'ops123',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'devops',
  },
];

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World - simple API with JWT!');
});

app.post('/login', (req, res) => {
  const { login, password } = req.body;
  const user = users.find((u) => u.login === login && u.password === password);
  if (!user) {
    return res.status(401).send({ error: 'Invalid login or password' });
  }

  const token = generateToken(user.id, 60);
  const refreshToken = generateToken(user.id, 60 * 60);
  refreshTokens[user.id] = refreshToken;

  res.status(200).send({ token, refreshToken });
});

app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).send({ error: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, tokenSecret) as { userId: string; exp: number };
    const userId = decoded.userId;
    if (!userId || refreshTokens[userId] !== refreshToken) {
      return res.status(401).send({ error: 'Invalid refresh token' });
    }

    const newToken = generateToken(userId, 60);
    const newRefreshToken = generateToken(userId, 60 * 60);
    refreshTokens[userId] = newRefreshToken;

    setTimeout(() => {
      res.status(200).send({ token: newToken, refreshToken: newRefreshToken });
    }, 3000);
  } catch (err) {
    res.status(401).send({ error: 'Invalid refresh token' });
  }
});

app.get('/user', verifyToken, (req: any, res) => {
  const userId = req.user.userId;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  const { password, ...userData } = user;
  res.status(200).send(userData);
});

// Nowy endpoint /users
app.get('/users', verifyToken, (req, res) => {
  const usersData = users.map(({ password, ...userData }) => userData);
  res.status(200).send(usersData);
});

app.get('/protected/:id/:delay?', verifyToken, (req: any, res) => {
  const id = req.params.id;
  const delay = req.params.delay ? +req.params.delay : 1000;
  setTimeout(() => {
    res.status(200).send(`{"message": "protected endpoint ${id}"}`);
  }, delay);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function generateToken(userId: string, expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const token = jwt.sign({ userId, exp }, tokenSecret, { algorithm: 'HS256' });
  return token;
}

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).send({ error: 'Token required' });

  jwt.verify(token, tokenSecret, (err: any, decoded: any) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ error: err.message });
    }
    req.user = decoded;
    next();
  });
}
