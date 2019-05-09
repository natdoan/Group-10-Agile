const express = require('express');
const bcrypt = require('bcrypt');

const utils = require('./utils');

const router = express.Router();

router.post('/saveUser', saveUser);

module.exports = router;

function saveUser(request, response) {
    let email = request.body.email.toLowerCase();
    let username = request.body.username.toLowerCase();
    let password = request.body.password;

    let db = utils.getDb();

    let query = {
        $or: [
            {email: email},
            {username: username}
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
