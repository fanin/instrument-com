'use strict';


// var usbDetect = require('usb-detection');
// var usb = require('usb');
var fs = require('fs');
var util = require('util');
var events = require('events');
// var usbPort = require('serialport');
//var usbPort = require('serialport-electron');

var usbPort = {};//Test only

function pairUsb(dsoObj, callback) {
    // var SerialPort=usbPort.SerialPort;
    var device=null;

    usbPort.list(function (err, ports) {
        // console.log(ports);
        console.log('=====================');
        for (var i=0, len = ports.length; i < len; i++) {
            if ((ports[i].vendorId === dsoObj.usb.vid) && (ports[i].productId === dsoObj.usb.pid)){
                if (dsoObj.state.conn !== 'connected') {
                    var port = ports[i];
                    setTimeout(function() {
                        var buf = new Buffer('*RST?\r\n');
                        console.log(port);
                        // device= new usbPort.SerialPort(port.comName,{baudrate: 57600,encoding:'binary'});
                        fs.open(port.comName, 'w+', function(err, fd){
                            dsoObj.usb.device=fd;
                            dsoObj.state.conn='connected';
                            console.log(err);
                            console.log(fd);
                            dsoObj.interf='usb';
                            console.log(buf);
                            fs.write(fd ,buf, function(err, written, string){
                                console.log('write');
                                console.log(string);
                                if(callback)
                                    callback(error);
                            })

                        })
                    }, 100);
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
exports.BindUsbObj=function(dsoObj,vid,pid){
    dsoObj.interf='usb';
    dsoObj.usb={
        dataHandler:function(data){
            // console.log('socket on data event!');

            if(dsoObj.state.setTimeout){
                if(dsoObj.state.conn!=='timeout'){
                    console.log('clearTimeout');
                    clearTimeout(dsoObj.state.timeoutObj);
                }
                dsoObj.state.setTimeout=false;
            }
            if(dsoObj.cmdHandler(dsoObj.handlerSelf,data,dsoObj.syncCallback)==true){
                if(typeof dsoObj.syncCallback === 'function'){
                    console.log('call callback');
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
            // console.log('is open ? '+this.usb.device.isOpen());
            // console.log('write data='+data);
            //if(this.usb.device!==null){
                if(this.usb.device.isOpen()){
                    this.usb.device.write(data,function(err, results) {
                      // console.log('err ' + err);
                      if(err)
                        console.log('results ' + results);
                    });
                }
                else{
                    console.log('usb device not open !!');
                }
            //}
        }).bind(dsoObj)
        // onData:(function(callback){
        //     // var device= this.usb.device;
        //     // this.usb.device.on('data',callback);
        //     // console.log(this.usb.device);
        // }).bind(dsoObj)
    };



    pairUsb(dsoObj);
    // usbDetect.on('add:'+vid+':'+pid, dsoObj.usb.onChange);
    // usbDetect.on('remove:'+vid+':'+pid, dsoObj.usb.onChange);
}
