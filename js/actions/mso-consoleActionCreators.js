var msoDispatcher = require('../dispatcher/mso-consoleDispatcher');
var msoConstants  = require('../constants/mso-consoleConstants');

var msoActionCreators = {


    sayHello: function(from, to) {
        msoDispatcher.dispatch({
            actionType: msoConstants.GREETINGS_SAY_HELLO
        });
    }
}

module.exports = msoActionCreators;
