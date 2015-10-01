'use strict';

var propMethod = require('./propMethod.js');

function TriggerObj(){
    this.temp=0;
    this.type='EDGE';
    this.source='CH1';
    this.mode='AUTO';
    this.holdoff='4E-9';
    this.noise_rej='OFF';
    this.reject='OFF';
    this.level='0E+0';
    this.alt='OFF';
    //ARMED indicates that the oscilloscope is acquiring pretrigger information.
    //AUTO indicates that the oscilloscope is in the automatic mode and acquires data even in the absence of a trigger.
    //READY indicates that all pretrigger information has been acquired and that theoscilloscope is ready to accept a trigger.
    //SAVE indicates that the oscilloscope is in save mode and is not acquiring data.
    //TRIGGER indicates that the oscilloscope triggered and is acquiring the post trigger information.
    this.state='ARMED';
    this.edge={
        coupling:'DC',
        slop:'RISE',
    };
    this.delay={
        coupling:'DC',
        source:'CH2',
        slop:'RISE',
        level:'0E+0',
        type:'EVENT',
        event:'2',
        time:'1E-2'
    };
    this.pulsewidth={
        polarity:'HI',
        when:'4E-9',
        time:'1E-2'
    };
    this.pulserunt={
        polarity:'HI',
        when:'4E-9',
        time:'1E-2',
        lowLevel:'0'
    };
    this.risefall={
        slop:'RISE',
        when:'4E-9',
        time:'1E-2'
    };
    this.video={
        type:'NTSC',
        polarity:'POSITIVE',
        field:'FIELD1',
        line:'1'
    };
    this.ext_probe={
        type:'1E0',
        ratio:'1E0'
    };
    this.timeout={
        when:'HIGH',
        time:'1E-2'
    };
};

TriggerObj.prototype.cmdHandler={
        'TrigType':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.type=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.type=arg;
                                //return true;
                              }
        },
        'TrigSource':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                if(TrigObj.type=='DELAY')
                                    TrigObj.delay.source=res.toString();
                                else
                                    TrigObj.source=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                if(TrigObj.type=='DELAY')
                                    TrigObj.delay.source=arg;
                                else
                                    TrigObj.source=arg;
                              }
        },
        'TrigCouple':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                if(TrigObj.type=='DELAY')
                                    TrigObj.delay.coupling=res.toString();
                                else
                                    TrigObj.edge.coupling=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                if(TrigObj.type=='DELAY')
                                    TrigObj.delay.coupling=arg;
                                else
                                    TrigObj.edge.coupling=arg;
                              }
        },
        'TrigNoiseRej':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.noise_rej=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.noise_rej=arg;
                                //return true;
                              }
        },
        'TrigReject':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.reject=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.reject=arg;
                                //return true;
                              }
        },
        'TrigMode':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.mode=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.mode=arg;
                                //return true;
                              }
        },
        'TrigHoldoff':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.holdoff=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.holdoff=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigEdgeSlop':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.edge.slop=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.edge.slop=arg;
                              }
        },
        'TrigDelayType':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.delay.type=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.delay.type=arg;
                              }
        },
        'TrigDelaySlop':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.delay.slop=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.delay.slop=arg;
                              }
        },
        'TrigDelayTime':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.delay.time=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.delay.time=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigDelayEvent':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.delay.event=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.delay.event=arg;
                              }
        },
        'TrigDelayLevel':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.delay.level=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.delay.level=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigPulseWidthPolarity':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.pulsewidth.polarity=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.pulsewidth.polarity=arg;
                              }
        },
        'TrigPulseWidthWhen':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.pulsewidth.when=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.pulsewidth.when=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigPulseWidthTime':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.pulsewidth.time=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.pulsewidth.time=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigRuntPolarity':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.pulserunt.polarity=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.pulserunt.polarity=arg;
                              }

        },
        'TrigRuntWhen':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.pulserunt.when=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.pulserunt.when=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigRuntTime':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.pulserunt.time=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.pulserunt.time=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigHighLevel':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.level=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.level=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigLowLevel':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.pulserunt.lowLevel=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.pulserunt.lowLevel=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigRiseFallSlop':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.risefall.slop=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.risefall.slop=arg;
                              }
        },
        'TrigRiseFallWhen':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.risefall.when=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.risefall.when=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigRiseFallTime':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.risefall.time=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.risefall.time=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigVideoType':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.video.type=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.video.type=arg;
                              }
        },
        'TrigVideoField':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.video.field=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.video.field=arg;
                              }
        },
        'TrigVideoLine':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.video.line=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.video.line=arg;
                              }
        },
        'TrigVideoPolarity':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.video.polarity=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.video.polarity=arg;
                              }
        },
        'TrigState':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.state=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.state=arg;
                              }
        },
        'TrigALT':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.alt=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.alt=arg;
                              }
        },
        'TrigExtProbeType':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.ext_probe.type=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.ext_probe.type=arg;
                              }
        },
        'TrigExtProbeRatio':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.ext_probe.ratio=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.ext_probe.ratio=arg;
                              }
        },
        'TrigTimeoutWhen':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.timeout.when=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                TrigObj.timeout.when=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'TrigTimeoutTime':{
                    getHandler:function(TrigObj,res,cb){
                                res=res.slice(0,-1);
                                TrigObj.timeout.time=res.toString();
                                return true;
                              },
                    setHelper:function(TrigObj,arg,cb){
                                //console.log(TrigObj);
                                TrigObj.timeout.time=arg.toString();
                                if(TrigObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+TrigObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        }

    };



exports.initTrigObj = function(id){

    var trigCmd = new TriggerObj();
    // trigCmd.cmdHandler=cmdHandler;
    trigCmd.prop=propMethod.CreatMethod.call(this,id);

    return trigCmd;

}
