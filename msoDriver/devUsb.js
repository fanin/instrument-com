'use strict';


// var usbDetect = require('usb-detection');
// var usb = require('usb');
var util=require('util');
var events=require('events');
var usbPort = require('serialport');
var debug = require('debug');
var log = debug('usb:log');
var info = debug('usb:info');
var error = debug('usb:error');


function pairUsb(dsoObj,callback){
    // var SerialPort=usbPort.SerialPort;
    var device=null;

    usbPort.list(function (err, ports) {
        // log(ports);
        log('=====================');
        for(var i=0,len=ports.length;i<len;i++){
            if((ports[i].vendorId==dsoObj.usb.vid)&&(ports[i].productId==dsoObj.usb.pid)){
                if(dsoObj.state.conn!=='connected'){
                    var port=ports[i];
                    setTimeout(function(){
                        dsoObj.usb.device= new usbPort.SerialPort(port.comName,{baudrate: 57600,encoding:'binary'});
                        // util.inherits(dsoObj.usb,events.EventEmitter);
                        dsoObj.state.conn='connected';
                        device=dsoObj.usb.device;
                        // log(device);
                        dsoObj.interf='usb';

                        if(device.isOpen()){
                            if(callback)
                                callback();
                        }else{
                            device.open(function (error) {
                                log('USB device opened');
                                device.on('error',function(){
                                    if(dsoObj.usb.device){
                                        if(dsoObj.usb.device.isOpen()){
                                            dsoObj.usb.device.close();
                                        }
                                    }
                                    dsoObj.state.conn='disconnected';
                                    dsoObj.usb.device=null;
                                    dsoObj.interf='empty';
                                });

                                device.on('data',dsoObj.dataHandler);
                                dsoObj.state.conn='connected';
                                // // device.on('data', function(data) {
                                // //   log('data received: ' + data);
                                // // });
                                // dsoObj.usb.device.write('*idn?\r\n',function(err,results){
                                //     log('err ' + err);
                                //     log('results ' + results);
                                // });
                                //log(error);
                                if(callback)
                                    callback(error);
                            });

                        }
                    }, 2000);
                }
                else{
                    if(callback)
                        callback();
                }
                return;
            }
        }
        if(dsoObj.usb.device){
            if(dsoObj.usb.device.isOpen()){
                dsoObj.usb.device.close();
            }
        }
        dsoObj.state.conn='disconnected';
        dsoObj.usb.device=null;
        dsoObj.interf='empty';
    });
}
exports.openUsb=function(dsoObj,callback){
    pairUsb(dsoObj,callback);
}
exports.closeUsb=function(dsoObj,callback){

    dsoObj.usb.device.close(callback);
}
exports.BindUsbObj=function(dsoObj,vid,pid){
    dsoObj.interf='usb';
    dsoObj.usb={
        dataHandler:function(data){
            // log('socket on data event!');

            if(dsoObj.state.setTimeout){
                if(dsoObj.state.conn!=='timeout'){
                    log('clearTimeout');
                    clearTimeout(dsoObj.state.timeoutObj);
                }
                dsoObj.state.setTimeout=false;
            }
            if(dsoObj.cmdHandler(dsoObj.handlerSelf,data,dsoObj.syncCallback)==true){
                if(typeof dsoObj.syncCallback === 'function'){
                    log('call callback');
                    dsoObj.syncCallback();
                }
            }
        },
        vid:vid,
        pid:pid,
        // usbDev:{},
        device:null,
        onChange:(function(){
            pairUsb(this);
        }).bind(dsoObj),
        write:(function(data){
            log('is open ? '+this.usb.device.isOpen());
            log('write data='+data);
            //if(this.usb.device!==null){
                if(this.usb.device.isOpen()){
                    this.usb.device.write(data,function(err, results) {
                      // log('err ' + err);
                      if(err)
                        log('results ' + results);
                    });
                }
				else{
					log('usb device not open !!');
				}
            //}
        }).bind(dsoObj)
        // onData:(function(callback){
        //     // var device= this.usb.device;
        //     // this.usb.device.on('data',callback);
        //     // log(this.usb.device);
        // }).bind(dsoObj)
    };



    pairUsb(dsoObj);
    // usbDetect.on('add:'+vid+':'+pid, dsoObj.usb.onChange);
    // usbDetect.on('remove:'+vid+':'+pid, dsoObj.usb.onChange);
}

