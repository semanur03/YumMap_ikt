const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'BHYYJgIo2W1QmEN4SRAOedSkahuF9_8z9DVjnNr6oa-9r4x7yumrAuvRz-jxGdulhD1uJ6eF9oxu9ZxlmE0Qnj4';
const privateVapidKey = 'HLyTID69J9QyCvA9CDIzAa6PmawbsjAsBvGNDAikkD4';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('subscription', subscription);
    res.status(201).json({ message: 'subscription received'});

    webpush.setVapidDetails('mailto:semanur.uyar@student.htw-berlin.de', publicVapidKey, privateVapidKey);
});

module.exports = router;
