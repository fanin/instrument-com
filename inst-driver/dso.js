'use strict';
/**
*   Module use to communicate with GWINSTEK's DSO through Ethernet or USB
*
*   @module instrument-com
*/
var net     = require('net');
var fs      = require('fs');
var async   = require('async');
var uitl    = require('util');
var EventEmitter  =  require('events').EventEmitter;
var path    = require('path');
var Promise = require('es6-promise').Promise;
// var mdns = require('mdns');

var debug = require('debug');
var log = debug('dso:log');
var info = debug('dso:info');
var error = debug('dso:error');
var sysConstant=require('./sys/sysConstant.js');
var syscmd = require('./dso/system.js');
var trigcmd = require('./dso/trigger.js');
var acqcmd = require('./dso/acquire.js');
var horcmd = require('./dso/horizontal.js');
var mathcmd = require('./dso/math.js');
var meascmd = require('./dso/measure.js');
var channel = require('./dso/channel.js');
var usbDev = require('./dev/devUsb.js');
var base = require('./dev/base.js');

// var cmdEvent = new EventEmitter();

//

var chanLoadCmd = [
        [   {id:'ch1',prop:'ChState',arg:'',cb:null,method:'get'},
            {id:'ch1',prop:'BWLimit',arg:'',cb:null,method:'get'},
            {id:'ch1',prop:'COUPling',arg:'',cb:null,method:'get'},
            {id:'ch1',prop:'VerSCALe',arg:'',cb:null,method:'get'},
            {id:'ch1',prop:'VerPOSition',arg:'',cb:null,method:'get'},
            {id:'ch1',prop:'VerEXPand',arg:'',cb:null,method:'get'},
            {id:'ch1',prop:'INVert',arg:'',cb:null,method:'get'},
            {id:'ch1',prop:'PROBe_RATio',arg:'',cb:null,method:'get'},
            {id:'ch1',prop:'PROBe_Type',arg:'',cb:null,method:'get'},
            {id:'ch1',prop:'DESKew',arg:'',cb:null,method:'get'}
        ],[
            {id:'ch2',prop:'ChState',arg:'',cb:null,method:'get'},
            {id:'ch2',prop:'BWLimit',arg:'',cb:null,method:'get'},
            {id:'ch2',prop:'COUPling',arg:'',cb:null,method:'get'},
            {id:'ch2',prop:'VerSCALe',arg:'',cb:null,method:'get'},
            {id:'ch2',prop:'VerPOSition',arg:'',cb:null,method:'get'},
            {id:'ch2',prop:'VerEXPand',arg:'',cb:null,method:'get'},
            {id:'ch2',prop:'INVert',arg:'',cb:null,method:'get'},
            {id:'ch2',prop:'PROBe_RATio',arg:'',cb:null,method:'get'},
            {id:'ch2',prop:'PROBe_Type',arg:'',cb:null,method:'get'},
            {id:'ch2',prop:'DESKew',arg:'',cb:null,method:'get'}
        ],[
            {id:'ch3',prop:'BWLimit',arg:'',cb:null,method:'get'},
            {id:'ch3',prop:'COUPling',arg:'',cb:null,method:'get'},
            {id:'ch3',prop:'VerSCALe',arg:'',cb:null,method:'get'},
            {id:'ch3',prop:'VerPOSition',arg:'',cb:null,method:'get'},
            {id:'ch3',prop:'VerEXPand',arg:'',cb:null,method:'get'},
            {id:'ch3',prop:'INVert',arg:'',cb:null,method:'get'},
            {id:'ch3',prop:'PROBe_RATio',arg:'',cb:null,method:'get'},
            {id:'ch3',prop:'PROBe_Type',arg:'',cb:null,method:'get'},
            {id:'ch3',prop:'DESKew',arg:'',cb:null,method:'get'}
        ],[
            {id:'ch4',prop:'ChState',arg:'',cb:null,method:'get'},
            {id:'ch4',prop:'BWLimit',arg:'',cb:null,method:'get'},
            {id:'ch4',prop:'COUPling',arg:'',cb:null,method:'get'},
            {id:'ch4',prop:'VerSCALe',arg:'',cb:null,method:'get'},
            {id:'ch4',prop:'VerPOSition',arg:'',cb:null,method:'get'},
            {id:'ch4',prop:'VerEXPand',arg:'',cb:null,method:'get'},
            {id:'ch4',prop:'INVert',arg:'',cb:null,method:'get'},
            {id:'ch4',prop:'PROBe_RATio',arg:'',cb:null,method:'get'},
            {id:'ch4',prop:'PROBe_Type',arg:'',cb:null,method:'get'},
            {id:'ch4',prop:'DESKew',arg:'',cb:null,method:'get'}
        ]
    ];
