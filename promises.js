const utils = require('./utils.js');

// Populates message board page with the titles of each 
// message in the database
const messagePromise = () => {
    return new Promise((resolve, reject) => {
        let db = utils.getDb();

        db.collection('messages').find({
            type: 'thread'
        }, {
            _id: 0
        }).toArray((err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result.reverse());
        });
    });
};

// Retrieves thread details
const threadPromise = (param_id) => {
    return new Promise((resolve, reject) => {
        let db = utils.getDb();
        let ObjectId = utils.getObjectId();

        let query = {
            _id: ObjectId(param_id)
        };

        db.collection('messages').findOne(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

// Retrieves all replies of a thread
const replyPromise = (param_id) => {
    return new Promise ((resolve, reject) => {
        let db = utils.getDb();

        db.collection('messages').find({
            thread_id: param_id
        }).toArray((err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

const category_promise = (param_category) => {
    return new Promise ((resolve, reject) => {
        let db = utils.getDb();

        db.collection('messages').find({
            $and:[
                {type: "thread"},
                {category: param_category}
            ]
        }, {
            _id: 0
        }).toArray((err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result.reverse());
        });
    });
};

const user_promise = (param_user) => {
    return new Promise((resolve, reject) => {
        let db = utils.getDb();
        
        query = {
            username: param_user
        };

        db.collection("users").findOne(
            query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            }
        )
    });
};

const user_threads_promise = (param_user) => {
    return new Promise ((resolve, reject) => {
        let db = utils.getDb();

        db.collection('messages').find({
            $and:[
                {type: "thread"},
                {username: param_user}
            ]
        }, {
            _id: 0
        }).toArray((err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result.reverse());
        });
    });
};

module.exports = {
    messagePromise: messagePromise,
    threadPromise: threadPromise,
    replyPromise: replyPromise,
    category_promise: category_promise,
    user_promise: user_promise,
    user_threads_promise: user_threads_promise
};
