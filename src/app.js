import express from 'express';
import cors from 'cors'
import { auth } from './middleware/auth.js';
import { loginRoute } from './routers/login.route.js';


import dotenv from 'dotenv';
import 'dotenv/config'
dotenv.config()

import { connect } from './DL/db.connect.js'
import { taskRoute } from './routers/task.route.js';
import { userRoute } from './routers/user.route.js';
import { avatarRoute } from './routers/avatar.route.js';
connect();

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/user', loginRoute)
app.use('/user/avatar', auth, avatarRoute)
app.use('/user', auth, userRoute)
app.use('/task', auth, taskRoute)



app.listen(port, () => console.log(`*** Server is running on port ${port}***`))