const port = process.env.PORT || 8080;

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const utils = require('./utils.js');
const register = require('./users.js');
const pass = require('./passport.js');
const forum = require('./forum.js').router;
const promises = require('./promises.js');

const app = express();

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
    utils.init();
});

hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended:true
}));

hbs.registerHelper('port', () => {
    return port;
});

hbs.registerHelper('year', () => {
    return new Date().getFullYear();
});

app.use(pass);
app.use(register);
app.use(forum);

// CHECKS AUTHENTICATION
checkAuthentication = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/login');
};

checkAuthentication_false = (request, response, next) => {
    if (request.isAuthenticated() != true) {
        return next();
    }
    response.redirect('/');
};

// Login Page
app.get('/login', (request, response) => {
    response.render('login.hbs', {
        title: 'Login',
        heading: 'Log In'
    });
});

// Logout Page
app.get('/logout', (request, response) => {
    request.logout();
    request.session.destroy(() => {
        response.clearCookie('connect.sid');
        response.redirect('/');
    });
});

// Register Page
app.get("/registration", checkAuthentication_false, (request, response) => {
    response.render("registration.hbs", {
        title: 'Registration',
        heading: 'Make an Account'
    });
});

// Forum page
app.get('/', async (request, response) => {
    var messages = await promises.messagePromise();
    
    response.render('forum.hbs', {
        title: 'Home',
        heading: 'Message Board',
        message: messages
    });
});

// Adding new post
app.get('/new_post', checkAuthentication, (request, response) => {
    response.render('new_post.hbs', {
        title: 'Post',
        heading: 'Add a post',
    });
});

// Dynamically generated endpoint for threads
app.get('/thread/:id', async (request, response) => {
    var thread = await promises.threadPromise(request.params.id);

    var replies = await promises.replyPromise(request.params.id);

    // Checks if thread owner matches current user
    var isOP = false;
    if (request.user != undefined){
        if (request.user.username == thread.username) {
            isOP = true;
        }
    }

    // let i;
    // let isReplyOP = false;
    // for (i = 0; i < replies.length; i++){
    //     // console.log(replies[i].username + " posted on " + replies[i].date);
    //     if (request.user != undefined) {
    //         if (request.user.username == replies[i].username) {
    //             // console.log(replies[i].username + " posted on " + replies[i].date);
    //             isReplyOP = replies[i].username;
    //             // console.log(isReplyOP);
    //         }
    //     }
    // }
    
    
    // Passes current user to render if logged in
    let curr_user;
    if (request.user != undefined) {
        curr_user = request.user.username;
        // console.log("curr user is type " + typeof curr_user);
    }

    response.render('thread.hbs', {
        title: thread.title,
        heading: thread.title,
        op_message: thread.message,
        poster: thread.username,
        date: thread.date,
        id: thread._id,
        reply: replies,
        isOP: isOP,
        thread: thread,
        edited_date: thread.edited_date,
        curr_user: curr_user,
    });

    hbs.registerHelper('compare_user', (current, reply, options) => {
        if (current == reply) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
});

module.exports = app;