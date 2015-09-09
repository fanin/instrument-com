var msoDispatcher = require('../dispatcher/mso-consoleDispatcher');
var msoConstants  = require('../constants/mso-consoleConstants');
var EventEmitter        = require('events').EventEmitter;
var assign              = require('object-assign');

var CHANGE_EVENT = 'GREETINGS_CHANGE';

var extensionErrorMsg = '';
var greetingsMsg      = '';
var rudeMsg           = '';

var msoStore = assign({}, EventEmitter.prototype, {
    getGreetingsMsg: function() {
        return greetingsMsg;
    },

    getRudeMsg: function() {
        return rudeMsg;
    },

    emitChange: function(changes) {
        this.emit(CHANGE_EVENT, changes);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
msoDispatcher.register(function(action) {
    switch (action.actionType) {
        case msoConstants.GREETINGS_SAY_HELLO:
            break;
        case msoConstants.GREETINGS_SAY_HELLO_SUCCESS:
            greetingsMsg = action.msg;
            msoStore.emitChange();
            break;
        case msoConstants.GREETINGS_SAY_HELLO_FAIL:
            rudeMsg = action.msg;
            msoStore.emitChange();
            break;
    }
});

module.exports = msoStore;
