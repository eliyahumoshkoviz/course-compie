import express from 'express';
import { userModel } from '../DL/models/user.model.js';

const router = express.Router();

router.get("/", async (req, res) => {

    try {
        const instances = await userModel.find({})
        res.send(instances)
    } catch (error) {
        res.status(500).send({ error: error.message || error.toString() })
    }
});

router.get('/me', async (req, res) => {
    res.send(req.user)
})




router.patch('/', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValideOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValideOperation) return res.status(400).send({ error: 'invalid updates' })

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }
})

router.delete('/', async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.user._id)
        res.send(req.user)
    } catch (error) {
        res.status(500).send({ error: error.message || error.toString() })
    }
})

export { router as userRoute };

