const express = require('express');
const router = express.Router();
const Post = require('../models/posts')
const upload = require('../middleware/upload')
const mongoose = require('mongoose')
require('dotenv').config()
const webpush = require('web-push');

const connection = mongoose.createConnection(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DB_NAME });
/* ----------------- POST ---------------------------- */

const publicVapidKey = 'BHYYJgIo2W1QmEN4SRAOedSkahuF9_8z9DVjnNr6oa-9r4x7yumrAuvRz-jxGdulhD1uJ6eF9oxu9ZxlmE0Qnj4';
const privateVapidKey = 'HLyTID69J9QyCvA9CDIzAa6PmawbsjAsBvGNDAikkD4';
const pushSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/dY47--_98cs:APA91bFF9mqBhQYOsKgyK-LvFUq3K8n8CHNvpyUjhTllHENEH5flTGm27NPmLWd7-knK3XY6_87rq6ldmGlsBOpgeeOBTEWT5PlIVj3pqh2dZdf67SsRIYmGquSTqM85z964M15EhTlK',       
    keys: {
        p256dh: 'BHR-FZrEdqf48LYbsX7oZYCg7GeUqjc2Zadj_p7E1Yx83yf6p4qyohvEqbqTr0XY6V0Cxj3dRsE8ILN85V9Z8Fc',
        auth: 'JnodUdTyRI6SBzgz_z7_KQ'
      }
};

function sendNotification() {
    webpush.setVapidDetails('mailto:semanur.uyar@student.htw-berlin.de', publicVapidKey, privateVapidKey);
    const payload = JSON.stringify({
        title: 'New Push Notification',
        content: 'New data in database!',
        openUrl: '/help'
    });
    webpush.sendNotification(pushSubscription,payload)
        .catch(err => console.error(err));
    console.log('push notification sent');
    // res.status(201).json({ message: 'push notification sent'});
}

// POST one post
router.post('/', upload.single('file'), async(req, res) => {
    if(req.file === undefined)
    {
        return res.send({
            "message": "no file selected"
        })
    } else {
        const newPost = new Post({
            title: req.body.title,
            location: req.body.location,
            rating: req.body.rating,
            image_id: req.file.filename,
            date: req.body.date
        })
        console.log('newPost', newPost)
        await newPost.save();
        sendNotification();
        return res.send(newPost)
    }
})

/* ----------------- GET ---------------------------- */

function getOnePost(id) {
    return new Promise( async(resolve, reject) => {
        try {
            
            const post = await Post.findOne({ _id: id });
            let fileName = post.image_id;
            const files = connection.collection('posts.files');
            const chunks = connection.collection('posts.chunks');

            const cursorFiles = files.find({filename: fileName});
            const allFiles = await cursorFiles.toArray();
            const cursorChunks = chunks.find({files_id : allFiles[0]._id});
            const sortedChunks = cursorChunks.sort({n: 1});
            let fileData = [];
            for await (const chunk of sortedChunks) {
                fileData.push(chunk.data.toString('base64'));
            }
            let base64file = 'data:' + allFiles[0].contentType + ';base64,' + fileData.join('');
            let getPost = new Post({
                "title": post.title,
                "location": post.location, 
                "rating": post.rating, 
                "image_id": base64file,
                "date": post.date 
            });
            //console.log('getPost', getPost)
            resolve(getPost)
        } catch {
            reject(new Error("Post does not exist!"));
        }
    })
}

function getAllPosts() {
	return new Promise( async(resolve, reject) => {
		const sendAllPosts = [];
		const allPosts = await Post.find();
		try {
			for(const post of allPosts) {
				// console.log('post', post)
				const onePost = await getOnePost(post._id);
				sendAllPosts.push(onePost);
			}
			// console.log('sendAllPosts', sendAllPosts)
			resolve(sendAllPosts)
		} catch {
				reject(new Error("Posts do not exist!"));
    }
	});
}

// GET one post via id
router.get('/:id', async(req, res) => {
    getOnePost(req.params.id)
    .then( (post) => {
        console.log('post', post);
        res.send(post);
    })
    .catch( () => {
        res.status(404);
        res.send({
            error: "Post does not exist!"
        });
    })
});

// GET all posts
router.get('/', async(req, res) => {
    
    getAllPosts()
    .then( (posts) => {
        res.send(posts);
    })
    .catch( () => {
        res.status(404);
        res.send({
            error: "Post do not exist!"
        });
    })
});


/* ----------------- DELETE ---------------------------- */

// DELETE one post via id
router.delete('/:id', async(req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })
        let fileName = post.image_id;
        await Post.deleteOne({ _id: req.params.id });
        await collectionFiles.find({filename: fileName}).toArray( async(err, docs) => {
            await collectionChunks.deleteMany({files_id : docs[0]._id});
        })
        await collectionFiles.deleteOne({filename: fileName});
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Post does not exist!" })
    }
});

module.exports = router;