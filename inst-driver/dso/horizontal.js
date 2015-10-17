'use strict';

var propMethod = require('../dev/propMethod.js');



function HorObj(){
    this.temp=0;
    this.position='0';
    this.zposition='0';
    this.scale='2E-6';
    this.zscale='1E-6';
    this.mode='MAIN';
    this.expand='CENTER';
}

HorObj.prototype.cmdHandler={
        'HorPosition':{
                    getHandler:function(HorObj,res,cb){
                                res=res.slice(0,-1);
                                HorObj.position=res.toString();
                                return true;
                              },
                    setHelper:function(HorObj,arg,cb){
                                HorObj.position=arg.toString();
                                if(HorObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+HorObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'HorZoomPosition':{
                    getHandler:function(HorObj,res,cb){
                                res=res.slice(0,-1);
                                HorObj.zposition=res.toString();
                                return true;
                              },
                    setHelper:function(HorObj,arg,cb){
                                HorObj.zposition=arg.toString();
                                if(HorObj.temp != parseFloat(arg)){
                                    if(typeof cb=== 'function')
                                        cb(['-500','\''+HorObj.temp.toExponential()+'\' argument does not accept, set to near one '+arg]);
                                    return false;
                                }
                                return true;
                              }
        },
        'HorZoomScale':{
                    getHandler:function(HorObj,res,cb){
                                res=res.slice(0,-1);
                                HorObj.zscale=res.toString();
                                return true;
                              },
                    setHelper:function(HorObj,arg,cb){
                                //console.log(HorObj);
                                HorObj.zscale=arg;
                                return true;
                              }
        },
        'HorScale':{
                    getHandler:function(HorObj,res,cb){
                                res=res.slice(0,-1);
                                HorObj.scale=res.toString();
                                return true;
                              },
                    setHelper:function(HorObj,arg,cb){
                                HorObj.scale=arg;
                                return true;
                              }
        },
        'HorMode':{
                    getHandler:function(HorObj,res,cb){
                                res=res.slice(0,-1);
                                HorObj.mode=res.toString();
                                return true;
                              },
                    setHelper:function(HorObj,arg,cb){
                                HorObj.mode=arg;
                                return true;
                              }
        },
        'HorExpand':{
                    getHandler:function(HorObj,res,cb){
                                res=res.slice(0,-1);
                                HorObj.expand=res.toString();
                                return true;
                              },
                    setHelper:function(HorObj,arg,cb){
                                HorObj.expand=arg;
                                return true;
                              }
        }
    };
exports.initHorObj = function(id){
    var horCmd = new HorObj();
    // horCmd.cmdHandler=cmdHandler;
    horCmd.prop=propMethod.CreatMethod.call(this,id);

    return horCmd;

}
