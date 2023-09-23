const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'BIjLhKcQvhGxSmc6WbRn2bGzXvp-e3mXmZLN87h1YHabyB6QCZAZv38qfA1sOCJKOq6WsyzHjqmsbAlV3Dx9hR0';
const privateVapidKey = 'R0KYY6LSn5hOxR6xiDK7UiZRMuRPlI5jBwS809QhP-M';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('subscription', subscription);
    res.status(201).json({ message: 'subscription received'});

    webpush.setVapidDetails('mailto:freiheit@htw-berlin.de', publicVapidKey, privateVapidKey);
});

module.exports = router;
