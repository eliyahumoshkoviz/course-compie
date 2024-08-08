import express from 'express';
import { getModel } from '../utilities/schemas.js'
import { userModel } from '../DL/models/user.model.js';
import { taskModel } from '../DL/models/task.model.js';

const router = express.Router();

router.get("/", async (req, res) => {

    try {
        const instances = await getModel(req.baseUrl).find({})
        res.send(instances)
    } catch (error) {
        res.status(500).send({ error: error.message || error.toString() })
    }
});

router.get("/:id", async (req, res) => {

    try {
        const instance = req.baseUrl === '/user' ? req.user
            : await getModel(req.baseUrl).findOne({ _id: req.params.id, 'owner': req.user._id })

        !instance ? res.status(404).send('instance not founf') :
            res.send(instance)
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }

});

router.post("/", async (req, res) => {

    try {
        const task = new taskModel({ ...req.body, "owner": req.user._id });
        await task.save()
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }

})

router.post("/logout", async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token)
        await req.user.save()
        res.status(201).send()
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }

})

router.post("/logoutAll", async (req, res) => {

    try {

        req.user.tokens = []
        await user.save()
        res.status(201).send()
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }

});



router.post("/login", async (req, res) => {

    try {
        const user = await userModel.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }

});

router.patch("/:id", async (req, res) => {

    const update = Object.keys(req.body);
    const allowUpdate = req.baseUrl === 'user' ? ['name', 'email', "password"] : ['description', 'cpmpleted'];
    const isValideOperation = update.every((update) => allowUpdate.includes(update))

    if (!isValideOperation) return res.status(400).send({ error: 'invalid updates' })

    try {
        const instance = await getModel(req.baseUrl).findById(req.params.id)
        update.forEach((update) => instance[update] = req.body[update])
        await instance.save();
        !instance ? res.status(404).send('instance not founf') :
            res.send(instance)
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }
});

router.delete("/:id", async (req, res) => {
    try {

        // const instance = await getModel(req.baseUrl).findByIdAndDelete(req.params.id)
        const instance = req.baseUrl === '/user' ? await getModel(req.baseUrl).findByIdAndDelete(req.user._id)
            : await getModel(req.baseUrl).findByIdAndDelete(req.params.id)
        if (!instance) return res.status(400).send({ error: 'invalid updates' })
        res.send(instance)

    } catch (error) {
        res.status(500).send({ error: error.message || error.toString() })
    }
});

export { router as appRoute };
