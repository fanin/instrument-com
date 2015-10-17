'use strict';

var propMethod = require('../dev/propMethod.js');

function Measure(){
    this.stdValue='0';
    this.minValue='0';
    this.meanValue='0';
    this.maxValue='0';
    this.value='0';
    this.state='OFF';
    this.source1='CH1';
    this.source2='CH2';
    this.type= 'MAXimun';
    this.temp=0;
}

Measure.prototype.cmdHandler={
    'MeasureStd':{
                getHandler:function(MeasObj,res,cb){
                            res=res.slice(0,-1);
                            MeasObj.stdValue=res.toString();
                            return true;
                          }
    },
    'MeasureMin':{
                getHandler:function(MeasObj,res,cb){
                            res=res.slice(0,-1);
                            MeasObj.minValue=res.toString();
                            return true;
                          }
    },
    'MeasureMean':{
                getHandler:function(MeasObj,res,cb){
                            res=res.slice(0,-1);
                            MeasObj.meanValue=res.toString();
                            return true;
                          }
    },
    'MeasureMax':{
                getHandler:function(MeasObj,res,cb){
                            res=res.slice(0,-1);
                            MeasObj.maxValue=res.toString();
                            return true;
                          }
    },
    'MeasureValue':{
                getHandler:function(MeasObj,res,cb){
                            res=res.slice(0,-1);
                            MeasObj.value=res.toString();
                            return true;
                          }
    },
    'MeasureType':{
                getHandler:function(MeasObj,res,cb){
                            res=res.slice(0,-1);
                            MeasObj.type=res.toString();
                            return true;
                          },
                setHelper:function(MeasObj,arg,cb){
                            MeasObj.type=arg;
                            return true;
                          }
    },
    'MeasureState':{
                getHandler:function(MeasObj,res,cb){
                            res=res.slice(0,-1);
                            MeasObj.state=res.toString();
                            return true;
                          },
                setHelper:function(MeasObj,arg,cb){
                            MeasObj.state=arg;
                            return true;
                          }
    },
    'MeasureSource2':{
                getHandler:function(MeasObj,res,cb){
                            res=res.slice(0,-1);
                            MeasObj.source2=res.toString();
                            return true;
                          },
                setHelper:function(MeasObj,arg,cb){
                            MeasObj.source2=arg;
                            return true;
                          }
    },
    'MeasureSource1':{
                getHandler:function(MeasObj,res,cb){
                            res=res.slice(0,-1);
                            MeasObj.source1=res.toString();
                            return true;
                          },
                setHelper:function(MeasObj,arg,cb){
                            MeasObj.source1=arg;
                            return true;
                          }
    }

};

exports.initMeasObj = function(id){

    var measCmd = new Measure();

    measCmd.id=id;
    measCmd.prop=propMethod.CreatMethod.call(this,id);
    // console.log('meas id='+id);
    // console.log('meas this='+this);
    return measCmd;

}
