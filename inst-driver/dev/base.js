'use strict';

var events  = require('events');
var net     = require('net');
var uitl    = require('util');
var debug = require('debug');
var log = debug('base:log');
var info = debug('base:info');
var error = debug('base:error');
var usbDev = require('./devUsb.js');

var sysConstant=require('../sys/sysConstant.js');

// function enableSocketTime(dsoObj) {
//     dsoObj.net.socket.setTimeout(1500,function() {
//         log('socket timeout');
//         if(dsoObj.state.conn === 'timeout') {
//             dsoObj.net.socket.end();
//             dsoObj.net.socket.destroy();
//         }
//     })
// }
// function enableInterfTime(dsoObj) {
//     if(dsoObj.interf === 'net')
//         enableSocketTime(dsoObj);
// }
function show_props(obj, objName) {
    var obj_string = '';

    for (var i in obj) {
        if (typeof obj[i] === 'object'){
            obj_string += show_props(obj[i],i.toString());
        }else{
            obj_string += objName + '.' + i + '=' + obj[i] + '\n';
        }
    }

    return obj_string;
}


function getIDN(dev, data, cb) {
    var id = data.toString().split(',');
    var supportType = sysConstant.supportType;
    dev.gdsType = '';
    for (var j = 0; j < supportType.length; j++) {
        var gdsModel = dev.commandObj[supportType[j]].model;
        for (var i = 0; i < gdsModel.length ; i++) {
            log('compare ' + id[1] + 'with ' + gdsModel[i]);
            if (id[1] === gdsModel[i]) {
                dev.gdsType = supportType[j];
                dev.gdsModel = id[1];
                dev.maxChNum = dev.commandObj[supportType[j]].maxChNum[gdsModel[i]];
                break;
            }
        }
    }

    log('gdsType=' + dev.gdsType);
    log('gdsModel=' + dev.gdsModel);

    //cb(null,data);
    return true;
}
function checkDsoExist(dev, callback) {
    var timeoutCnt = 0;
    log('checkDsoExist');
    log('write command to server');
    dev.state.conn = 'query';
    dev.cmdHandler = getIDN;
    dev.handlerSelf = dev;
    dev.state.setTimeout = true;
    dev.state.timeoutObj = setTimeout(function() {
        log('settimeout');
        dev.state.conn = 'timeout';
        dev.write('*idn?\r\n');
    }, 1000);
    if(dev.write('*idn?\r\n')){
        dev.syncCallback = (function() {
            var self = this;

            if(timeoutCnt++ > 10) {
                callback('error');
            }

            if(this.gdsType ==='') {
                this.state.setTimeout = true;
                this.state.timeoutObj = setTimeout(function() {
                    log('settimeout');
                    self.state.conn = 'timeout';
                    self.write('*idn?\r\n');
                }, 1000);
            }else {
                callback(null);
            }
        }).bind(dev);
    }
    else{
        log('checkDsoExist error');
        clearTimeout(dev.state.timeoutObj);
    }

};
var Dev = function() {
    // dsoObj.state='connectting';
    this.state = {
        conn : 'disconnect',
        currentCmd : '',
        currentId : '',
        setTimeout : false,
        timeoutObj : {},
        errCode : {message:'', type:'', handler:function(){}}
    };
    // this.port=port;
    // this.host_addr=host_addr;
    this.interf = 'net';
    this.gdsType = '';
    this.gdsModel = '';
    this.chNum = 0;
    this.activeCh = '';
    this.cmdHandler = getIDN;
    this.handlerSelf = {};
    this.syncCallback = function(){};
    this.maxChNum = 0;
    this.commandObj = {};
    this.cmdSequence = [];
    this.writeTimeoutObj = null;
    this.asyncWrite = 'done';
    this.errHandler = null;
    this.write = function(data) {
        if (this.interf === 'usb') {
            if(this.usb.write(data))
                return true;
            else
                return false;
        }else if (this.interf === 'net') {
            this.net.socket.write(data);
            return true;
        }
        else{
            log('error: interf not support');
            return false;
        }
        // return true;
    };
    this.dataHandler = (function(data) {
        if ((data === 0x0a) && (data.length === 1)) {
            log('receive one byte data');
            log(Number(data));
            log(data);
            log('=====================');
            return;
        }

        log('dataHandler receive :' + data.slice(0,20) + ',length=' + data.length);
        if (this.state.setTimeout) {
            // if(this.state.conn!=='timeout'){
                log('clearTimeout');
                clearTimeout(this.state.timeoutObj);
            // }
            this.state.setTimeout=false;
        }
        if (this.cmdHandler(this.handlerSelf, data,this.syncCallback) ===true) {
            if (typeof this.syncCallback === 'function') {
                log('call callback');
                this.syncCallback();
            }
        }
    }).bind(this);
    return this;
}
Dev.prototype.onSocketErr=function(cb) {
    var self = this;
    this.net.socket.on('error', function(e) {
        log('onTcpConnect: connect error!');
        self.state.conn = 'disconnect';
        self.net.socket.end();
        if (cb){
            cb(e.message);
        }
    });
}
Dev.prototype.tcpConnect = function(Callback) {
    var err_string;
    var self = this;

    if(self.state.conn==='connected'){
        Callback();
        return;
    }
    this.net.socket = net.connect( this.net.port, this.net.host_addr, function() { //'connect' listener
                      log('connected to server!');
                      //dsoObj.net.socket.setEncoding('utf8');
                      self.net.socket.setMaxListeners(0);
                      self.state.conn = 'connected';
                      self.interf = 'net';
                      // self.net.socket.on('data',self.net.dataHandler);
                      self.net.socket.on('data',self.dataHandler);
                      checkDsoExist(self,Callback);
                      // if(Callback)
                      //   Callback();
                });

    this.net.socket.on('close', function(e) {
        log('onTcpConnect: close!');
        self.state.conn = 'disconnect';
        err_string = e.message;
        //dsoObj.net.socket.destroy();
    });
};
Dev.prototype.tcpDisconnect = function(Callback) {
    var self = this;

    this.net.socket.removeAllListeners('close');
    this.net.socket.on('close', function(e) {
        log('onTcpConnect: close!');
        self.state.conn = 'disconnect';
        if(Callback){
            Callback();
        }
    });
    this.net.socket.end();
};
Dev.prototype.usbConnect = function(Callback) {
    var err_string;
    var self = this;

    usbDev.openUsb(this, function() {
            log('openUsb');
            // self.usb.onData(self.dataHandler);
            checkDsoExist(self, Callback);
    });
};
Dev.prototype.usbDisconnect = function(Callback) {
    var self = this;

    usbDev.closeUsb(this, function() {
        self.state.conn='disconnected';
        self.usb.device=null;
        self.interf='empty';
    });
};



// uitl.inherits(Dev, events.EventEmitter);

exports.Dev = Dev;

