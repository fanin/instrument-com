'use strict';


var usbDetect = require('usb-detection');
var util=require('util');
var events=require('events');
var usbPort = require('serialport');

var debug = require('debug');
var log = debug('usb:log');
var info = debug('usb:info');
var error = debug('usb:error');

var supportDevice = require('../sys/sysConstant.js').supportDevice;
var __timeoutObj=null;

function pairUsb(dsoObj,callback){
    // var SerialPort=usbPort.SerialPort;
    var device=null,serialNumber;

    usbPort.list(function (err, ports) {
        if(err){
            if(callback){
                	return callback(err);
            }
            else{
                	return ;
            }
        }
        log(ports);
        log(ports.length);
        log('=====================');
        for(var i=0,len=ports.length;i<len;i++){
            log("ports[%d].vendorId %x",i,ports[i].vendorId);
            log("ports[%d].productId %x",i,ports[i].productId);
            log("ports[%d].serialNumber %x",i,ports[i].serialNumber);
            log("dsoObj.usb.vid %x",dsoObj.usb.vid);
            log("dsoObj.usb.pid %x",dsoObj.usb.pid);
            serialNumber= dsoObj.usb.manufacturer+'_'+dsoObj.usb.deviceName+'_'+dsoObj.usb.serialNumber
            log("serialNumber %x",serialNumber);

            if(ports[i].serialNumber===serialNumber){
                if(dsoObj.state.conn!=='connected'){
                    var port=ports[i];
                    if(__timeoutObj==null){
                        __timeoutObj=setTimeout(function(){
                            __timeoutObj=null;
                            device= new usbPort.SerialPort(port.comName,{baudrate: 57600,encoding:'binary'});
                            // util.inherits(dsoObj.usb,events.EventEmitter);
                            log(device);
                            dsoObj.interf='usb';

                            if(device.isOpen()){
                                log('USB device already opened');
                                if(callback)
                                    callback();
                            }else{
                                device.open(function (error) {
                                    if(error){
                                        console.log('error msg: ' + error);
                                        pairUsb(dsoObj,callback);
                                    }
                                    dsoObj.usb.device = device;
                                    dsoObj.state.conn='connected';
                                    log('open USB device');
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
                                    if(callback){
                                        console.log('paireUsb success');
                                        callback(error);
                                    }
                                    else{
                                        console.log('paireUsb success without callback');
                                    }
                                });

                            }
                        }, 1000);
                    }
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
    dsoObj.state.conn='disconnected';
    dsoObj.usb.device=null;
    dsoObj.interf='empty';
}

exports.BindUsbObj=function(dsoObj,device){
    log('BindUsbObj');
    log(device);
    dsoObj.interf='usb';
    dsoObj.usb={
        dataHandler:function(data){
            log('usbDev on data event!');

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
        manufacturer:device.manufacturer,
        deviceName:device.deviceName,
        serialNumber:device.serialNumber,
        vid:device.vendorId,
        pid:device.productId,
        // usbDev:{},
        device:null,
        onChange:(function(){
            log('usb onChange event');
            pairUsb(this);
        }).bind(dsoObj),
        write:(function(data){
            if(this.usb.device === null){
                log('usb device not exist');
                return;
            }
            log('is open ? '+this.usb.device.isOpen());
            log('write data='+data);
            //if(this.usb.device!==null){
                if(this.usb.device.isOpen()){
                    this.usb.device.write(data,function(err, results) {
                      // log('err ' + err);
                        if(err){
                            //TODO : error handler
                            log('results ' + results);
                        }
                    });
                    return true;
                }
				else{
					log('usb device not open !!');
                    // pairUsb(this,function(err){


                    // });
                    return false;
				}
            //}
        }).bind(dsoObj)
        // onData:(function(callback){
        //     // var device= this.usb.device;
        //     // this.usb.device.on('data',callback);
        //     // log(this.usb.device);
        // }).bind(dsoObj)
    };
    // pairUsb take long time, so pair before connect to use
    // pairUsb(dsoObj);
    // usbDetect.on('add:'+vid+':'+pid, dsoObj.usb.onChange);
    // usbDetect.on('remove:'+vid+':'+pid, dsoObj.usb.onChange);

}
exports.regRemoveEvent=function(callback){
    usbDetect.on('remove', callback);
}
exports.regAddEvent=function(callback){
    usbDetect.on('add', callback);
}

exports.listUsbDevice=function(callback){
    var i,len,j;
    var validDevice= [];
    usbPort.list(function (err, ports) {
        if(err){
            if(callback){
                    callback('');
                    return;
            }
            else{
                    return null;
            }
        }
        log('get device');
        log(ports);
        for(i=0, len=ports.length; i < len; i++){
            var port = ports[i];
            for(j in supportDevice){
                var info,k,len_k,manuf='';
                if(port.vendorId === supportDevice[j].vid){

                    info=port.serialNumber.split('_');
                    len_k=info.length;
                    if(len_k>3){
                        for(k=0,len_k=len_k-2; k<len_k; k++){
                            manuf +=info[k]+'_';
                        }

                        info.splice(0,len_k,manuf.slice(0,-1));
                    }
                    validDevice.push({
                        manufacturer:info[0],
                        deviceName:info[1],
                        serialNumber:info[2],
                        vendorId:parseInt(port.vendorId),
                        productId:parseInt(port.productId)
                    });
                    break;
                }
            }
        }
        //log(validDevice.slice());
        callback(validDevice);
    });
}
// exports.pairUsb = pairUsb;

