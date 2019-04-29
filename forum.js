const express = require('express');
const utils = require('./utils');
const pass = require('./passport.js');

const router = express.Router();

router.use(pass);

router.post('/add_post', add_post);
router.post('/add_reply', add_reply);
router.post('/delete_post', delete_post);
router.post('/edit_post', edit_post);

function get_date() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    current_date = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return current_date;
}

function add_post(request, response) {
    let title = request.body.title;
    let message = request.body.message;
    let username = request.user.username;

    let db = utils.getDb();

    db.collection('messages').insertOne({
        title: title,
        message: message,
        username: username,
        type: 'thread',
        date: get_date(),
        thread_id: null
    }, (err, result) => {
        if (err) {
            response.send('Unable to post message');
        }
        response.redirect('/');
    });
}

function edit_post(request, response) {
    let thread_id = request.body.id;
    let edited_message = request.body.edit_textarea;
    
    let db = utils.getDb();
    let ObjectId = utils.getObjectId();
    
    db.collection('messages').findOneAndUpdate({
        _id: new ObjectId(thread_id)
    }, {
        $set: {message: edited_message}
    }, (err, result) => {
        if (err) {
            response.send('Unable to edit message');
        }
        response.redirect('/');
    });
}

function delete_post(request, response) {
    let thread_id = request.body.id;
    let username = request.user.username;

    let db = utils.getDb();
    let ObjectId = utils.getObjectId();

    db.collection('messages').deleteMany({
        $or:[
            {_id: ObjectId(thread_id)},
            {thread_id: thread_id}
        ]
    }, (err, result) => {
        if (err) {
            response.send('Unable to delete message');
        }
        response.redirect('/');
    });
}

function add_reply(request, response) {
    let reply = request.body.reply;
    let username = request.user.username;
    let thread_id = request.body.id;

    let db = utils.getDb();

    db.collection('messages').insertOne({
        message: reply,
        username: username,
        type: 'reply',
        date: get_date(),
        thread_id: thread_id
    }, (err, result) => {
        if (err) {
            response.send('Unable to post message');
        }
        response.redirect('/');
    });
}

module.exports = router;

//hello