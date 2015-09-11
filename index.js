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
var events  = require('events');
var path    = require('path');
var Promise = require('es6-promise').Promise;

var debug = require('debug');
var log = debug('index:log');
var info = debug('index:info');
var error = debug('index:error');
var sytConstant=require('.//msoDriver/sysConstant.js');
var syscmd = require('./msoDriver/system.js');
var trigcmd = require('./msoDriver/trigger.js');
var acqcmd = require('./msoDriver/acquire.js');
var horcmd = require('./msoDriver/horizontal.js');
var mathcmd = require('./msoDriver/math.js');
var meascmd = require('./msoDriver/measure.js');
var channel = require('./msoDriver/channel.js');
    // usbDev = require('./msoDriver/devUsb.js');
var usbDev = require('./msoDriver/devUsbFs.js');
var supportType = ['GDS2000E'];
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

function getIDN(dsoObj, data, cb) {
    var id = data.toString().split(',');

    dsoObj.gdsType = '';
    for (var j = 0; j < supportType.length; j++) {
        var gdsModel = dsoObj.commandObj[supportType[j]].model;
        for (var i = 0; i < gdsModel.length ; i++) {
            log('compare ' + id[1] + 'with ' + gdsModel[i]);
            if (id[1] === gdsModel[i]) {
                dsoObj.gdsType = supportType[j];
                dsoObj.gdsModel = id[1];
                dsoObj.maxChNum = dsoObj.commandObj[supportType[j]].maxChNum[gdsModel[i]];
                break;
            }
        }
    }

    log('gdsType=' + dsoObj.gdsType);
    log('gdsModel=' + dsoObj.gdsModel);

    //cb(null,data);
    return true;
}

function getChInfo(dsoObj, data, cb) {
        log(data);
        cb(null, data);
}

function done(){
    log('------------------------- done');
}



