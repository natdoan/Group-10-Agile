const assert = require('chai').assert;
const date = require('../forum').get_date;

function get_date_test() {
    var offset = -7;
    var date = new Date( new Date().getTime() + offset * 3600 * 1000).toUTCString().replace( / GMT$/, " PT" )

    return date;
}

describe('Forum', function(){
    it('app should return current date and time', function(){
        let result = date();
        assert.equal(result, get_date_test());
    })
})