'use strict';

var propMethod = require('../dev/propMethod.js');

function MathObj(){
    this.temp=0;
    this.disp='OFF';
    this.type='dual';
    this.dual={
        source1:'CH1',
        source2:'CH2',
        operator:'PLUS',
        position:'0',
        scale:'1'
    };
    this.fft={
        source:'CH1',
        window:'RECTANGULAR',
        horPosition:'0',
        horScale:'1',
        verPosition:'0',
        verScale:'1',
        mag:'LINEAR'
    };
    this.advance={
    };
};

MathObj.prototype.cmdHandler={
        'MathDisp':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.disp=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.disp=arg;
                                return true;
                              }
        },
        'MathType':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.type=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.type=arg;
                                return true;
                              }
        },
        'MathDualSour1':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.dual.source1=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                //console.log(MathObj);
                                MathObj.dual.source1=arg;
                                return true;
                              }
        },
        'MathDualSour2':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.dual.source2=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.dual.source2=arg;
                                return true;
                              }
        },
        'MathDualOper':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.dual.operator=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.dual.operator=arg;
                                return true;
                              }
        },
        'MathDualScale':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.dual.scale=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.dual.scale=arg.toString();
                                if(MathObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+MathObj.temp.toExponential()+'\' argument does not accepte set to near one'+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'MathDualPos':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.dual.position=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.dual.position=arg.toString();
                                if(MathObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+MathObj.temp.toExponential()+'\' argument does not accepte set to near one'+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'MathFftSource':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.fft.source=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.fft.source=arg;
                                return true;
                              }
        },
        'MathFftMag':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.fft.mag=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.fft.mag=arg;
                                return true;
                              }
        },
        'MathFftWin':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.fft.window=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                //console.log(MathObj);
                                MathObj.fft.window=arg;
                                return true;
                              }
        },
        'MathFftVerPos':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.fft.verPosition=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.fft.verPosition=arg.toString();
                                if(MathObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+MathObj.temp.toExponential()+'\' argument does not accepte set to near one'+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'MathFftVerScale':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.fft.verScale=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.fft.verScale=arg.toString();
                                if(MathObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+MathObj.temp.toExponential()+'\' argument does not accepte set to near one'+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'MathFftHorPos':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.fft.horPosition=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.fft.horPosition=arg.toString();
                                if(MathObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+MathObj.temp.toExponential()+'\' argument does not accepte set to near one'+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'MathFftHorScale':{
                    getHandler:function(MathObj,res,cb){
                                res=res.slice(0,-1);
                                MathObj.fft.horScale=res.toString();
                                return true;
                              },
                    setHelper:function(MathObj,arg,cb){
                                MathObj.fft.horScale=arg.toString();
                                if(MathObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+MathObj.temp.toExponential()+'\' argument does not accepte set to near one'+arg]);
                                    return false;
                                }
                                return true;
                              }
        }

    };

exports.initMathObj = function(id){

    var mathCmd = new MathObj();
    // mathCmd.cmdHandler=cmdHandler;
    mathCmd.prop=propMethod.CreatMethod.call(this,id);

    return mathCmd;

}