function testDsoCmd(dsoObj, callback) {
    var tmp={};


    async.series(
        [
            function(done) {
                log('write command to server');
                dsoObj.state.conn = 'query';
                dsoObj.cmdHandler = getIDN;
                dsoObj.handlerSelf = dsoObj;
                dsoObj.syncCallback = done;
                dsoObj.write('*idn?\r\n');
                // dsoObj.net.socket.once('data',function(data){
                //     getIDN(data,dsoObj,done);
                // });

            },
            function(done) {
                dsoObj.state.conn = 'query';
                dsoObj.cmdHandler = getChInfo;
                dsoObj.handlerSelf = dsoObj;
                dsoObj.syncCallback = done;
                dsoObj.write(':CHANnel1:SCAle?\r\n');
                // dsoObj.net.socket.once('data',function(data){
                //     getChInfo(data,dsoObj,done);
                // });
            },
            // function(done){
            //     async.eachSeries(chTestCmd,
            //         function(item,done){
            //             dsoObj.ch1.getProp(item.prop,item.arg,done);

            //         },function(err,results){
            //             log('--------- Channel-1 Get Prop Test Cmd -------------');
            //             log('err:'+err);
            //             log('results:'+results);
            //             log('--------------------------------------------');
            //             done();
            //         }
            //     );
            // },
            // function(done){
            //     // dsoObj.ch2.getProp('ChState',tmp,done);
            //     async.eachSeries(chTestCmd,
            //         function(item,done){
            //             dsoObj.ch2.setProp(item.prop,item.arg,done);

            //         },function(err,results){
            //             log('--------- Channel-2 Set Prop Test Cmd -------------');
            //             log('err:'+err);
            //             log('results:'+results);
            //             log('--------------------------------------------');
            //             done();
            //         }
            //     );
            // },
            // function(done){
            //     async.eachSeries(sysTestCmd,
            //         function(item,done){
            //             dsoObj.sys.prop.get(item.prop,item.arg,done);
            //         },function(err,results){
            //             log('*************** System Get Error After Channel Test Cmd ***************');
            //             done();
            //         }
            //     );
            // },
            // function(done){
            //     async.eachSeries(acqTestCmd,
            //         function(item,done){
            //             dsoObj.acq.prop.set(item.prop,item.arg,done);

            //         },function(err,results){
            //             log('--------- Acquire Set Prop Test Cmd -------------');
            //             log('err:'+err);
            //             log('results:'+results);
            //             log('--------------------------------------------');
            //             done();
            //         }
            //     );
            // },
            // function(done){
            //     async.eachSeries(sysTestCmd,
            //         function(item,done){
            //             dsoObj.sys.prop.get(item.prop,item.arg,done);
            //         },function(err,results){
            //             log('*************** System Get Error After Acquire Test Cmd ***************');
            //             done();
            //         }
            //     );
            // },
            // function(done){
            //     async.eachSeries(horTestCmd,
            //         function(item,done){
            //             dsoObj.hor.prop.set(item.prop,item.arg,done);

            //         },function(err,results){
            //             log('--------- Horizontal Set Prop Test Cmd -------------');
            //             log('err:'+err);
            //             log('results:'+results);
            //             log('--------------------------------------------');
            //             done();
            //         }
            //     );
            // },
            // function(done){
            //     async.eachSeries(sysTestCmd,
            //         function(item,done){
            //             dsoObj.sys.prop.get(item.prop,item.arg,done);
            //         },function(err,results){
            //             log('*************** System Get Error After Horizontal Test Cmd ***************');
            //             done();
            //         }
            //     );
            // },
            // function(done){
            //     async.eachSeries(mathTestCmd,
            //         function(item,done){
            //             dsoObj.math.prop.set(item.prop,item.arg,done);

            //         },function(err,results){
            //             log('--------- Math Set Prop Test Cmd -------------');
            //             log('err:'+err);
            //             log('results:'+results);
            //             log('--------------------------------------------');
            //             done();
            //         }
            //     );
            // },
            // function(done){
            //     async.eachSeries(sysTestCmd,
            //         function(item,done){
            //             dsoObj.sys.prop.get(item.prop,item.arg,done);
            //         },function(err,results){
            //             log('*************** System Get Error After Horizontal Test Cmd ***************');
            //             done();
            //         }
            //     );
            // },
            function(done) {
                async.eachSeries(measSetTestCmd,
                    function(item,done) {
                        dsoObj.meas1.prop.set(item.prop, item.arg, done);

                    },function(err, results) {
                        log('--------- Measure1 Set Prop Test Cmd -------------');
                        log('err:' + err);
                        log('results:' + results);
                        log('--------------------------------------------');
                        done();
                    }
                );
            },

            function(done){
                async.eachSeries(measGetTestCmd,
                    function(item, done) {
                        dsoObj.meas1.prop.get(item.prop, item.arg, done);

                    },function(err, results) {
                        log('--------- Measure1 Get Prop Test Cmd -------------');
                        log('err:' + err);
                        log('results:' + results);
                        log('--------------------------------------------');
                        done();
                    }
                );
            },




            function(done) {
                async.eachSeries(trigTestCmd,
                    function(item, done) {
                        dsoObj.trig.prop.set(item.prop, item.arg, done);

                    },function(err, results) {
                        log('--------- Trigger Set Prop Test Cmd -------------');
                        log('err:' + err);
                        log('results:' + results);
                        log('--------------------------------------------');
                        done();
                    }
                );
            },
            function(done) {

                async.eachSeries(sysTestCmd,
                //async.eachSeries(dispTestCmd,
                    function(item, done) {
                        dsoObj.sys.prop.get(item.prop, item.arg, done);
                    },function(err, results){
                        log('*************** System Get Error After Trigger Test Cmd ***************');
                        done();
                    }
                );
            }
        ]
        ,
        function(err, results) {
            log('err:' + err);
            log('results:' + results);
            log('--------- dso object info -------------');
            if (typeof callback  === 'function')
                    callback();
        }
    );
};

