import express from 'express';
import { taskModel } from '../DL/models/task.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        await req.user.populate('tasks')
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send({ error: error.message || error.toString() })
    }
})


router.get('/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await taskModel.findOne({ _id, owner: req.user._id })
        if (!task) return res.status(404).send()
        res.send(task)
    } catch (error) {
        res.status(500).send({ error: error.message || error.toString() })
    }
})

router.post("/", async (req, res) => {

    try {
        const task = new taskModel({ ...req.body, "owner": req.user._id });
        await task.save()
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }

})

router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) return res.status(400).send({ error: 'invalid updates' })
    try {
        const task = await taskModel.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send({ error: error.message || error.toString() })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const task = await taskModel.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

export { router as taskRoute };    