'use strict';

var chID = require('./sysConstant.js').chID;
var debug = require('debug');
var log = debug('method:log');
var info = debug('method:info');
var error = debug('method:error');



var autosetWaitTimeObj = null;
function checkParameterString(arg, par) {
    for (var i=0; i<par.length; i++) {
        if (arg === par[i])
            return true;
    }
    return false;
}
function Method(id) {
    var method = {
        get:function(prop, res, callback) {
                        var self=this;
                        if (this.gdsType === '') {
                            callback('-300','\''+this.gdsType +'\' not supported');
                            return;
                        }

                        log('this.gdsType='+this.gdsType);
                        log('prop='+prop);
                        var cmd;
                        //var rangeLimit =this.commandObj[this.gdsType][prop].;
                        var self=this;

                        if (autosetWaitTimeObj !== null) {
                            log('==================== autosetWaitTimeObj =================');
                            setTimeout(function() {
                                method.get(prop, res, callback);

                            },5000);
                            return;
                        }

                        if (this.commandObj[this.gdsType][prop].command[0].length > 1) {
                            log('id=' + id);
                            cmd = this.commandObj[this.gdsType][prop].command[chID[id]] + '?\r\n';
                        }
                        else {
                            cmd = this.commandObj[this.gdsType][prop].command + '?\r\n';
                        }

                        log('getProp cmd=' + cmd);
                        this.cmdHandler = this[id].cmdHandler[prop].getHandler;
                        this.handlerSelf = this[id];
                        this.syncCallback = callback;
                        this.write(cmd);


                        this.state.conn = 'query';
                        this.state.currentCmd = cmd;
                        this.state.currentId = id;
                        this.state.setTimeout = true;

                        this.state.timeoutObj = setTimeout(function() {
                            log('settimeout');
                            self.state.conn = 'timeout';
                            cmd = self.commandObj[self.gdsType]['SysErr'].command+'?\r\n';
                            self.cmdHandler = self.sys.cmdHandler['SysErr'].getHandler;
                            self.handlerSelf = self;
                            self.syncCallback = callback;
                            self.write(cmd);
                        }, 500);

                        // this.net.socket.once('error',function(e){
                        //     console.log('on prop_method :connect error!');
                        //     if(typeof callback=== 'function')
                        //         callback(e);
                        // });

        }.bind(this),

        set:function(prop, arg, callback) {
                        // console.log(this);
                        // console.log('ID='+id);
                        // return;

                        if (this.gdsType === '' || this.gdsType === 'undefined') {
                            callback('-300','\'' + this.gdsType + '\' not supported');
                            return;
                        }

                        log('this.gdsType=' + this.gdsType);
                        var cmd;
                        var rangeLimit = this.commandObj[this.gdsType][prop];
                        var self = this;

                        if (prop === 'AUTOSET'||(prop === 'SINGLE')) {
                            log('==================== AUTOSET =================');
                            autosetWaitTimeObj = setTimeout(function() {
                                autosetWaitTimeObj = null;
                                //use opc to check command done
                            },5000);
                        }

                        if (this.commandObj[this.gdsType][prop].command[0].length > 1) {
                            log('id=' + id);

                            cmd = this.commandObj[this.gdsType][prop].command[chID[id]];
                            log(prop + ' commane=' + cmd);
                        }else {
                            cmd = this.commandObj[this.gdsType][prop].command;
                        }


                        if (rangeLimit.parameter_type === 'string') {

                            if (checkParameterString(arg, rangeLimit.parameter)) {
                                cmd +=' '+arg+'\r\n';
                            }else {
                                if (callback)
                                    callback(['-100','\''+arg+'\' argument not supported','cmd '+cmd]);
                                return;
                            }
                        }
                        else if (rangeLimit.parameter_type === 'float_string') {
                            var i=0;
                            if (isNaN(arg)) {
                                cmd += ' ' + rangeLimit.parameter[0] + '\r\n';
                            }else {
                                var fval = parseFloat(arg);

                                for (i=0; i<rangeLimit.parameter.length; i++) {
                                    if(fval === parseFloat(rangeLimit.parameter[i])) {
                                        log('parseFloat='+parseFloat(rangeLimit.parameter[i]));
                                        log('arg='+fval.toExponential(3));
                                        cmd += ' ' + rangeLimit.parameter[i] + '\r\n';
                                        arg = rangeLimit.parameter[i];
                                        break;
                                    }
                                }
                            }
                            if (i >= rangeLimit.parameter.length) {
                                if (callback)
                                    callback(['-100','\''+arg+'\' argument not supported','cmd '+cmd]);
                                return;
                            }
                        }else if (rangeLimit.parameter_type === 'parameter_free') {
                            cmd += '\r\n';
                        }else if (rangeLimit.parameter_type === 'int_value') {
                            if (isNaN(arg)) {
                                if (callback)
                                    callback(['-100','\''+arg+'\' argument not supported','cmd '+cmd]);
                                return;
                            }
                            var val = parseInt(arg,10);
                            cmd = cmd + ' ' + val.toString() + '\r\n';
                        }else {
                            // float_value type use readback to check limitation
                            if (isNaN(arg)) {
                                if (callback)
                                    callback(['-100','\''+arg+'\' argument not supported','cmd '+cmd]);
                                return;
                            }
                            var fval = parseFloat(arg);
                            var scmd = cmd + ' ' + fval.toExponential(3) + '\r\n';
                            var qcmd = cmd + '?\r\n';


                            log('debug info:'+scmd);
                            log('debug info:'+qcmd);
                            this.write(scmd);

                            this.cmdHandler = this[id].cmdHandler[prop].setHelper;
                            this[id].temp = fval;
                            this.handlerSelf = this[id];
                            this.syncCallback = callback;
                            this.write(qcmd);

                            // this.net.socket.once('data',function(data){
                            //     data=data.slice(0,-1);
                            //     console.log('debug info: readback data='+data);
                            //     self[id].cmdHandler[prop].setHelper(self[id],data);
                            //     if(fval != parseFloat(data)){
                            //         if(typeof callback=== 'function')
                            //             callback(['error',arg+' argument doesn't accepte set to near one',arg,data]);
                            //         return;
                            //     }
                            //     if(typeof callback=== 'function')
                            //         callback(null);

                            // });
                            return;
                        }

                        log('cmd set =' + cmd);
                        if (this.write(cmd)) {
                            self[id].cmdHandler[prop].setHelper(self[id],arg);
                            if (callback) {
                                log('cmd set done');
                                callback(null);
                            }
                        }else {
                            this.net.socket.once('drain', function() {
                                this.write(cmd);
                                self[id].cmdHandler[prop].setHelper(self[id],arg);
                                if(callback){
                                    callback(null);
                                }
                            });
                        }
        }.bind(this)
    };

    return method;
}
exports.CreatMethod= Method;





