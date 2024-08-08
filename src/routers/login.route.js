import express from 'express';
import { userModel } from '../DL/models/user.model.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.post("/", async (req, res) => {
    
    try {
        const user = new userModel(req.body);
        res.status(201).send({ user, token: await user.generateAuthToken() });

    } catch (error) {
        res.status(500).send({ error: error.message || error.toString() })
    }

})

router.post("/logout",auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token)
        await req.user.save()
        res.status(201).send()
    } catch (error) {
        res.status(500).send({ error: error.message || error.toString() })
    }

})

router.post("/logoutAll",auth, async (req, res) => {

    try {

        req.user.tokens = []
        await user.save()
        res.status(201).send()
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }

});

export { router as loginRoute };
