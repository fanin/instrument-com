'use strict';

var propMethod = require('../dev/propMethod.js');

function AcqObj(){
    this.temp=0;
    this.mode='sample';
    this.average='2';
    this.header='ON';
    this.mem_length='1E+4';
};
AcqObj.prototype.cmdHandler={
        'AcqMode':{
                    getHandler:function(AcqObj,res,cb){
                                res=res.slice(0,-1);
                                AcqObj.mode=res.toString();
                                return true;
                              },
                    setHelper:function(AcqObj,arg,cb){
                                AcqObj.mode=arg;
                                return true;
                              }
        },
        'AcqRecLength':{
                    getHandler:function(AcqObj,res,cb){
                                res=res.slice(0,-1);
                                AcqObj.mem_length=res.toString();
                                return true;
                              },
                    setHelper:function(AcqObj,arg,cb){
                                AcqObj.mem_length=arg;
                                return true;
                              }
        },
        'AcqHeader':{
                    getHandler:function(AcqObj,res,cb){
                                res=res.slice(0,-1);
                                AcqObj.header=res.toString();
                                return true;
                              },
                    setHelper:function(AcqObj,arg,cb){
                                AcqObj.header=arg;
                                return true;
                              }
        },
        'AcqAverage':{
                    getHandler:function(AcqObj,res,cb){
                                res=res.slice(0,-1);
                                AcqObj.average=res.toString();
                                return true;
                              },
                    setHelper:function(AcqObj,arg,cb){
                                //console.log(AcqObj);
                                AcqObj.average=arg;
                                return true;
                              }
        }

    };
exports.initAcqObj = function(id){

    var acqCmd = new AcqObj();
    acqCmd.prop=propMethod.CreatMethod.call(this,id);

    return acqCmd;

}
