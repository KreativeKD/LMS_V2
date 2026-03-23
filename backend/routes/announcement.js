const express = require('express');
const Announcement = require('../models/Announcement');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const sanitizePayload = (payload = {}) => ({
    title: typeof payload.title === 'string' ? payload.title.trim() : '',
    message: typeof payload.message === 'string' ? payload.message.trim() : '',
    tickerText: typeof payload.tickerText === 'string' ? payload.tickerText.trim() : '',
    isTicker: Boolean(payload.isTicker),
    isActive: payload.isActive === undefined ? true : Boolean(payload.isActive)
});

// Admin: List all announcements for management
router.get('/', auth, authorize('admin'), async (req, res) => {
    try {
        const announcements = await Announcement.find({})
            .populate('createdBy', 'username role')
            .populate('courseId', 'title')
            .sort({ createdAt: -1 })
            .lean();

        res.send(announcements);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch announcements' });
    }
});

// Admin: Create manual announcement
router.post('/', auth, authorize('admin'), async (req, res) => {
    try {
        const data = sanitizePayload(req.body);

        if (!data.title || !data.message) {
            return res.status(400).send({ error: 'Title and message are required' });
        }

        const announcement = await Announcement.create({
            title: data.title,
            message: data.message,
            tickerText: data.tickerText,
            isTicker: data.isTicker,
            isActive: data.isActive,
            type: 'manual',
            createdBy: req.user._id
        });

        res.status(201).send(announcement);
    } catch (error) {
        res.status(400).send({ error: 'Failed to create announcement' });
    }
});

// Admin: Update announcement (including ticker settings)
router.patch('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const updates = {};
        const allowed = ['title', 'message', 'tickerText', 'isTicker', 'isActive'];

        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                updates[key] = req.body[key];
            }
        }

        if (typeof updates.title === 'string') updates.title = updates.title.trim();
        if (typeof updates.message === 'string') updates.message = updates.message.trim();
        if (typeof updates.tickerText === 'string') updates.tickerText = updates.tickerText.trim();

        if (updates.title !== undefined && !updates.title) {
            return res.status(400).send({ error: 'Title cannot be empty' });
        }
        if (updates.message !== undefined && !updates.message) {
            return res.status(400).send({ error: 'Message cannot be empty' });
        }

        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!announcement) {
            return res.status(404).send({ error: 'Announcement not found' });
        }

        res.send(announcement);
    } catch (error) {
        res.status(400).send({ error: 'Failed to update announcement' });
    }
});

// Admin: Delete announcement
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).send({ error: 'Announcement not found' });
        }

        res.send({ message: 'Announcement deleted' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete announcement' });
    }
});

module.exports = router;
