const express = require('express');
const utils = require('./utils');
const pass = require('./passport.js');
const {DateTime} = require('luxon');

const router = express.Router();

router.use(pass);

router.post('/add_post', add_post);
router.post('/add_reply', add_reply);
router.post('/delete_post', delete_post);
router.post('/edit_post', edit_post);
router.post('/edit_reply', edit_reply);

function get_date() {
    return DateTime.local().toLocaleString(DateTime.DATETIME_SHORT);
}

function add_post(request, response) {
    let title = request.body.title;
    let message = request.body.message;
    let username = request.user.username;
    let category = request.body.category;

    let db = utils.getDb();

    db.collection('messages').insertOne({
        title: title,
        message: message,
        username: username,
        type: 'thread',
        date: get_date(),
        thread_id: null,
        category: category,
        replies: 0
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
        $set: {
            message: edited_message,
            edited_date: "| Last edit: " + get_date()
        }
    }, (err, result) => {
        if (err) {
            response.send('Unable to edit message');
        }
        response.redirect('back');
    });
}

function delete_post(request, response) {
    let thread_id = request.body.id;

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

    let ObjectId = utils.getObjectId();
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
        db.collection('messages').findOneAndUpdate({
            _id: new ObjectId(thread_id)
        }, {
            $inc: {
                replies: 1
            }
        }, (err, result) => {
            response.redirect('back');
        });
    });
    
}

function edit_reply(request, response) {
    let reply_id = request.body.reply_id;
    let edited_reply = request.body.edit_reply_textarea;

    let db = utils.getDb();
    let ObjectId = utils.getObjectId();
    
    db.collection('messages').findOneAndUpdate({
        _id: new ObjectId(reply_id)
    }, {
        $set: {
            message: edited_reply,
            edited_date: "| Last edit: " + get_date()
        }
    }, (err, result) => {
        if (err) {
            response.send('Unable to edit reply');
        }
        response.redirect('back');
    });
}

module.exports = {
  get_date: get_date,
  router: router,
  add_post: add_post,
  edit_reply: edit_reply,
};
