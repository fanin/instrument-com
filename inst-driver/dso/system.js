'use strict';

var propMethod = require('../dev/propMethod.js');
var debug = require('debug');
var log = debug('sys:log');
var info = debug('sys:info');
var error = debug('sys:error');
function SysCmd() {
    this.sysLock = 'OFF';
    this.dispData = new Buffer(1152000);
    this.AutosetMode = 'FITSCREEN';
    this.dataCount = 0;
    this.recCount = 0;
    this.staWeight = '2';
    this.staMode =  'OFF';
    this.lrn = [];


}

SysCmd.prototype.cmdHandler = {
        'IDN':{
                    getHandler:function(sysObj,res,cb){
                                log(res);
                                return true;
                              }
        },
        'LRN':{
                    getHandler:function(sysObj,res,cb){
                                log(res);

                                if(res[res.length-1] == 0x0a)
                                    return true;
                                else{
                                    sysObj.lrn = res;
                                }

                                return false;
                              }
        },
        'RST':{
                    setHelper:function(sysObj,arg,cb){
                                log('sent RST command');
                                log(sysObj.cmdHandler);
                                return true;
                              }
        },
        'SysLock':{
                    setHelper:function(sysObj,arg,cb){
                                log('sent SysLock command');
                                log(sysObj.cmdHandler);
                                sysObj.sysLock = arg;
                                return true;
                              },
                    getHandler:function(sysObj,res,cb){
                                log(res);
                                res = res.slice(0,-1);
                                sysObj.sysLock = res.toString();
                                return true;
                              }
        },
        'SysErr':{ //
                    getHandler:function(dsoObj,res,cb){
                                log(res.toString());
                                if(res.toString() === '+0, \'No error.\''){
                                    dsoObj.state.errCode.message='';

                                }
                                else{
                                    log('command error ' + res.toString());
                                    dsoObj.state.errCode.message = res.toString();
                                }
                                return true;
                              }
        },
        'AutosetMode':{
                    setHelper:function(sysObj, arg, cb) {
                                log('sent SysLock command');
                                log(sysObj.cmdHandler);
                                return true;
                              },
                    getHandler:function(sysObj, res, cb) {
                                log(res);
                                res = res.slice(0, -1);
                                sysObj.AutosetMode = res.toString();
                                return true;
                              }
        },
        'DispOut':{
                    getHandler:function(sysObj, data, cb) {
                                //log('typeof data='+typeof data);
                                if (sysObj.dataCount === 0) {
                                    var header;
                                    if (data.length > 10) {
                                        header = data.slice(0,10).toString();
                                    }
                                    else{
                                        header = data.toString();
                                    }
                                    // log('data length = '+data.length);
                                    //log('data[0] = '+data[0]);
                                    if (header[0] === '#') {
                                        var num;
                                        num = Number(header[1]);
                                        sysObj.dataCount = Number(header.slice(2, Number(header[1]) + 2));
                                        // delete sysCmd.dispData;
                                        sysObj.dispData = new Buffer(sysObj.dataCount + 1);
                                         log('sysObj.dataCount = ' + sysObj.dataCount);
                                        //log(sysObj);
                                        sysObj.dispData = sysObj.dispData.slice(0, sysObj.dataCount + 1);
                                        if (data.length > (Number(header[1]) + 2)) {
                                            log('before slice data length = ' + data.length);
                                            data = data.slice((Number(header[1]) + 2), data.length);
                                            log('slice data length = '+data.length);
                                            data.copy(sysObj.dispData, sysObj.recCount);
                                            sysObj.recCount += data.length;
                                            log('=======');
                                            if (sysObj.recCount >= sysObj.dataCount) {
                                                if (sysObj.recCount > sysObj.dataCount) {
                                                    sysObj.dispData = sysObj.dispData.slice(0, -1);
                                                }
                                                sysObj.recCount = 0;
                                                sysObj.dataCount = 0;
                                                log('last 1 byte=' + data[data.length -1 ]);

                                                return true;
                                            }
                                        }
                                    }
                                }
                                else{
                                    // log('sysObj.recCount='+sysObj.recCount+',data.length='+data.length);
                                    data.copy(sysObj.dispData, sysObj.recCount);
                                    sysObj.recCount += data.length;
                                    // log('sysObj.recCount='+sysObj.recCount+',data.length='+data.length);
                                    if (sysObj.recCount >= sysObj.dataCount) {
                                        // if(sysObj.recCount>sysObj.dataCount){
                                        //     sysObj.dispData=sysObj.dispData.slice(0,-1);
                                        // }
                                        //log('sysObj.recCount='+sysObj.recCount);
                                        log('sysObj.dispData length=' + sysObj.dispData.length);
                                        sysObj.recCount = 0;
                                        sysObj.dataCount = 0;
                                        return true;
                                    }
                                }
                                return false;
                              }
        },
        'CLS':{
                    setHelper:function(sysObj, arg, cb) {
                                return true;
                    }
        },
        'RUN':{
                    setHelper:function(sysObj, arg, cb) {
                                return true;
                    }
        },
        'STOP':{
                    setHelper:function(sysObj, arg, cb) {
                                return true;
                    }
        },
        'SINGLE':{
                    setHelper:function(sysObj, arg, cb) {
                        log('SINGLE ......');
                                return true;
                    }
        },
        'FORCE':{
                    setHelper:function(sysObj, arg, cb) {
                                return true;
                    }
        },
        'AUTOSET':{
                    setHelper:function(sysObj, arg, cb) {
                                return true;
                    }
        },
        'StatisticReset':{
                    setHelper:function(sysObj, arg, cb) {
                                return true;
                    }
        },
        'StatisticStaWeight':{
                    getHandler:function(sysObj, res, cb) {
                                res = es.slice(0,-1);
                                sysObj.staWeight = es.toString();
                                return true;
                    },
                    setHelper:function(sysObj,arg,cb){
                                sysObj.staWeight = rg;
                                return true;
                    }
        },
        'StatisticMode':{
                    getHandler:function(sysObj, res, cb) {
                                res = es.slice(0, -1);
                                sysObj.staMode = es.toString();
                                return true;
                    },
                    setHelper:function(sysObj, arg, cb) {
                                sysObj.staMode = rg;
                                return true;
                    }
        }
    };


exports.initSysObj = function(id) {
    var sysCmd = new SysCmd();
    sysCmd.prop = propMethod.CreatMethod.call(this, id);

    return sysCmd;
};


