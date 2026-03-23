const Notification = require('../models/Notification');

const createNotification = async ({
    recipientId,
    actorId = null,
    type,
    title,
    message,
    link = null,
    metadata = {}
}) => {
    if (!recipientId || !type || !title || !message) {
        return null;
    }

    return Notification.create({
        recipient: recipientId,
        actor: actorId,
        type,
        title,
        message,
        link,
        metadata
    });
};

const createNotificationsForRecipients = async ({
    recipientIds = [],
    actorId = null,
    type,
    title,
    message,
    link = null,
    metadata = {}
}) => {
    const uniqueIds = [...new Set(
        recipientIds
            .filter(Boolean)
            .map((id) => String(id))
    )];

    if (!uniqueIds.length || !type || !title || !message) {
        return [];
    }

    const docs = uniqueIds.map((recipient) => ({
        recipient,
        actor: actorId,
        type,
        title,
        message,
        link,
        metadata
    }));

    return Notification.insertMany(docs, { ordered: false });
};

module.exports = {
    createNotification,
    createNotificationsForRecipients
};
