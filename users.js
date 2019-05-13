const express = require('express');
const bcrypt = require('bcrypt');

const utils = require('./utils');

const router = express.Router();

router.post('/saveUser', saveUser);

module.exports = router;

function saveUser(request, response) {
    let email = request.body.email;
    let username = request.body.username;
    let password = request.body.password;

    let email_insensitve = new RegExp(email, "i");
    let userane_insensitive = new RegExp(username, "i");

    let db = utils.getDb();

    let query = {
        $or: [
            {email: email_insensitve},
            {username: userane_insensitive}
        ]
    };

    db.collection('users').find(query).toArray((err, result) => {
        if (result.length == 0) {
            db.collection('users').insertOne({
                email: email,
                username: username,
                password: bcrypt.hashSync(password, 10),
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
