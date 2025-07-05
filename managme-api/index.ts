import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { supabase } from './supabaseClient';

const app = express();
const port = 3000;
const tokenSecret = process.env.TOKEN_SECRET || 'DEFAULT_SECRET_KEY_!@#$';

app.use(cors());
app.use(express.json());


function generateToken(userId: string, userRole: string, expirationInSeconds: number) {
    const payload = { id: userId, role: userRole, exp: Math.floor(Date.now() / 1000) + expirationInSeconds };
    return jwt.sign(payload, tokenSecret);
}

function verifyToken(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, tokenSecret, (err: any, user: any) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.user = user;
        next();
    });
}


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !user) return res.status(401).send('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send('Invalid credentials');
    const accessToken = generateToken(user.id, user.role, 15 * 60);
    res.send({ accessToken });
});

app.get('/me', verifyToken, async (req: any, res) => {
    const { data: user, error } = await supabase.from('users').select('id, email, first_name, last_name, role').eq('id', req.user.id).single();
    if (error || !user) return res.status(404).send('User not found');
    res.send(user);
});

app.get('/users/assignable', verifyToken, async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, role')
        .in('role', ['developer', 'devops']);
    if (error) return res.status(500).send(error);
    res.send(data);
});


app.get('/projects', verifyToken, async (req: any, res) => {
    const { data, error } = await supabase.from('projects').select('*').eq('user_id', req.user.id);
    if (error) return res.status(500).send(error);
    res.send(data);
});

app.post('/projects', verifyToken, async (req: any, res) => {
    const { name, description } = req.body;
    const { data, error } = await supabase.from('projects').insert({ name, description, user_id: req.user.id }).select().single();
    if (error) return res.status(500).send(error);
    res.status(201).send(data);
});

app.patch('/projects/:projectId', verifyToken, async (req, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;
    const { data, error } = await supabase.from('projects').update({ name, description }).eq('id', projectId).select().single();
    if (error) return res.status(500).send(error);
    res.send(data);
});

app.delete('/projects/:projectId', verifyToken, async (req, res) => {
    const { projectId } = req.params;
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) return res.status(500).send(error);
    res.status(204).send();
});


app.get('/projects/:projectId/stories', verifyToken, async (req, res) => {
    const { projectId } = req.params;
    const { data, error } = await supabase.from('stories').select('*').eq('project_id', projectId);
    if (error) return res.status(500).send(error);
    res.send(data);
});

app.post('/stories', verifyToken, async (req, res) => {
    const { name, description, priority, project_id } = req.body;
    const { data, error } = await supabase.from('stories').insert({ name, description, priority, project_id }).select().single();
    if (error) return res.status(500).send(error);
    res.status(201).send(data);
});

app.patch('/stories/:storyId', verifyToken, async (req, res) => {
    const { storyId } = req.params;
    const { name, description, priority } = req.body;
    const { data, error } = await supabase.from('stories').update({ name, description, priority }).eq('id', storyId).select().single();
    if (error) return res.status(500).send(error);
    res.send(data);
});

app.delete('/stories/:storyId', verifyToken, async (req, res) => {
    const { storyId } = req.params;
    const { error } = await supabase.from('stories').delete().eq('id', storyId);
    if (error) return res.status(500).send(error);
    res.status(204).send();
});


app.get('/stories/:storyId/tasks', verifyToken, async (req, res) => {
    const { storyId } = req.params;
    const { data, error } = await supabase.from('tasks').select('*, users(first_name, last_name)').eq('story_id', storyId);
    if (error) return res.status(500).send(error);
    res.send(data);
});

app.get('/tasks/:taskId', verifyToken, async (req, res) => {
    const { taskId } = req.params;
    const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
    if (error) return res.status(500).send(error);
    res.send(data);
});

app.post('/tasks', verifyToken, async (req, res) => {
    const { name, description, priority, estimated_time, story_id } = req.body;
    const { data, error } = await supabase.from('tasks').insert({ name, description, priority, estimated_time, story_id }).select().single();
    if (error) return res.status(500).send(error);
    res.status(201).send(data);
});

app.patch('/tasks/:taskId', verifyToken, async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;
    if (updates.assignee_id && updates.status !== 'done') {
        updates.status = 'doing';
        updates.started_at = new Date().toISOString();
    }
    if (updates.status === 'done') {
        updates.completed_at = new Date().toISOString();
    }
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', taskId).select().single();
    if (error) return res.status(500).send(error);
    res.send(data);
});

app.delete('/tasks/:taskId', verifyToken, async (req, res) => {
    const { taskId } = req.params;
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) return res.status(500).send(error);
    res.status(204).send();
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
