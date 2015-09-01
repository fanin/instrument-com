'use strict';

var chID = {
    'ch1' : 0,
    'ch2' : 1,
    'ch3' : 2,
    'ch4' : 3,
    'meas1' : 0,
    'meas2' : 1,
    'meas3' : 2,
    'meas4' : 3,
    'meas5' : 4,
    'meas6' : 5,
    'meas7' : 6,
    'meas8' : 7
};

exports.chID = chID;

var dsoState = {
    'disconnect' : 0,
    'timeout' : 1,
    'connected' : 2,
    'query' : 3
};

exports.dsoState = dsoState;

var dsoErrCode = {
    'systemErr' : {message : 'systemErr', type : 1},
    'timeoutErr' : {message : 'timeoutErr', type : 2},
    'commandErr' : {message : 'commandErr', type : 3},
    'intrefErr' : {message : 'intrefErr', type : 4}
};

exports.dsoErrCode = dsoErrCode;