// function sendIDN(){
// }
function checkDsoExist(dsoObj, callback) {
    var timeoutCnt = 0;
    log('checkDsoExist');
    log('write command to server');
    dsoObj.state.conn = 'query';
    dsoObj.cmdHandler = getIDN;
    dsoObj.handlerSelf = dsoObj;
    dsoObj.state.setTimeout = true;
    dsoObj.state.timeoutObj = setTimeout(function() {
        log('settimeout');
        dsoObj.state.conn = 'timeout';
        dsoObj.write('*idn?\r\n');
    }, 1000);
    dsoObj.write('*idn?\r\n');
    dsoObj.syncCallback = (function() {
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
    }).bind(dsoObj);


    // async.series(
    //     [
    //         function(done) {
    //             log('write command to server');
    //             dsoObj.state.conn='query';
    //             dsoObj.cmdHandler=getIDN;
    //             dsoObj.handlerSelf=dsoObj;
    //             dsoObj.syncCallback=done;
    //             dsoObj.write('*idn?\r\n');
    //         }
    //     ]
    //     ,
    //     function(err,results){
    //         dsoObj.state.conn='connected';
    //         log('err:'+err);
    //         log('results:'+results);
    //         log('--------- dso object info -------------');
    //         if(typeof callback  === 'function'){
    //                 callback();
    //                 return;
    //         }
    //     }
    // );
};
function enableSocketTime(dsoObj) {
    dsoObj.net.socket.setTimeout(1500,function() {
        log('socket timeout');
        if(dsoObj.state.conn === 'timeout') {
            dsoObj.net.socket.end();
            dsoObj.net.socket.destroy();
        }
    })
}
function enableInterfTime(dsoObj) {
    if(dsoObj.interf === 'net')
        enableSocketTime(dsoObj);
}
var Dso = function() {
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
    this.errHandler = function(){};
    this.write = function(data) {
        if (this.interf === 'usb') {
            this.usb.write(data);
        }else if (this.interf === 'net') {
            this.net.socket.write(data);
            return true;
        }
        // else
        //     return false;
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

        log('dataHandler receive ' + data.slice(0,11) + 'length=' + data.length);
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

}
uitl.inherits(Dso, events.EventEmitter);

Dso.prototype.GetSnapshot = function(cb) {
    this.sys.prop.get('DispOut', '', function() {
        if (cb){
            cb(this.sys.dispData);
        }
    });

}

Dso.prototype.GetRawdata = function(ch,cb) {
    var self = this;

    log(sytConstant.chID[ch]);

    if (sytConstant.chID[ch] !== undefined) {
        var cmd = [
                {id:'acq',prop:'AcqHeader',arg:'OFF',cb:done,method:'set'},
                {id:ch,prop:'AcqMemory',arg:'',cb:cb,method:'get'}
            ];
            this.emit('cmd_write',cmd);

            // async.eachSeries(cmd,
            //     function(item,done){
            //         log(item);
            //         if(item.id==='acq'){
            //             self.acq.prop.set(item.prop,item.arg,done);
            //         }
            //         else{
            //             self[ch].prop.get(item.prop,item.arg,done);
            //         }

            //     },function(err,results){
            //         if(cb)
            //             cb(self[ch].rawdata);
            //     }
            // );
    }else {
        if(cb){
            cb('error');
        }
    }

}

Dso.prototype.onSocketErr=function(cb) {
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

Dso.prototype.GetPort = function(cb) {
    if (cb){
        cb(this.net.port);
    }else {
        return this.net.port;
    }
}

Dso.prototype.GetAddr = function(cb) {
    if(cb){
        cb(this.net.host_addr);
    }else {
        return this.net.host_addr;
    }
}



Dso.prototype.reloadState = function(cb) {
    var self = this;

    if(this.state.conn ==='disconnect') {
        cb('connection broken');
        return;
    }

    enableInterfTime(this);
    var reloadCmd = [].concat(trigLoadCmd);
    reloadCmd = reloadCmd.concat(acqLoadCmd);
    reloadCmd = reloadCmd.concat(horLoadCmd);
    async.series(
        [
            function(done) {
                async.eachSeries(reloadCmd,
                    function(item, done) {
                        self[item.id].prop.get(item.prop, item.arg,done);

                    },function(err, results) {
                        done();
                    }
                );
            },
            function(done) {
                var chCmd = [];
                for(var i = 0; i < self.maxChNum; i++) {
                    chCmd = chCmd.concat(chanLoadCmd[i]);
                }

                async.eachSeries(chCmd,
                    function(item, done) {
                            self[item.id].prop.get(item.prop, item.arg, done);

                    },function(err, results) {
                        done();
                    }
                );

            }
        ]
        ,
        function(err, results) {
            self.state.conn = 'connected';
            if (cb) {
                cb();
                return;
            }
        }
    );
};

function getCmdObj() {
    var FilePath = path.join(__dirname, '/msoDriver/command.json');

    this.commandObj = JSON.parse(fs.readFileSync(FilePath));
}
function BindNetObj(dsoObj, port, host_addr) {

    // dsoObj.port=port;
    // dsoObj.host_addr=host_addr;
    dsoObj.interf = 'net';
    dsoObj.net = {
        dataHandler : function(data) {
            // log('socket on data event!');

            // socket idle when send query command
            if (dsoObj.state.setTimeout) {
                if (dsoObj.state.conn !== 'timeout') {
                    log('clearTimeout');
                    clearTimeout(dsoObj.state.timeoutObj);
                }
                dsoObj.state.setTimeout = false;
            }

            if ((dsoObj.state.conn === 'query') || (dsoObj.state.conn === 'timeout')) {
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
Dso.prototype.tcpConnect = function(Callback) {
    var err_string;
    var self = this;

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
Dso.prototype.tcpDisconnect = function(Callback) {
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
Dso.prototype.usbConnect = function(Callback) {
    var err_string;
    var self = this;

    usbDev.openUsb(this, function() {
            // log(self.usb);
            // self.usb.onData(self.dataHandler);
            checkDsoExist(self, Callback);
    });
};
Dso.prototype.usbDisconnect = function(Callback) {
    var self = this;

    usbDev.closeUsb(this, function() {
        self.state.conn='disconnected';
        self.usb.device=null;
        self.interf='empty';
    });
};
Dso.prototype.cmd_write = function(cmdSequence) {
    var self = this;
    var cb = null;

    var cmd = [];

    if (this.asyncWrite === 'busy') {
        log('async write busy');
        if (this.writeTimeoutObj === null) {
            log('set timeout');
            this.writeTimeoutObj = setTimeout(function() {
                log('cmd_write reissue');
                self.writeTimeoutObj = null;
                self.cmd_write(cmdSequence);
            },100);
        }
        return;
    }

    if (this.cmdSequence.length === 0) {
        if (this.writeTimeoutObj !== null) {
            clearTimeout(this.writeTimeoutObj);
            // this.writeTimeoutObj=null;
            this.emit('cmd_write', self.cmdSequence);
        }
        log('cmdSequence = 0');
        return;
    }

    for (var i = 0, len = this.cmdSequence.length; i < len; i++) {
        cmd[i] = this.cmdSequence.shift();

        // avoid missing async callback, flush command buffer when find cb exist
        if (cmd[i].cb !== null){
            cb = cmd[i].cb;
            if(i < len-1 ){
                this.writeTimeoutObj = setTimeout(function() {
                    log('cmd_write reissue');
                    self.writeTimeoutObj = null;
                    self.cmd_write(cmdSequence);
                },100);
            }
            break;
        }
    }
    self.asyncWrite = 'busy';
    async.eachSeries(cmd,
        function(item,done) {
            log(item);
            if(item.method === 'set') {
                self[item.id].prop.set(item.prop, item.arg, done);
            }else {
                self[item.id].prop.get(item.prop, item.arg, done);
            }
        },function(err, results) {
            self.asyncWrite = 'done';
            self.state.conn = 'connected';
            log('async write done');
            if (cb)
                cb(err);
        }
    );



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

    var dsoObj = new Dso();

    getCmdObj.call(dsoObj);
    //assign dso system command process method to dsoObj.sys
    dsoObj.sys = syscmd.initSysObj.call(dsoObj, 'sys');

    dsoObj.trig = trigcmd.initTrigObj.call(dsoObj, 'trig');

    dsoObj.acq = acqcmd.initAcqObj.call(dsoObj, 'acq');

    dsoObj.hor = horcmd.initHorObj.call(dsoObj, 'hor');

    dsoObj.math = mathcmd.initMathObj.call(dsoObj, 'math');
    dsoObj.meas1 = meascmd.initMeasObj.call(dsoObj, 'meas1');
    dsoObj.meas2 = meascmd.initMeasObj.call(dsoObj, 'meas2');
    dsoObj.meas3 = meascmd.initMeasObj.call(dsoObj, 'meas3');
    dsoObj.meas4 = meascmd.initMeasObj.call(dsoObj, 'meas4');
    dsoObj.meas5 = meascmd.initMeasObj.call(dsoObj, 'meas5');
    dsoObj.meas6 = meascmd.initMeasObj.call(dsoObj, 'meas6');
    dsoObj.meas7 = meascmd.initMeasObj.call(dsoObj, 'meas7');
    dsoObj.meas8 = meascmd.initMeasObj.call(dsoObj, 'meas8');

    dsoObj.ch1 = channel.initChanObj.call(dsoObj, 'ch1');
    dsoObj.ch2 = channel.initChanObj.call(dsoObj, 'ch2');
    dsoObj.ch3 = channel.initChanObj.call(dsoObj, 'ch3');
    dsoObj.ch4 = channel.initChanObj.call(dsoObj, 'ch4');
    // for (var i = 0; i<supportType.length; i++){
    //     log(dsoObj.commandObj[SupportedModel[i]].model[0]);
    // }
    dsoObj.on('cmd_write', dsoObj.cmd_write);
    return dsoObj;
};

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
                    reject(Error("error"));

                }else {
                    resolve();
                }

            };

            if (self.interf === 'usb') {
                self.usbConnect(conn);
            }else if (self.interf === 'net') {
                self.tcpConnect(conn);
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

            if(self.state.conn!=='disconnected'){
                if(self.writeTimeoutObj!==null){
                    clearTimeout(self.writeTimeoutObj);
                }
                if (self.interf === 'usb') {
                    self.usbDisconnect(resolve);
                }else if (self.interf === 'net') {
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
        var chCmd = [];
        var self = this;

        return new Promise(function(resolve, reject) {
            function reload(e){
                if (e) {
                    reject(Error("error"));

                }else {
                    chCmd[chCmd.length-1].cb = reload;
                    resolve();
                }

            };
            self.cmdSequence = self.cmdSequence.concat(acqLoadCmd);
            self.cmdSequence = self.cmdSequence.concat(trigLoadCmd);
            self.cmdSequence = self.cmdSequence.concat(horLoadCmd);
            for(var i = 0; i < self.maxChNum; i++) {
                chCmd = chanLoadCmd[i].slice(0);
                self.cmdSequence = self.cmdSequence.concat(chCmd);
            }
            chCmd[chCmd.length-1].cb = reload;
            // self.cmdSequence[self.cmdSequence.length-1].cb = reload;
            // log(self.cmdSequence);
            self.emit('cmd_write', self.cmdSequence);
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
                    reject(Error("error"));

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
            self.cmdSequence = self.cmdSequence.concat(cmd);
            // log(self.cmdSequence);
            self.emit('cmd_write', cmd);
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
*   Channel property of device.
*
*   @property chProperty
*   @type Object
*   @param {String} coupling Specify coupling on AC,DC or GND
*   @param {String} impedance Specify the impedance of the analog channel
*   @param {String} invert
*   @param {String} bandwidth
*   @param {String} expand
*   @param {String} state
*   @param {String} position
*   @param {String} deskew
*   @param {String} rawdata
*   @param {String} probe.unit
*   @param {String} probe.atten
*/
    dsoctrl.getVertical = (function(ch) {
        // this.GetSnapshot(callback);
        var self = this;
        var chNum = sytConstant.chID[ch];
        var chCmd;

        return new Promise(function(resolve, reject) {
            function vetical(e){
                if (e) {
                    reject(Error("error"));

                }else {
                    chCmd[chCmd.length-1].cb = null;
                    resolve(self[ch]);
                }

            };
            if(chNum < this.maxChNum) {
                chCmd = chanLoadCmd[chNum].slice(0);
                chCmd[chCmd.length-1].cb = vetical;
                self.cmdSequence = self.cmdSequence.concat(chCmd);
                // self.cmdSequence[self.cmdSequence.length-1].cb = vetical;
                // log(chanLoadCmd[chNum]);
                // log('----------------------------');
                self.emit('cmd_write', self.cmdSequence);
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
        var chNum = sytConstant.chID[ch];
        var chCmd;

        return new Promise(function(resolve, reject) {
            function chstate(e){
                if (e) {
                    reject(Error("error"));

                }else {
                    chCmd[chCmd.length-1].cb = null;
                    resolve(self[ch]);
                }

            };

            var chid = ch.toLowerCase();
            if( (chid !== 'ch1') || (chid !== 'ch2') || (chid !== 'ch3') || (chid !== 'ch4')){
                reject(Error("parameter error"));
            }
            var cmd = [
                    {id:ch, prop:'ChState', arg:'ON', cb:chstate, method:'set'}
                ];
            self.cmdSequence = self.cmdSequence.concat(cmd);
            self.emit('cmd_write', cmd);
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
        var chNum = sytConstant.chID[ch];
        var chCmd;

        return new Promise(function(resolve, reject) {
            function chstate(e){
                if (e) {
                    reject(Error("error"));

                }else {
                    chCmd[chCmd.length-1].cb = null;
                    resolve(self[ch]);
                }

            };

            var chid = ch.toLowerCase();
            if( (chid !== 'ch1') || (chid !== 'ch2') || (chid !== 'ch3') || (chid !== 'ch4')){
                reject(Error("parameter error"));
            }
            var cmd = [
                    {id:ch, prop:'ChState', arg:'OFF', cb:chstate, method:'set'}
                ];
            self.cmdSequence = self.cmdSequence.concat(cmd);
            self.emit('cmd_write', cmd);
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
                    reject(Error("error"));

                }else {
                    resolve(self.sys.dispData);
                }

            };
            var cmd = [
                    {id:'sys',prop:'DispOut',arg:'OFF',cb:snapshot,method:'get'}
                ];
            self.cmdSequence = self.cmdSequence.concat(cmd);
            self.emit('cmd_write', cmd);
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
                    reject(Error("error"));

                }else {
                    resolve(self[ch].rawdata);
                }

            };
            if(sytConstant.chID[ch] !== undefined){
                var cmd=[
                        {id:'acq',prop:'AcqHeader',arg:'OFF',cb:null,method:'set'},
                        {id:ch,prop:'AcqMemory',arg:'',cb:rawData,method:'get'}
                    ];
                self.cmdSequence = self.cmdSequence.concat(cmd);
                self.emit('cmd_write', cmd);

            }else {
                reject(Error("error"));
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
*   @param {String} reject
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
                    reject(Error("error"));

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
                    {id:'trig',prop:'TrigHoldoff',arg:'',cb:edgeTrig,method:'get'}
                ];
            // this.GetRawdata(ch,callback);

            self.cmdSequence = self.cmdSequence.concat(trigCmd);
            self.emit('cmd_write', trigCmd);
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
                    reject(Error("error"));

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
                self.cmdSequence = self.cmdSequence.concat(measStd);
            }
            self.cmdSequence = self.cmdSequence.concat(measVal);
            self.emit('cmd_write', measCmd);
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
                    reject(Error("error"));

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
                self.cmdSequence=self.cmdSequence.concat(measSrc2);
            }

            self.cmdSequence = self.cmdSequence.concat(measSet);
            self.cmdSequence = self.cmdSequence.concat(measType);
            self.emit('cmd_write', measSet);
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
                    reject(Error("error"));

                }else {
                    resolve();
                }

            };
            var measCmd = [
                {id:'sys',prop:'StatisticMode',arg:'ON',cb:measCmd,method:'set'}
            ];

            self.cmdSequence = self.cmdSequence.concat(measCmd);
            self.emit('cmd_write', measCmd);
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
                    reject(Error("error"));

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'StatisticMode',arg:'OFF',cb:statistic,method:'set'}
            ];

            self.cmdSequence = self.cmdSequence.concat(sysCmd);
            self.emit('cmd_write', sysCmd);
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
                    reject(Error("error"));

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'StatisticStaWeight',arg:weight,cb:statistic,method:'set'}
            ];

            self.cmdSequence = self.cmdSequence.concat(sysCmd);
            self.emit('cmd_write', sysCmd);
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
        return new Promise(function(resolve, reject) {
            function sysRun(e){
                if (e) {
                    reject(Error("error"));

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'RUN',arg:'',cb:sysRun,method:'set'}
            ];

            self.cmdSequence = self.cmdSequence.concat(sysCmd);
            self.emit('cmd_write', sysCmd);
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
                    reject(Error("error"));

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'STOP',arg:'',cb:sysStop,method:'set'}
            ];
            log('set dos stop');
            self.cmdSequence = self.cmdSequence.concat(sysCmd);
            self.emit('cmd_write', sysCmd);
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
                    reject(Error("error"));

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'SINGLE',arg:'',cb:sysSingle,method:'set'}
            ];

            self.cmdSequence = self.cmdSequence.concat(sysCmd);
            self.emit('cmd_write', sysCmd);
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
                    reject(Error("error"));

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'AUTOSET',arg:'',cb:sysAutoset,method:'set'}
            ];

            self.cmdSequence = self.cmdSequence.concat(sysCmd);
            self.emit('cmd_write', sysCmd);
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
                    reject(Error("error"));

                }else {
                    resolve();
                }

            };
            var sysCmd = [
                {id:'sys',prop:'FORCE',arg:'',cb:sysForce,method:'set'}
            ];

            self.cmdSequence = self.cmdSequence.concat(sysCmd);
            self.emit('cmd_write', sysCmd);
        });
    }).bind(dsoObj);


    return dsoctrl;

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

    var dsoObj = _DsoObj();
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
exports.DsoUSB  = function(vid,pid) {
    // return new Promise(function(resolve, reject) {
    //     var dsoObj = _DsoObj();
    //     usbDev.BindUsbObj(dsoObj, vid, pid);
    //     resolve(_DsoCtrl(dsoObj));
    // });


    var dsoObj = _DsoObj();
    usbDev.BindUsbObj(dsoObj, vid, pid);
    // this = _DsoCtrl(dsoObj);

    // return this;
    return _DsoCtrl(dsoObj);
};




