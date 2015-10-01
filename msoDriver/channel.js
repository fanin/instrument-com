'use strict';

var sytConstant = require('./sysConstant.js');
var propMethod  =  require('./propMethod.js');
var util = require('util');
var debuglog_noisy = util.debuglog('noisy');
var debug  =  require('debug');
var log  =  debug('channel:log');
var info  =  debug('channel:info');
var error  =  debug('channel:error');

function Channel(){
    this.coupling = 'DC';
    this.impedance = '1E+6';
    this.invert = 'OFF';
    this.bandwidth = 'FULL';
    this.expand = 'CENTER';
    this.state =  'OFF';
    this.scale = '1E+1';
    this.position = '0E+0';
    this.deskew = '0E+0';
    this.rawdata = new Buffer(10000);
    this.raw_state = '0';
    this.probe = {
        unit:'voltage',
        atten:'1E+1'
    };
    this.dataCount = 0;
    this.recCount = 0;
}

Channel.prototype.cmdHandler = {

    'COUPling': {
                setHelper : function(chObj, arg, cb) {
                            chObj.coupling = arg;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0,-1);
                            chObj.coupling = res.toString();
                            return true;
                          }
    },
    'BWLimit' : {
                setHelper : function(chObj, arg, cb) {
                            chObj.bandwidth = arg;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0,-1);
                            chObj.bandwidth = res.toString();
                            return true;
                          }
    },
    'VerPOSition' : {
                setHelper : function(chObj, arg, cb) {
                            chObj.position = arg.toString();
                            if (chObj.temp !== parseFloat(arg)) {
                                if (cb)
                                    cb(['-500','\''+chObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                return false;
                            }
                            return true;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0, -1);
                            chObj.position = res.toString();
                            return true;
                          }
    },
    'VerSCALe' : {
                setHelper : function(chObj, arg, cb) {
                            chObj.scale = arg;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0, -1);
                            chObj.scale = res.toString();
                            return true;
                          }
    },
    'ChState' : {
                setHelper : function(chObj, arg, cb) {
                            chObj.state = arg;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0, -1);
                            chObj.state = res.toString();
                            return true;
                          }
    },
    'VerEXPand' : {
                setHelper : function(chObj, arg, cb) {
                            chObj.expand = arg;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0, -1);
                            chObj.expand = res.toString();
                            return true;
                          }
    },
    'IMPedance' : {
                setHelper : function(chObj, arg, cb) {
                            chObj.impedance = arg;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0, -1);
                            chObj.impedance = res.toString();
                            return true;
                          }
    },
    'INVert' : {
                setHelper : function(chObj, arg, cb) {
                            chObj.invert = arg;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0, -1);
                            chObj.invert = res.toString();
                            return true;
                          }
    },
    'DESKew' : {
                setHelper : function(chObj, arg, cb) {
                            chObj.deskew = arg.toString();
                            if (chObj.temp !== parseFloat(arg)) {
                                if (cb)
                                    cb(['-500','\''+chObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                return false;
                            }

                            return true;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0, -1);
                            chObj.deskew = res.toString();
                            return true;
                          }

    },
    'PROBe_RATio' : {
                setHelper : function(chObj, arg, cb) {
                            chObj.probe.atten = arg;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0, -1);
                            chObj.probe.atten = res.toString();
                            return true;
                          }
    },
    'PROBe_Type' : {
                setHelper : function(chObj, arg, cb) {
                            chObj.probe.unit = arg;
                          },
                getHandler : function(chObj, res, cb) {
                            res = res.slice(0, -1);
                            chObj.probe.unit = res.toString();
                            return true;
                          }
    },
    'AcqMemory' : {
                setHelper : function(chObj, arg ,cb) {
                    return false;
                },
                getHandler : function(chObj, data, cb) {
                                // log('typeof data = '+typeof data);
                                if (chObj.dataCount === 0) {
                                    var header;
                                    if (data.length > 10) {
                                        header = data.slice(0,10).toString();
                                    }else {
                                        header = data.toString();
                                    }
                                    log('data length='+data.length);
                                    //log('data[0]='+data[0]);
                                    if (header[0] === '#') {
                                        var num;
                                        num = Number(header[1]);
                                        chObj.dataCount = Number(header.slice(2,Number(header[1])+2));
                                        // delete sysCmd.dispData;
                                        chObj.rawdata = new Buffer(chObj.dataCount);
                                         log('raw dataCount = '+chObj.dataCount);
                                        //log(sysObj);
                                        chObj.rawdata = chObj.rawdata.slice(0,chObj.dataCount);
                                        if (data.length > (Number(header[1])+2)) {
                                            log('before slice data length = '+data.length);
                                            data = data.slice((Number(header[1]) + 2), data.length);
                                            log('slice data length = ' + data.length);
                                            data.copy(chObj.rawdata, chObj.recCount);
                                            chObj.recCount += data.length;
                                            log('=======');
                                            if (chObj.recCount >= chObj.dataCount){
                                                // if(chObj.recCount>chObj.dataCount){
                                                //     chObj.rawdata=chObj.rawdata.slice(0,-1);
                                                // }
                                                chObj.recCount = 0;
                                                chObj.dataCount = 0;
                                                log('last 1 byte = '+data[data.length-1]);

                                                return true;
                                            }
                                        }
                                    }
                                }else {
                                    // log('chObj.recCount = '+chObj.recCount+',data.length = '+data.length);
                                    data.copy(chObj.rawdata, chObj.recCount);
                                    chObj.recCount += data.length;
                                    // log('chObj.recCount='+chObj.recCount+',data.length='+data.length);
                                    if (chObj.recCount >= chObj.dataCount) {
                                        // if(chObj.recCount>chObj.dataCount){
                                        //     log('slice data');
                                        //     chObj.rawdata=chObj.rawdata.slice(0,-1);
                                        // }
                                        //log('chObj.recCount='+chObj.recCount);
                                        log('!!!chObj.rawdata length=' + chObj.rawdata.length);
                                        chObj.recCount = 0;
                                        chObj.dataCount = 0;
                                        return true;
                                    }
                                }
                                return false;
                            }
    },
    'AcqState' : {
                setHelper : function(chObj, arg, cb){
                            return false;
                          },
                getHandler : function(chObj, res, cb){
                            res = res.slice(0, -1);
                            chObj.raw_state = res.toString();
                            return true;
                          }
    }

};

exports.initChanObj = function(id) {

    var chanCmd = new Channel();

    chanCmd.id = id;
    chanCmd.prop = propMethod.CreatMethod.call(this, id);
    // log('meas id='+id);
    // log('meas this='+this);
    return chanCmd;

}