var trigLoadCmd = [
        {id:'trig',prop:'TrigType',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigSource',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigHighLevel',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigLowLevel',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigEdgeSlop',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigCouple',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigNoiseRej',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigMode',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigHoldoff',arg:'',cb:null,method:'get'},

        {id:'trig',prop:'TrigType',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigDelayType',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigDelayEvent',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigDelayType',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigDelaySlop',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigDelayLevel',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigDelayTime',arg:'',cb:null,method:'get'},

    // {id:'trig',prop:'TrigPulseWidthPolarity',arg:'NEGATIVE'},
    // {id:'trig',prop:'TrigPulseWidthWhen',arg:'EQUAL'},
    // {id:'trig',prop:'TrigPulseWidthTime',arg:'1E-1'},
    // {id:'trig',prop:'TrigRuntPolarity',arg:'EITHER'},
    // {id:'trig',prop:'TrigRuntWhen',arg:'UNEQUAL'},
    // {id:'trig',prop:'TrigRuntTime',arg:'1E-1'},
    // {id:'trig',prop:'TrigRiseFallSlop',arg:'EITHER'},
    // {id:'trig',prop:'TrigRiseFallWhen',arg:'LESSTHAN'},
    // {id:'trig',prop:'TrigRiseFallTime',arg:'1E-1'},
    // {id:'trig',prop:'TrigVideoType',arg:'NTSC'},
    // {id:'trig',prop:'TrigVideoField',arg:'FIELD2'},
    // {id:'trig',prop:'TrigVideoLine',arg:'262'},
    // {id:'trig',prop:'TrigVideoPolarity',arg:'NEGATIVE'},
    // {id:'trig',prop:'TrigALT',arg:'OFF'},
    // {id:'trig',prop:'TrigExtProbeType',arg:'CURRENT'},
    // {id:'trig',prop:'TrigExtProbeRatio',arg:'1E+0'},
        {id:'trig',prop:'TrigType',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigTimeoutTime',arg:'',cb:null,method:'get'},
        {id:'trig',prop:'TrigTimeoutWhen',arg:'',cb:null,method:'get'}
    ];
var acqLoadCmd = [
        {id:'acq',prop:'AcqRecLength',arg:'',cb:null,method:'get'},
        {id:'acq',prop:'AcqMode',arg:'',cb:null,method:'get'},
        {id:'acq',prop:'AcqAverage',arg:'',cb:null,method:'get'}
    ];
var horLoadCmd = [
        {id:'hor',prop:'HorMode',arg:'',cb:null,method:'get'},
        {id:'hor',prop:'HorScale',arg:'',cb:null,method:'get'},
        {id:'hor',prop:'HorPosition',arg:'',cb:null,method:'get'},
        {id:'hor',prop:'HorExpand',arg:'',cb:null,method:'get'},
        {id:'hor',prop:'HorMode',arg:'',cb:null,method:'get'},
        {id:'hor',prop:'HorZoomScale',arg:'',cb:null,method:'get'},
        {id:'hor',prop:'HorZoomPosition',arg:'',cb:null,method:'get'}
    ];
var mathLoadCmd = [
        {id:'math',prop:'MathDisp',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathType',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathDualSour1',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathDualSour2',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathDualOper',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathDualScale',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathDualPos',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathType',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathFftWin',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathFftSource',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathFftMag',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathFftVerPos',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathFftVerScale',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathFftHorPos',arg:'',cb:null,method:'get'},
        {id:'math',prop:'MathFftHorScale',arg:'',cb:null,method:'get'}

        // {id:'meas1',prop:'MeasureState',arg:'ON'},
        // {id:'meas1',prop:'StatisticMode',arg:'ON'},
        // //{id:'meas1',prop:'StatisticReset',arg:''},
        // {id:'meas1',prop:'MeasureSource1',arg:'CH1'},
        // {id:'meas1',prop:'MeasureSource2',arg:'CH2'},
        // {id:'meas1',prop:'MeasureType',arg:'PK2pk'},
    ];
var trigTestCmd = [
        {prop:'TrigType',arg:'EDGE'},
        {prop:'TrigSource',arg:'CH2'},
        {prop:'TrigHighLevel',arg:'1E-1'},
        {prop:'TrigLowLevel',arg:'2E-1'},
        {prop:'TrigEdgeSlop',arg:'RISE'},
        {prop:'TrigCouple',arg:'AC'},
        {prop:'TrigNoiseRej',arg:'ON'},
        {prop:'TrigMode',arg:'NORMAL'},
        {prop:'TrigHoldoff',arg:'1E-1'},

        {prop:'TrigType',arg:'DELAY'},
        {prop:'TrigDelayType',arg:'EVENT'},
        {prop:'TrigDelayEvent',arg:'1100'},
        {prop:'TrigDelayType',arg:'TIME'},
        {prop:'TrigDelaySlop',arg:'FALL'},
        {prop:'TrigDelayLevel',arg:'1E-1'},
        {prop:'TrigDelayTime',arg:'1E-1'},

        // {prop:'TrigPulseWidthPolarity',arg:'NEGATIVE'},
        // {prop:'TrigPulseWidthWhen',arg:'EQUAL'},
        // {prop:'TrigPulseWidthTime',arg:'1E-1'},
        // {prop:'TrigRuntPolarity',arg:'EITHER'},
        // {prop:'TrigRuntWhen',arg:'UNEQUAL'},
        // {prop:'TrigRuntTime',arg:'1E-1'},
        // {prop:'TrigRiseFallSlop',arg:'EITHER'},
        // {prop:'TrigRiseFallWhen',arg:'LESSTHAN'},
        // {prop:'TrigRiseFallTime',arg:'1E-1'},
        // {prop:'TrigVideoType',arg:'NTSC'},
        // {prop:'TrigVideoField',arg:'FIELD2'},
        // {prop:'TrigVideoLine',arg:'262'},
        // {prop:'TrigVideoPolarity',arg:'NEGATIVE'},
        // {prop:'TrigALT',arg:'OFF'},
        // {prop:'TrigExtProbeType',arg:'CURRENT'},
        // {prop:'TrigExtProbeRatio',arg:'1E+0'},
        {prop:'TrigType',arg:'TIMEOUT'},
        {prop:'TrigTimeoutTime',arg:'1E+0'},
        {prop:'TrigTimeoutWhen',arg:'EITHER'}
    ];
var chTestCmd = [
        {prop:'ChState',arg:'ON'},
        {prop:'BWLimit',arg:'2E+7'},
        {prop:'COUPling',arg:'AC'},
        {prop:'VerSCALe',arg:'2E-1'},
        {prop:'VerPOSition',arg:'2E-1'},
        {prop:'VerEXPand',arg:'CENTER'},
        {prop:'INVert',arg:'ON'},
        {prop:'PROBe_RATio',arg:'1E+1'},
        {prop:'PROBe_Type',arg:'VOLTAGE'},
        {prop:'DESKew',arg:'0'}
    ];
var acqTestCmd = [
        {prop:'AcqRecLength',arg:'1E+5'},
        {prop:'AcqMode',arg:'AVERAGE'},
        {prop:'AcqAverage',arg:'16'}
    ];
var horTestCmd = [
        {prop:'HorMode',arg:'MAIN'},
        {prop:'HorScale',arg:'5E-5'},
        {prop:'HorPosition',arg:'5E-5'},
        {prop:'HorExpand',arg:'TRIGGER'},
        {prop:'HorMode',arg:'WINDOW'},
        {prop:'HorZoomScale',arg:'2E-5'},
        {prop:'HorZoomPosition',arg:'2E-5'}
    ];
var mathTestCmd = [
        {prop:'MathDisp',arg:'ON'},
        {prop:'MathType',arg:'DUAL'},
        {prop:'MathDualSour1',arg:'CH2'},
        {prop:'MathDualSour2',arg:'CH1'},
        {prop:'MathDualOper',arg:'DIV'},
        {prop:'MathDualScale',arg:'1'},
        {prop:'MathDualPos',arg:'1'},
        {prop:'MathType',arg:'FFT'},
        {prop:'MathFftWin',arg:'HAMMING'},
        {prop:'MathFftSource',arg:'CH2'},
        {prop:'MathFftMag',arg:'DB'},
        {prop:'MathFftVerPos',arg:'1'},
        {prop:'MathFftVerScale',arg:'1'},
        {prop:'MathFftHorPos',arg:'1'},
        {prop:'MathFftHorScale',arg:'1'}
    ];
var measSetTestCmd = [
        {prop:'MeasureState',arg:'ON'},
        {prop:'StatisticMode',arg:'ON'},
        {prop:'StatisticReset',arg:''},
        {prop:'MeasureSource1',arg:'CH1'},
        {prop:'MeasureSource2',arg:'CH2'},
        {prop:'MeasureType',arg:'PK2pk'}

    ];
var measGetTestCmd = [
        {prop:'MeasureValue',arg:'ON'},
        {prop:'MeasureStd',arg:''},
        {prop:'MeasureMin',arg:'CH2'},
        {prop:'MeasureMean',arg:'CH1'},
        {prop:'MeasureType',arg:'PK2pk'},
        {prop:'MeasureMax',arg:'ON'}

    ];
var dispTestCmd = [
        {prop:'DispOut',arg:''}
    ];
var sysTestCmd = [
        {prop:'SysErr',arg:''}
    ];





function done(){
    log('------------------------- done');
}

// function sendIDN(){
// }



function getCmdObj() {
    var FilePath = path.join(__dirname, '/sys/dso-command.json');

    return JSON.parse(fs.readFileSync(FilePath));
}
function BindNetObj(dsoObj, port, host_addr) {

    // dsoObj.port=port;
    // dsoObj.host_addr=host_addr;
    dsoObj.dev.interf = 'net';
    dsoObj.dev.net = {
        dataHandler : function(data) {
            // log('socket on data event!');

            // socket idle when send query command
            if (dsoObj.dev.state.setTimeout) {
                if (dsoObj.dev.state.conn !== 'timeout') {
                    log('clearTimeout');
                    clearTimeout(dsoObj.dev.state.timeoutObj);
                }
                dsoObj.dev.state.setTimeout = false;
            }

            if ((dsoObj.dev.state.conn === 'query') || (dsoObj.dev.state.conn === 'timeout')) {
                if (dsoObj.cmdHandler(dsoObj.handlerSelf, data, dsoObj.syncCallback) === true) {
                    if (dsoObj.syncCallback) {
                        log('call callback');
                        dsoObj.syncCallback();
                    }
                }
            }
        },
        port : port,
        host_addr : host_addr,
        socket : {}
    };
}


/**
*   Create all needed private properties and method
*
*   @private
*   @constructor _DsoObj
*
*   @return {Object} Private method used to control DSO
*/
var _DsoObj = function() {


    this.dev = new base.Dev();
    // uitl.inherits(this.dev, base.Dev);
    console.log(this);
    //assign dso system command process method to dsoObj.sys
    this.sys = syscmd.initSysObj.call(this, 'sys');

    this.trig = trigcmd.initTrigObj.call(this, 'trig');

    this.acq = acqcmd.initAcqObj.call(this, 'acq');

    this.hor = horcmd.initHorObj.call(this, 'hor');

    this.math = mathcmd.initMathObj.call(this, 'math');
    this.meas1 = meascmd.initMeasObj.call(this, 'meas1');
    this.meas2 = meascmd.initMeasObj.call(this, 'meas2');
    this.meas3 = meascmd.initMeasObj.call(this, 'meas3');
    this.meas4 = meascmd.initMeasObj.call(this, 'meas4');
    this.meas5 = meascmd.initMeasObj.call(this, 'meas5');
    this.meas6 = meascmd.initMeasObj.call(this, 'meas6');
    this.meas7 = meascmd.initMeasObj.call(this, 'meas7');
    this.meas8 = meascmd.initMeasObj.call(this, 'meas8');

    this.ch1 = channel.initChanObj.call(this, 'ch1');
    this.ch2 = channel.initChanObj.call(this, 'ch2');
    this.ch3 = channel.initChanObj.call(this, 'ch3');
    this.ch4 = channel.initChanObj.call(this, 'ch4');
    // for (var i = 0; i<supportType.length; i++){
    //     log(dsoObj.commandObj[SupportedModel[i]].model[0]);
    // }
    // uitl.inherits(dsoObj, events.EventEmitter);
    // dsoObj.on('cmd_write', dsoObj.cmd_write);
    this.cmdEvent = new EventEmitter();
    this.commandObj = getCmdObj();
    this.dev.commandObj = this.commandObj;
    return this;
};

function findMatchDevice(sample,golden,prop){
    var i,len=golden.length;

    for(i=0; i<len; i++){
        var device=golden[i];
        if(device[prop]){
            if(sample[prop]===device[prop]){
                return i;
            }
        }
    }
    return -1;
}

// var browser = mdns.createBrowser(mdns.tcp('instrument-dso'));
var availableNetDevice= [];

// browser.on('serviceUp', function(service) {
//   console.log("service up: ", service);
//   if(availableNetDevice.length > 0){
//     var idx;

//     idx=findMatchDevice(service,availableNetDevice,"name");
//     if(idx >= 0){
//         availableNetDevice.push(service);
//     }
//   }
//   else{
//     availableNetDevice.push(service);
//   }
//   console.log("-------------");

//   console.log(availableNetDevice);
// });
// browser.on('serviceDown', function(service) {
//   console.log("service down: ", service);

//   if(availableNetDevice.length > 0){
//     var idx;

//     idx=findMatchDevice(service,availableNetDevice,"name");
//     if(idx >= 0){
//         availableNetDevice.splice(idx,1);
//     }
//   }
//   else{
//     availableNetDevice.pop();
//   }

// });

// browser.start();

/**
*   The class define all needed public properties and methods
*
*   @class dsoctrl
*
*
*/
var _DsoCtrl = function(dsoObj) {
    var dsoctrl = {};

/**
*   The method belong to dsoctrl class used to release device's resource.
*
*   @method closeDev
*   @return {null} null
*
*/
    dsoctrl.closeDev = (function() {
        log('closeDev');
        var self = this;

        return new Promise(function(resolve, reject) {
            dsoctrl.disconnect().then(resolve);
        });
    }).bind(dsoObj);


// var all_the_types = mdns.browseThemAll();




/**
*   The method belong to dsoctrl class used to connect to device,
*   connect method must be called and wait to complete before any dsoctrl method.
*
*   @method connect
*
*
*/
    dsoctrl.connect = (function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            function conn(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };

            if (self.dev.interf === 'usb') {
                self.dev.usbConnect(conn);
            }else if (self.dev.interf === 'net') {
                self.dev.tcpConnect(conn);
            }
            else{
                reject(Error('Not supported interface'));
            }
        });
    }).bind(dsoObj);
