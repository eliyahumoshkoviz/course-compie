import express from 'express';
import sharp from 'sharp'
import { userModel } from '../DL/models/user.model.js';
import { uploadImgMulter } from '../middleware/uploadMulter.js';


const router = express.Router();

router.post('/', uploadImgMulter, async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })

    }

});

router.get('/:id', async (req, res) => {

    try {
        const user = await userModel.findById(req.params.id)
        if (!user || !user.avatar) throw new Error()
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }
})

router.delete('/', async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send({ error: error.message || error.toString() })

    }
})


export { router as avatarRoute };
