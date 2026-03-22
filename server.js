import express from'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcryptjs';

import { handleSignin } from './controllers/signin.js';
import { handleRegister } from './controllers/register.js';
import { handleProfile } from './controllers/profile.js';
import { handleImage } from './controllers/image.js';

const db = knex ({
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      port: 5432,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PW,
      database: process.env.DATABASE_DB,
    },
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Hey, it is working!'));
app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt));
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => handleProfile(req, res, db));
app.put('/image', (req, res) => handleImage(req, res, db));

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}!`)
})