/**
*   The method belong to dsoctrl class used to disconnect from device.
*
*   @method disconnect
*
*
*/
    dsoctrl.disconnect = (function() {
        log('disconnect');
        var self = this;

        return new Promise(function(resolve, reject) {

            if(self.dev.state.conn!=='disconnected'){
                if(self.dev.writeTimeoutObj!==null){
                    clearTimeout(self.dev.writeTimeoutObj);
                }
                if (self.dev.interf === 'usb') {
                    self.usbDisconnect(resolve);
                }else if (self.dev.interf === 'net') {
                    self.tcpDisconnect(resolve);
                }
            }else{
                resolve();
            }
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to sync all properties from device,
*   like trigger type, channel state .. etc.
*
*   @method syncConfig
*
*
*/
    dsoctrl.syncConfig = (function() {
        var cmd = [];
        var self = this;

        return new Promise(function(resolve, reject) {
            function reload(e){
                if (e) {
                    reject(e);

                }else {

                    resolve(self.sys.lrn);
                }

            };
            var cmd = [
                    {id:'sys', prop:'LRN', arg:'', cb:reload, method:'get'}
                ];
            self.dev.cmdSequence = self.dev.cmdSequence.concat(cmd);
            self.cmdEvent.emit('cmd_write', cmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to load horizontal properties from device,
*   like time division, position .. etc.
*
*   @method getHorizontal
*   @return {Object} horProperty
*
*/
/**
*   Horizontal property of device.
*
*   @property horProperty
*   @type Object
*   @param {String} position Specify the distance with triggered pointer of the main window
*   @param {String} zposition Specify the distance with triggered pointer of the zoom window
*   @param {String} scale Specify the time divison of the main window
*   @param {String} zscale Specify the time divison of the zoom window
*   @param {String} mode Specify which mode device on
*   @param {String} expand Specify timebase expand by center or trigger position
*/
    dsoctrl.getHorizontal = (function() {
        // this.GetSnapshot(callback);
        var self = this;

        return new Promise(function(resolve, reject) {
            function rawData(e){
                if (e) {
                    reject(e);

                }else {
                    resolve(self.hor);
                }

            };
            var cmd = [
                    {id:'hor',prop:'HorPosition',arg:'',cb:null,method:'get'},
                    {id:'hor',prop:'HorScale',arg:'',cb:null,method:'get'},
                    {id:'hor',prop:'HorMode',arg:'',cb:null,method:'get'},
                    {id:'hor',prop:'HorExpand',arg:'',cb:null,method:'get'},
                    {id:'hor',prop:'HorZoomPosition',arg:'',cb:null,method:'get'},
                    {id:'hor',prop:'HorZoomScale',arg:'',cb:rawData,method:'get'}
                ];
            self.dev.cmdSequence = self.dev.cmdSequence.concat(cmd);
            // log(self.dev.cmdSequence);
            self.cmdEvent.emit('cmd_write', cmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to set horizontal properties to device,
*   like time division, position .. etc.
*
*   @method setHorizontal
*   @param {Object} horProperty
*
*/
/**
*   Horizontal property of device.
*
*   @property horProperty
*   @type Object
*   @param {String} position Specify the distance with triggered pointer of the main window
*   @param {String} zposition Specify the distance with triggered pointer of the zoom window
*   @param {String} scale Specify the time divison of the main window
*   @param {String} zscale Specify the time divison of the zoom window
*   @param {String} mode Specify which mode device on
*   @param {String} expand Specify timebase expand by center or trigger position
*/
    dsoctrl.setHorizontal = (function(hor) {
        // this.GetSnapshot(callback);
        var self = this;

        return new Promise(function(resolve, reject) {
            var cmd=[];
            function rawData(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };
            if(hor === undefined){
                log('setHorizontal do nothing');
                reject(['-100','Parameter Error']);
            }
            if(hor.scale!==undefined){
                cmd.push({id:'hor',prop:'HorScale',arg:hor.scale,cb:null,method:'set'});
            }
            if(hor.zscale!==undefined){
                cmd.push({id:'hor',prop:'HorZoomScale',arg:hor.zscale,cb:null,method:'set'});
            }
            if(hor.position!==undefined){
                cmd.push({id:'hor',prop:'HorPosition',arg:hor.position,cb:null,method:'set'});

            }
            if(hor.zposition!==undefined){
                cmd.push({id:'hor',prop:'HorZoomPosition',arg:hor.zposition,cb:null,method:'set'});
            }
            if(hor.mode!==undefined){
                cmd.push({id:'hor',prop:'HorMode',arg:hor.mode,cb:null,method:'set'});
            }
            if(hor.expand!==undefined){
                cmd.push({id:'hor',prop:'HorExpand',arg:hor.expand,cb:null,method:'set'});
            }
            if(cmd.length > 0){
                cmd[cmd.length-1].cb = rawData;
                self.dev.cmdSequence = self.dev.cmdSequence.concat(cmd);
                // log(self.dev.cmdSequence);
                self.cmdEvent.emit('cmd_write', cmd);
            }
            else{
                log('setHorizontal do nothing');
                resolve();
            }
        });
    }).bind(dsoObj);


/**
*   The method belong to dsoctrl class used to load vertical properties from device,
*   like scale, position .. etc.
*
*   @method getVertical
*   @param {String} ch Specify which channel wants to be loaded
*   @return {Object} chProperty
*
*/
/**
*   Channel property
*
*   @property chProperty
*   @type Object
*   @param {String} coupling Specify coupling on AC,DC or GND
*   @param {String} impedance Specify the impedance of the analog channel
*   @param {String} invert
*   @param {String} bandwidth
*   @param {String} expand
*   @param {String} state
*   @param {String} scale
*   @param {String} position
*   @param {String} deskew
*   @param {String} rawdata
*   @param {String} probe.unit
*   @param {String} probe.atten
*/
    dsoctrl.getVertical = (function(ch) {
        // this.GetSnapshot(callback);
        var self = this;
        var chNum = sysConstant.chID[ch];
        var chCmd;



        return new Promise(function(resolve, reject) {
            function vetical(e){
                if (e) {
                    reject(e);

                }else {
                    chCmd[chCmd.length-1].cb = null;
                    resolve(self[ch]);
                }

            };
            log('chNum ='+chNum);
            log('maxChNum ='+self.maxChNum);
            if(chNum === undefined){
                reject(['-100','Parameter Error']);
            }

            if(chNum < self.maxChNum) {
                chCmd = chanLoadCmd[chNum].slice(0);
                chCmd[chCmd.length-1].cb = vetical;
                self.dev.cmdSequence = self.dev.cmdSequence.concat(chCmd);
                // self.dev.cmdSequence[self.dev.cmdSequence.length-1].cb = vetical;
                // log(chanLoadCmd[chNum]);
                // log('----------------------------');
                self.cmdEvent.emit('cmd_write', self.dev.cmdSequence);
            }
        });
    }).bind(dsoObj);
/**
*   The method belong to dsoctrl class used to setup vertical properties to device,
*   like scale, position .. etc.
*
*   @method setVertical
*   @param {Object} chProperty Specify all channel parameter
*
*/
/**
*   Channel property
*
*   @property chProperty
*   @type Object
*   @param {String} coupling Specify coupling on AC,DC or GND
*   @param {String} impedance Specify the impedance of the analog channel
*   @param {String} invert
*   @param {String} bandwidth
*   @param {String} expand
*   @param {String} scale
*   @param {String} state
*   @param {String} position
*   @param {String} deskew
*   @param {String} rawdata
*   @param {String} probe.unit
*   @param {String} probe.atten
*/
    dsoctrl.setVertical = (function(chProp) {
        // this.GetSnapshot(callback);
        var self = this;
        var chNum = sysConstant.chID[chProp.ch];
        var cmd=[];


        return new Promise(function(resolve, reject) {
            function vertical(e){
                if (e) {
                    reject(e);

                }else {
                    resolve(self[chProp.ch]);
                }

            };
            log('chNum ='+chNum);
            log('maxChNum ='+self.maxChNum);

            if(chNum === undefined){
                reject(['-100','Parameter Error']);
                return;
            }
            if(chProp.coupling!==undefined){
                cmd.push({id:chProp.ch,prop:'COUPling',arg:chProp.coupling,cb:null,method:'set'});
            }
            if(chProp.impedance!==undefined){
                cmd.push({id:chProp.ch,prop:'IMPedance',arg:chProp.impedance,cb:null,method:'set'});
            }
            if(chProp.invert!==undefined){
                cmd.push({id:chProp.ch,prop:'INVert',arg:chProp.invert,cb:null,method:'set'});
            }
            if(chProp.bandwidth!==undefined){
                cmd.push({id:chProp.ch,prop:'BWLimit',arg:chProp.bandwidth,cb:null,method:'set'});
            }
            if(chProp.expand!==undefined){
                cmd.push({id:chProp.ch,prop:'VerEXPand',arg:chProp.expand,cb:null,method:'set'});
            }
            if(chProp.scale!==undefined){
                cmd.push({id:chProp.ch,prop:'VerSCALe',arg:chProp.scale,cb:null,method:'set'});
            }
            if(chProp.position!==undefined){
                cmd.push({id:chProp.ch,prop:'VerPOSition',arg:chProp.position,cb:null,method:'set'});
            }
            if(chProp.probe!==undefined){
                if(chProp.probe.unit!==undefined){
                    cmd.push({id:chProp.ch,prop:'PROBe_Type',arg:chProp.probe.unit,cb:null,method:'set'});
                }
                if(chProp.probe.atten!==undefined){
                    cmd.push({id:chProp.ch,prop:'PROBe_RATio',arg:chProp.probe.atten,cb:null,method:'set'});
                }
            }

            if(chProp.deskew!==undefined){
                cmd.push({id:chProp.ch,prop:'DESKew',arg:chProp.probe.deskew,cb:null,method:'set'});
            }
            if(cmd.length > 0){
                cmd[cmd.length-1].cb = vertical;
                self.dev.cmdSequence = self.dev.cmdSequence.concat(cmd);
                // log(self.dev.cmdSequence);
                self.cmdEvent.emit('cmd_write', cmd);
            }
            else{
                log('setVertical do nothing');
                resolve();
            }
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to turn selected channel on
*
*   @method getVertical
*   @param {String} ch Specify which channel wants to turn on
*
*
*/
    dsoctrl.enableCh = (function(ch) {
        // this.GetSnapshot(callback);
        var self = this;

        return new Promise(function(resolve, reject) {
            function chstate(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };

            var chid = ch.toLowerCase();
            if( (chid === 'ch1') || (chid === 'ch2') || (chid === 'ch3') || (chid === 'ch4')){
                var cmd = [
                        {id:chid, prop:'ChState', arg:'ON', cb:chstate, method:'set'}
                    ];
                self.dev.cmdSequence = self.dev.cmdSequence.concat(cmd);
                self.cmdEvent.emit('cmd_write', cmd);
            }
            else{
                reject(Error("parameter error"));
                return;
            }

        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to turn selected channel off
*
*   @method getVertical
*   @param {String} ch Specify which channel wants to turn off
*
*
*/
    dsoctrl.disableCh = (function(ch) {
        // this.GetSnapshot(callback);
        var self = this;

        return new Promise(function(resolve, reject) {
            function chstate(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };
            console.log('disableCh cmd');
            console.log(ch);
            var chid = ch.toLowerCase();
            console.log('disableCh cmd toLowerCase');
            console.log(chid);
            if( (chid === 'ch1') || (chid === 'ch2') || (chid === 'ch3') || (chid === 'ch4')){
                var cmd = [
                        {id:chid, prop:'ChState', arg:'OFF', cb:chstate, method:'set'}
                    ];
                self.dev.cmdSequence = self.dev.cmdSequence.concat(cmd);
                self.cmdEvent.emit('cmd_write', cmd);
            }
            else{
                reject(Error("parameter error"));
                return;
            }

        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to get the current screen from device,
*
*   @method getSnapshot
*   @return {Buffer} dsiplay data buffer
*
*/
    dsoctrl.getSnapshot = (function() {
        // this.GetSnapshot(callback);
        var self = this;


        return new Promise(function(resolve, reject) {
            function snapshot(e){
                if (e) {
                    reject(e);

                }else {
                    resolve(self.sys.dispData);
                }

            };
            var cmd = [
                    {id:'sys',prop:'DispOut',arg:'OFF',cb:snapshot,method:'get'}
                ];
            self.dev.cmdSequence = self.dev.cmdSequence.concat(cmd);
            self.cmdEvent.emit('cmd_write', cmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to get the data in acquisition memory for
*   the selected channel form device
*
*   @method getRawdata
*   @param {String} ch Specify which channel wants to be loaded
*   @return {Buffer} rawdata buffer
*
*/
    dsoctrl.getRawdata = (function(ch) {
        // this.GetRawdata(ch,callback);
        var self = this;

        return new Promise(function(resolve, reject) {
            function rawData(e){
                if (e) {
                    reject(e);

                }else {
                    resolve(self[ch].rawdata);
                }

            };
            if(sysConstant.chID[ch] !== undefined){
                var cmd=[
                        {id:'acq',prop:'AcqHeader',arg:'OFF',cb:null,method:'set'},
                        {id:ch,prop:'AcqMemory',arg:'',cb:rawData,method:'get'}
                    ];
                self.dev.cmdSequence = self.dev.cmdSequence.concat(cmd);
                self.cmdEvent.emit('cmd_write', cmd);

            }else {
                reject(Error("error null parameter"));
            }
        });
    }).bind(dsoObj);




    ////////////////////////////
    dsoctrl.onError = (function(callback) {
        this.errHandler = callback;
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to get the edge trigger properties from device
*
*   @method getEdgeTrig
*   @return {object} trigProperty
*
*/
/**
*   Trigger property of device.
*
*   @property trigProperty
*   @type Object
*   @param {String} type
*   @param {String} source
*   @param {String} mode
*   @param {String} holdoff
*   @param {String} noise_rej
*   @param {String} level
*   @param {String} alt
*   @param {String} state
*   @param {String} edge.coupling
*   @param {String} edge.slop
*/
    dsoctrl.getEdgeTrig = (function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            function edgeTrig(e){
                if (e) {
                    reject(e);

                }else {
                    resolve(self.trig);
                }

            };
            var trigCmd = [
                    {id:'trig',prop:'TrigType',arg:'',cb:null,method:'get'},
                    {id:'trig',prop:'TrigSource',arg:'',cb:null,method:'get'},
                    {id:'trig',prop:'TrigHighLevel',arg:'',cb:null,method:'get'},
                    {id:'trig',prop:'TrigEdgeSlop',arg:'',cb:null,method:'get'},
                    {id:'trig',prop:'TrigCouple',arg:'',cb:null,method:'get'},
                    {id:'trig',prop:'TrigNoiseRej',arg:'',cb:null,method:'get'},
                    {id:'trig',prop:'TrigMode',arg:'',cb:null,method:'get'},
                    {id:'trig',prop:'TrigALT',arg:'',cb:null,method:'get'},
                    {id:'trig',prop:'TrigHoldoff',arg:'',cb:edgeTrig,method:'get'}
                ];
            // this.GetRawdata(ch,callback);

            self.dev.cmdSequence = self.dev.cmdSequence.concat(trigCmd);
            self.cmdEvent.emit('cmd_write', trigCmd);
        });
    }).bind(dsoObj);



/**
*   The method belong to dsoctrl class used to set edge trigger properties to device
*
*   @method setEdgeTrig
*   @param {object} trigProperty
*
*/
/**
*   Trigger property of device.
*
*   @property trigProperty
*   @type Object
*   @param {String} type
*   @param {String} source
*   @param {String} mode
*   @param {String} holdoff
*   @param {String} noise_rej
*   @param {String} level
*   @param {String} alt
*   @param {String} edge.coupling
*   @param {String} edge.slop
*/
    dsoctrl.setEdgeTrig = (function(trigProp) {
        var self = this;
        var cmd = [];

        return new Promise(function(resolve, reject) {
            function edgeTrig(e){
                if (e) {
                    reject(e);

                }else {
                    resolve(self.trig);
                }

            };

            if(trigProp === undefined){
                reject(['-100','Parameter Error']);
                return;
            }
            cmd.push({id:'trig',prop:'TrigType',arg:'EDGE',cb:null,method:'set'});
            if(trigProp.source!==undefined){
                cmd.push({id:'trig',prop:'TrigSource',arg:trigProp.source,cb:null,method:'set'});
            }
            if(trigProp.mode!==undefined){
                cmd.push({id:'trig',prop:'TrigMode',arg:trigProp.mode,cb:null,method:'set'});
            }
            if(trigProp.edge!==undefined){
                if(trigProp.edge.coupling!==undefined){
                    cmd.push({id:'trig',prop:'TrigCouple',arg:trigProp.edge.coupling,cb:null,method:'set'});
                }
                if(trigProp.edge.slop!==undefined){
                    cmd.push({id:'trig',prop:'TrigEdgeSlop',arg:trigProp.edge.slop,cb:null,method:'set'});
                }
            }
            if(trigProp.holdoff!==undefined){
                cmd.push({id:'trig',prop:'TrigHoldoff',arg:trigProp.holdoff,cb:null,method:'set'});
            }
            if(trigProp.noise_rej!==undefined){
                cmd.push({id:'trig',prop:'TrigNoiseRej',arg:trigProp.noise_rej,cb:null,method:'set'});
            }
            // if(trigProp.reject!==undefined){
            //     cmd.push({id:'trig',prop:'TrigReject',arg:trigProp.reject,cb:null,method:'set'});
            // }
            if(trigProp.level!==undefined){
                cmd.push({id:'trig',prop:'TrigHighLevel',arg:trigProp.level,cb:null,method:'set'});
            }
            if(trigProp.alt!==undefined){
                cmd.push({id:'trig',prop:'TrigALT',arg:trigProp.alt,cb:null,method:'set'});
            }

            if(cmd.length > 0){
                cmd[cmd.length-1].cb = edgeTrig;
                self.dev.cmdSequence = self.dev.cmdSequence.concat(cmd);
                // log(self.dev.cmdSequence);
                self.cmdEvent.emit('cmd_write', cmd);
            }
            else{
                log('setVertical do nothing');
                resolve();
            }
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to get the measurment properties
*   for the selected measure channel from device
*
*   @method getMeas
*   @param {String} mCh Specify which measure channel wants to be loaded
*   @return {object} measProperty
*
*/
/**
*   Measurement property of device.
*
*   @property measProperty
*   @type Object
*   @param {String} stdValue
*   @param {String} minValue
*   @param {String} meanValue
*   @param {String} value
*   @param {String} state
*   @param {String} source1
*   @param {String} source2
*   @param {String} type
*   @param {String} state
*/

    dsoctrl.getMeas = (function(mCh) {
        var self = this;

        return new Promise(function(resolve, reject) {
            function measCmd(e){
                if (e) {
                    reject(e);

                }else {
                    resolve(self[mCh]);
                }

            };
            var measVal = [
                    {id:mCh, prop:'MeasureState', arg:'', cb:null, method:'get'},
                    // {id:'sys',prop:'StatisticMode',arg:'',cb:null,method:'get'},
                    {id:mCh, prop:'MeasureValue', arg:'', cb:null, method:'get'},
                    {id:mCh, prop:'MeasureSource1', arg:'', cb:null, method:'get'},
                    {id:mCh, prop:'MeasureSource2', arg:'', cb:null, method:'get'},
                    {id:mCh, prop:'MeasureType', arg:'', cb:measCmd, method:'get'}
            ];
            var measStd = [
                    {id:mCh, prop:'MeasureStd', arg:'', cb:null, method:'get'},
                    {id:mCh, prop:'MeasureMin', arg:'', cb:null, method:'get'},
                    {id:mCh, prop:'MeasureMean', arg:'', cb:null, method:'get'},
                    {id:mCh, prop:'MeasureMax', arg:'', cb:null, method:'get'}
            ];

            if(self.sys.staMode === 'ON'){
                self.dev.cmdSequence = self.dev.cmdSequence.concat(measStd);
            }
            self.dev.cmdSequence = self.dev.cmdSequence.concat(measVal);
            self.cmdEvent.emit('cmd_write', measCmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to get the measurment type
*   of device supported
*
*   @method supportedMeasType
*   @return {Array} supported measure type
*
*/
    dsoctrl.supportedMeasType = (function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            log(self.commandObj[self.gdsType].MeasureType.parameter);
            resolve(self.commandObj[self.gdsType].MeasureType.parameter);
        });

    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to setup a periodical measure channel with specify measure type
*   and source channel
*
*   @method setMeas
*   @param {Object} measConf Config to setup a measure channel
*
*
*/

/**
*
*   Object used to setup a measure channel
*
*   @property measConf
*   @type Object
*   @param {String} src1 Specify first source channel for measurement
*   @param {String} src2 Specify second source channel for delay measure type
*   @param {String} type Specify measure type
*/
    dsoctrl.setMeas = (function(conf) {
        var self = this;

        return new Promise(function(resolve, reject) {
            function measCmd(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };
            var measSet = [
                    {id:conf.ch,prop:'MeasureState',arg:'ON',cb:null,method:'set'},
                    {id:conf.ch,prop:'MeasureSource1',arg:conf.src1.toUpperCase(),cb:null,method:'set'}
                ],
                measSrc2 = [
                    {id:conf.ch,prop:'MeasureSource2',arg:conf.src2.toUpperCase(),cb:null,method:'set'}
                ],
                measType = [
                    {id:conf.ch,prop:'MeasureType',arg:conf.type,cb:measCmd,method:'set'}
                ];
            if (conf.type === undefined) {
                meascmd('error');
                return;
            }

            if (conf.src2 !== undefined) {
                self.dev.cmdSequence=self.dev.cmdSequence.concat(measSrc2);
            }

            self.dev.cmdSequence = self.dev.cmdSequence.concat(measSet);
            self.dev.cmdSequence = self.dev.cmdSequence.concat(measType);
            self.cmdEvent.emit('cmd_write', measSet);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to turn on statistics for all measure channels
*
*   @method statisticOn
*
*
*/
    dsoctrl.statisticOn = (function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            function measCmd(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };
            var measCmd = [
                {id:'sys',prop:'StatisticMode',arg:'ON',cb:measCmd,method:'set'}
            ];

            self.dev.cmdSequence = self.dev.cmdSequence.concat(measCmd);
            self.cmdEvent.emit('cmd_write', measCmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to turn off statistics for all measure channels
*
*   @method statisticOff
*
*
*/
    dsoctrl.statisticOff = (function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            function statistic(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'StatisticMode',arg:'OFF',cb:statistic,method:'set'}
            ];

            self.dev.cmdSequence = self.dev.cmdSequence.concat(sysCmd);
            self.cmdEvent.emit('cmd_write', sysCmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to set the statistic weight all measure channels
*
*   @method statisticWeight
*   @param {Number} weight Specify statistic weight
*
*
*/
    dsoctrl.statisticWeight = (function(weight) {
        var self = this;
        return new Promise(function(resolve, reject) {
            function statistic(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'StatisticStaWeight',arg:weight,cb:statistic,method:'set'}
            ];

            self.dev.cmdSequence = self.dev.cmdSequence.concat(sysCmd);
            self.cmdEvent.emit('cmd_write', sysCmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to set the device into run state
*
*   @method run
*
*
*/
    dsoctrl.run = (function(){
        var self = this;
        log('run');
        return new Promise(function(resolve, reject) {
            function sysRun(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };
            log('run promise');
            var sysCmd = [
                {id:'sys',prop:'RUN',arg:'',cb:sysRun,method:'set'}
            ];

            self.dev.cmdSequence = self.dev.cmdSequence.concat(sysCmd);
            log('run :send cmd_write');
            self.cmdEvent.emit('cmd_write', sysCmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to set the device into stop state
*
*   @method stop
*
*/
    dsoctrl.stop = (function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            function sysStop(e){
                if (e) {
                    log('stop cmd error');
                    reject(e);

                }else {
                    log('stop cmd success');
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'STOP',arg:'',cb:sysStop,method:'set'}
            ];
            log('set dos stop');
            self.dev.cmdSequence = self.dev.cmdSequence.concat(sysCmd);
            self.cmdEvent.emit('cmd_write', sysCmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to set the device into single state
*
*   @method single
*
*/
    dsoctrl.single = (function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            function sysSingle(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'SINGLE',arg:'',cb:sysSingle,method:'set'}
            ];

            self.dev.cmdSequence = self.dev.cmdSequence.concat(sysCmd);
            self.cmdEvent.emit('cmd_write', sysCmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to set the device into autoset state
*
*   @method Autoset
*
*/
    dsoctrl.autoset = (function(){
        var self = this;

        return new Promise(function(resolve, reject) {
            function sysAutoset(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'AUTOSET',arg:'',cb:sysAutoset,method:'set'}
            ];

            self.dev.cmdSequence = self.dev.cmdSequence.concat(sysCmd);
            self.cmdEvent.emit('cmd_write', sysCmd);
        });
    }).bind(dsoObj);

/**
*   The method belong to dsoctrl class used to set the device into force trigger state
*
*   @method force
*
*/
    dsoctrl.force = (function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            function sysForce(e){
                if (e) {
                    reject(e);

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'FORCE',arg:'',cb:sysForce,method:'set'}
            ];

            self.dev.cmdSequence = self.dev.cmdSequence.concat(sysCmd);
            self.cmdEvent.emit('cmd_write', sysCmd);
        });
    }).bind(dsoObj);


    return dsoctrl;

}


var cmd_write = function() {
    var self = this;
    var cb = null;

    var cmd = [];
    // log(this.dev.cmdSequence);
    if (this.dev.asyncWrite === 'busy') {
        log('async write busy');
        if (this.dev.writeTimeoutObj === null) {
            log('set timeout');
            this.dev.writeTimeoutObj = setTimeout(function() {
                log('cmd_write reissue');
                self.dev.writeTimeoutObj = null;
                cmd_write.call(self);
            },100);
        }
        return;
    }

    if (this.dev.cmdSequence.length === 0) {
        if (this.dev.writeTimeoutObj !== null) {
            clearTimeout(this.dev.writeTimeoutObj);
            // this.writeTimeoutObj=null;
            this.dev.emit('cmd_write', self.dev.cmdSequence);
        }
        log('cmdSequence = 0');
        return;
    }

    for (var i = 0, len = this.dev.cmdSequence.length; i < len; i++) {
        cmd[i] = this.dev.cmdSequence.shift();

        // avoid missing async callback, flush command buffer when find cb exist
        if (cmd[i].cb !== null){
            cb = cmd[i].cb;
            if(i < len-1 ){
                this.dev.writeTimeoutObj = setTimeout(function() {
                    log('cmd_write reissue');
                    self.dev.writeTimeoutObj = null;
                    cmd_write.call(self);
                },100);
            }
            break;
        }
    }
    self.dev.asyncWrite = 'busy';
    async.eachSeries(cmd,
        function(item,done) {
            log(item);
            if(item.method === 'set') {
                log(self['sys']);
                self[item.id].prop.set(item.prop, item.arg, done);
            }else {
                self[item.id].prop.get(item.prop, item.arg, done);
            }
        },function(err, results) {
            log('err: '+err);
            self.dev.asyncWrite = 'done';
            self.dev.state.conn = 'connected';
            log('async write done');
            if (cb)
                cb(err);
        }
    );
}

/**
*   Create new instance that used to communicate with instrument through Ethernet
*
*   @class dsoNet
*   @constructor
*   @extends dsoctrl
*   @param {string} port Port number bind to TCP socket
*   @param {string} host_addr Ip address bind to TCP socket
*
*   @return {Object} Return dsoctrl object
*/
exports.DsoNet  = function(port, host_addr) {
    // return new Promise(function(resolve, reject) {
    //     var dsoObj = _DsoObj();
    //     BindNetObj(dsoObj, port, host_addr);
    //     resolve(_DsoCtrl(dsoObj));
    // });

    var dsoObj = new _DsoObj();

    BindNetObj(dsoObj, port, host_addr);
    // this = _DsoCtrl(dsoObj);
    // return this;
    return _DsoCtrl(dsoObj);

};

/**
*   Create new instance that used to communicate with instrument through USB
*
*   @class dsoUSB
*   @constructor
*   @extends dsoctrl
*   @param {string} vid Vender ID bind to USB device
*   @param {string} pid Product ID bind to USB device
*
*   @return {Object} Return dsoctrl object
*/

exports.DsoUSB  = function(device) {

    // return new Promise(function(resolve, reject) {
    //     var dsoObj = _DsoObj();
    //     usbDev.BindUsbObj(dsoObj, vid, pid);
    //     resolve(_DsoCtrl(dsoObj));
    // });


    var dsoObj = new _DsoObj();
    // console.log(dsoObj);

    console.log(dsoObj.dev.usbConnect);

    if(dsoObj.dev.usbConnect)
        console.log('we have usbConnect');
    else
        console.log('we dont have usbConnect');
    dsoObj.cmdEvent.on('cmd_write', function(cmd){
        log('trigger cmdEvent');
        cmd_write.call(dsoObj);
    });
    usbDev.BindUsbObj(dsoObj.dev, device);
    // this = _DsoCtrl(dsoObj);

    // return this;

    return _DsoCtrl(dsoObj);
};

/**
*   Show available net device.
*
*   @method showNetDevice
*   @return {Array} Array [ {name: , port: , addr: } , ...]
*
*/
exports.showNetDevice = function() {
    var devInfo=[];
    var i,len=availableNetDevice.length;

    for(i=0; i<len; i++){
        var info={};

        info.name = availableNetDevice[i].name;
        info.port = availableNetDevice[i].port;
        info.addr = availableNetDevice[i].addresses[1];
        devInfo.push(info);
    }
    return devInfo;
};



