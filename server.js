import express from'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcryptjs';

import { handleSignin } from './controllers/signin.js';
import { handleRegister } from './controllers/register.js';
import { handleProfile } from './controllers/profile.js';
import { handleImage, handleApiCall } from './controllers/image.js';

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
app.post('/imageurl', handleApiCall);

app.listen(PORT, () => {
    console.log('App is running on port ${PORT}!')
})



// app.get('/', (req, res) => {
//     res.send('success');
// });

// app.post('/signin', (req, res) => {
//     db.select('email', 'hash').from('login')
//         .where('email', '=', req.body.email)
//         .then(data => {
//             const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
//             if (isValid) {
//                 return db.select('*').from('users')
//                 .where('email', '=', req.body.email)
//                 .then(user => {
//                     res.json(user[0])
//                 })
//                 .catch(err => res.status(400).json('unable to get user'))
//             } else {
//                 res.status(400).json('wrong credentials')
//             }
//         })
//         .catch(err => res.status(400).json('unable to get user'))
// });

// app.post('/register', (req, res) => {
//     const { email, name, password } = req.body;
//     const hash = bcrypt.hashSync(password, 10);
//             db.transaction(trx => {
//                 trx.insert({
//                     hash: hash,
//                     email: email
//                 })
//                 .into('login')
//                 .returning('email')
//                 .then(loginEmail => {
//                     return trx('users')
//                         .returning('*')
//                         .insert({
//                             email: loginEmail[0].email,
//                             name: name,
//                             joined: new Date() 
//                         })
//                         .then(user => {
//                             res.json(user[0]);
//                         })
//                 })
//                 .then(trx.commit)
//                 .catch(trx.rollback)
//             })
//     .catch(err => res.status(400).json('That is unfortunate. You are unable to register.'))
// });

// app.get('/profile/:id', (req, res) => {
//     const { id } = req.params;
//     db.select('*').from('users').where({ id })
//         .then(user => {
//             if (user.length) {
//                 res.json(user[0])
//             } else {
//                 res.status(400).json('Hmm, nothing found...')
//             }
//         })
//         .catch(err => res.status(400).json('Oops. Does that user exist?'))
// });

// app.put('/image', (req, res) => {
//     const { id } = req.body;
//     db('users').where('id', '=', id)
//     .increment('entries', 1)
//     .returning('entries')
//     .then(entries => {
//         res.json(entries[0].entries);
//     })
//     .catch(err => res.status(400).json('Oops, unable to get the entries'))
// })


// fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(this.state.input))