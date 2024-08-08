import express from 'express';
import { userModel } from '../DL/models/user.model.js';

const router = express.Router();


router.post("/", async (req, res) => {

    try {
        const user = new userModel(req.body);
        res.status(201).send({ user, token: await user.generateAuthToken() });
        await user.save()

    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }

})

export { router as loginRoute };
