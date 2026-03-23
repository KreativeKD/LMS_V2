const express = require('express');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('actor', 'username role firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.send({ notifications });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.get('/unread-count', async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user._id,
            read: false
        });
        res.send({ count });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.patch('/read-all', async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { $set: { read: true } }
        );
        res.send({ message: 'All notifications marked as read' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { $set: { read: true } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).send({ error: 'Notification not found' });
        }

        res.send({ notification });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user._id
        });

        if (!deleted) {
            return res.status(404).send({ error: 'Notification not found' });
        }

        res.send({ message: 'Notification deleted' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
