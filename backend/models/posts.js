const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: String, 
    location: String, 
    image_id: String,
    rating: {
        type: Number,
        default: 0 // Standard-Rating von 0, wenn keines angegeben ist
    },
    date: {
        type: Date,
        default: Date.now // Standard-Datum von jetzt, wenn keines angegeben ist
    }
})

module.exports = mongoose.model('Post', schema);