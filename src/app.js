import express from 'express';
import cors from 'cors'
import { appRoute } from './routers/app.route.js';
import { auth } from './middleware/auth.js';
import { loginRoute } from './routers/login.route.js';


import dotenv from 'dotenv';
import 'dotenv/config' 
dotenv.config()

import { connect } from './DL/db.connect.js'
connect();

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/login', loginRoute)
app.use('/user',auth, appRoute)
app.use('/task',auth, appRoute)



app.listen(port, () => console.log(`*** Server is running on port ${port}***`))