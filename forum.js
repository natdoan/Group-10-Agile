const express = require('express');
const utils = require('./utils');
const pass = require('./passport.js');
const {DateTime} = require('luxon');

var router = express.Router();

router.use(pass);

// Add post to the db
router.post('/add_post', add_post);
router.post('/add_reply', add_reply);
router.post('/delete_post', delete_post);
router.post('/edit_post', edit_post);
router.post('/edit_reply', edit_reply);

function get_date() {
    return DateTime.local().toLocaleString(DateTime.DATETIME_SHORT);
}

function add_post(request, response) {
    var title = request.body.title;
    var message = request.body.message;
    var username = request.user.username;

    var db = utils.getDb();

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
    var thread_id = request.body.id;
    var edited_message = request.body.edit_textarea;

    var db = utils.getDb();
    var ObjectId = utils.getObjectId();
    
    db.collection('messages').findOneAndUpdate({
        _id: new ObjectId(thread_id)
    }, {
        $set: {
            message: edited_message,
            edited_date: "Last edit: " + get_date()
        }
    }, (err, result) => {
        if (err) {
            response.send('Unable to edit message');
        }
        response.redirect('back');
    });
}

function delete_post(request, response) {
    var thread_id = request.body.id;
    var username = request.user.username;

    var db = utils.getDb();
    var ObjectId = utils.getObjectId();

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
    var reply = request.body.reply;
    var username = request.user.username;
    var thread_id = request.body.id;

    var db = utils.getDb();

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

function edit_reply(request, response) {
    var reply_id = request.body.reply_id;
    // var reply_username = request.body.reply_username;
    var edited_reply = request.body.edit_reply_textarea;

    // console.log("reply id is " + reply_id);    
    // console.log("reply's author is " + reply_username);
    // console.log("current reply says " + edited_reply);

    var db = utils.getDb();
    var ObjectId = utils.getObjectId();
    
    db.collection('messages').findOneAndUpdate({
        _id: new ObjectId(reply_id)
    }, {
        $set: {
            message: edited_reply,
            edited_date: "Last edit: " + get_date()
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
  router: router
};
