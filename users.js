const express = require('express');
const bcrypt = require('bcrypt');

const utils = require('./utils');

const router = express.Router();

router.post('/saveUser', saveUser);
router.post("/update_desc", update_desc);
router.post("/update_img", update_img);

module.exports = router;

function saveUser(request, response) {
    let email = request.body.email;
    let username = request.body.username;
    let password = request.body.password;

    let email_insensitve = new RegExp(email, "i");
    let username_insensitive = new RegExp(username, "i");

    let db = utils.getDb();

    let query = {
        $or: [
            {email: email_insensitve},
            {username: username_insensitive}
        ]
    };

    db.collection('users').find(query).toArray((err, result) => {
        if (result.length == 0) {
            db.collection('users').insertOne({
                email: email,
                username: username,
                password: bcrypt.hashSync(password, 10),
                description: null,
                image: "https://i.imgur.com/YvBiSYN.png"
            }, (err, result) => {
                if (err) {
                    response.send('Unable to register user');
                }
                response.redirect('/login');
            });
        } else {
            response.send("An account with that username or email already exists.");
        }
    });
}

function update_desc(request, response) {
    let username = request.user.username;
    let description = request.body.description;

    let db = utils.getDb();

    db.collection("users").findOneAndUpdate({
        username: username
    }, {
        $set: {
            description: description
        }
    }, (err, result) => {
        if (err) {
            response.send("Unable to update description");
        }
        response.redirect("back");
    });
}

function update_img(request, response) {
    let username = request.user.username;
    let image = request.body.image;

    let db = utils.getDb();

    db.collection("users").findOneAndUpdate({
        username: username
    }, {
        $set: {
            image: image
        }
    }, (err, result) => {
        if (err) {
            response.send("Unable to update image");
        }
        response.redirect("back");
    });
}
