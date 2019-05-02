const assert = require('chai').assert;
const {DateTime} = require('luxon');
const date = require('../forum').get_date;

function get_date_test() {
    return DateTime.local().toLocaleString(DateTime.DATETIME_SHORT);
}

describe('Forum', function(){
    it('app should return current date and time', function(){
        let result = date();
        assert.equal(result, get_date_test());
    })
})
