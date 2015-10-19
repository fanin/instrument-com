'use strict';

var net     = require('net');
var fs      = require('fs');
var async   = require('async');
var uitl    = require('util');
var events  = require('events');
var path    = require('path');
var Promise = require('es6-promise').Promise;

var debug = require('debug');
var log = debug('index:log');
var info = debug('index:info');
var error = debug('index:error');
var usbDev = require('./inst-driver/dev/devUsb.js');
var dsoDev = require('./inst-driver/dso.js');
var supportDevice = require('./inst-driver/sys/sysConstant.js').supportDevice;

var validDevice=[];
var connectedDevice=[];

function updateValidDevice(){
  usbDev.listUsbDevice(function(devList){
      if(devList !== null){
          validDevice= devList.slice();

      }
      else{
        validDevice = validDevice.slice(0,validDevice.length-1);
      }
      log(validDevice);
  });
};

function usbAddEvent(device){


  log('add', device);
  updateValidDevice();

};

function usbRemoveEvent(device){
  var i,len,devDri;

  log('remove', device);
  updateValidDevice();
  log('connectedDevice');
  log(connectedDevice)
  for(i=0,len=connectedDevice.length; i<len; i++){
    if(device.serialNumber === connectedDevice[i].serialNumber){
      devDri =connectedDevice[i].devDri;
      devDri.closeDev().then(function(){
        connectedDevice.splice(i,1);
        log(connectedDevice);
      })
    }
  }
};
// function getDevDriver(id){
//       var i,len;
//       var devDri={};

//       for(i=0,len=connectedDevice.length; i<len; i++){
//         if(id === connectedDevice[i].id){
//           devDri =connectedDevice[i].devDri;
//           return devDri;
//         }
//       }
//       return null;
// }

updateValidDevice();
usbDev.regAddEvent(usbAddEvent);
usbDev.regRemoveEvent(usbRemoveEvent);


module.exports = {
  getUsbDevice : function() {
    var devInfo=[];
    var i,len=validDevice.length;

    for(i=0; i<len; i++){
        var info={};

        info.deviceName = validDevice[i].deviceName;
        info.manufacturer = validDevice[i].manufacturer;
        info.serialNumber = validDevice[i].serialNumber;
        info.vendorId = validDevice[i].vendorId;
        info.productId = validDevice[i].productId;

        devInfo.push(info);
    }
    return devInfo;
  },
  connectUsbDevice : function(device,callback){
    var i,len,type='',valid=false;

    log('connectUsbDevice');
    for(i=0,len=connectedDevice.length; i<len; i++){
      if(device.serialNumber === connectedDevice[i].devInfo.serialNumber){
        callback(['-200',' device already connected ']);
        return;
      }
    }
    for(i=0,len=validDevice.length; i<len; i++){
      if(device.serialNumber === validDevice[i].serialNumber){
        valid = true;
        break;
      }
    }
    if(valid === false){
        callback(['-501','device not exist']);
        return;
    }
    log('supported Device');
    log(supportDevice);
    for(i in supportDevice){
      log('search device')
      log(device.productId);
      if(parseInt(device.productId) === parseInt(supportDevice[i].pid)){
        var devDri={};
        var id;
        log(supportDevice[i].type);
        switch(supportDevice[i].type){
          case 'DSO':
              log('create usb instance');
              id=supportDevice[i].type+'_'+device.serialNumber
              devDri=dsoDev.DsoUSB(device);
              devDri.connect()
                .then(function(){
                  log('connect done');
                  connectedDevice.push({id:id,devInfo:device,devDri:devDri});
                  log(connectedDevice);
                  callback('',id);
                })
                .catch(function(e){
                  callback(e);
                });
            return;
          case 'AWG':
            callback('',id);
          return;
        }

      }
    }
    callback(['-501',' device not exist']);
  },
  getDevDriver : function(id){
        var i,len;
        var devDri={};

        for(i=0,len=connectedDevice.length; i<len; i++){
          if(id === connectedDevice[i].id){
            devDri =connectedDevice[i].devDri;
            return devDri;
          }
        }
        return null;
  }


}
/**
*   Show available USB device.
*
*   @method getUsbDevice
*   @return {Array} Array [ {name: , port: , addr: } , ...]
*
*/


// exports.getUsbDevice = function() {
//     var devInfo=[];
//     var i,len=validDevice.length;

//     for(i=0; i<len; i++){
//         var info={};

//         info.deviceName = validDevice[i].deviceName;
//         info.manufacturer = validDevice[i].manufacturer;
//         info.serialNumber = validDevice[i].serialNumber;
//         info.vendorId = validDevice[i].vendorId;
//         info.productId = validDevice[i].productId;

//         devInfo.push(info);
//     }
//     return devInfo;
// };

// function connectUsbDevice(device){
//    return new Promise(function(resolve, reject) {
//     console.log('connectUsbDevice');
//     // if(device)
//     //   resolve('id');
//     // else
//     //   reject('error');
//     resolve('id');
//   });
//  };
// exports.connectUsbDevice = connectUsbDevice;




// exports.connectUsbDevice = function(device) {
//   return new Promise(function(resolve, reject) {
//     var i,len,type='',valid=false;

//     log('connectUsbDevice');
//     for(i=0,len=connectedDevice.length; i<len; i++){
//       if(device.serialNumber === connectedDevice[i].devInfo.serialNumber){
//         reject(['-200',' device already connected ']);
//         return;
//       }
//     }
//     for(i=0,len=validDevice.length; i<len; i++){
//       if(device.serialNumber === validDevice[i].serialNumber){
//         valid = true;
//         break;
//       }
//     }
//     if(valid === false){
//         reject(['-501','device not exist']);
//         return;
//     }
//     log('supported Device');
//     log(supportDevice);
//     for(i in supportDevice){
//       log('search device')
//       log(device.productId);
//       if(parseInt(device.productId) === parseInt(supportDevice[i].pid)){
//         var devDri={};
//         var id;
//         log(supportDevice[i].type);
//         switch(supportDevice[i].type){
//           case 'DSO':
//               log('create usb instance');
//               id=supportDevice[i].type+device.serialNumber
//               devDri=dsoDev.DsoUSB(device);
//               devDri.connect()
//                 .then(function(){
//                   log('connect done');
//                   connectedDevice.push({id:id,devInfo:device,devDri:devDri});
//                   log(connectedDevice);
//                   resolve(id);
//                 })
//                 .catch(function(e){
//                   reject(e);
//                 });
//             return;
//           case 'AWG':
//             resolve();
//           return;
//         }

//       }
//     }
//     reject(['-501',' device not exist']);
//   });
// };
