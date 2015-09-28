'use strict';

var msoActionCreators = require('../actions/mso-consoleActionCreators');
var msoStore          = require('../stores/mso-consoleStore');
// var ipc = electronRequire('ipc');
// var remote = electronRequire('remote');
// var dsoDriver=remote.require('./msoDriver/index.js');
var imgDataPong= new ImageData(800,480);

var AppWaveform = React.createClass({
    getInitialState: function() {
        return {
            screenProc:{},
            windowElement:{},
            plotStyle:{
                        width:'800',
                        height:'480'
                      }
        };
    },

    componentWillMount: function() {

        //<div className='main-plot' style={this.state.plotStyle} ></div>
        // <canvas className='screen-canvas' id='tutorial' width='800' height='480'></canvas>

        this.state.windowElement=React.createElement('canvas', {className: 'screen-canvas', width:'800', height:'480'},null);



    },
    componentDidMount: function() {
        var dsoCtrl=this.props.dsoctrl;
        console.log(this.props);

        // draw waveform
        // var rawAB=new ArrayBuffer(1000000);
        // var vArray=new Uint8Array(rawAB);
        // ipc.on('picture-data', function(res) {
        //     dsoCtrl.getRawdata('ch1')
        //         .then(function(data){
        //             var j,i,k,len;
        //             var rawAB=new ArrayBuffer(data.length);
        //             var vArray=new Uint8Array(rawAB);
        //             for(i=0,len=data.length;i<len;i++){
        //                 vArray[i]=data[i];
        //             }

        //             var raw=new DataView(rawAB);
        //             var chRaw=[];
        //             len=data.length/2;
        //             // console.log('len='+len);



        //             for(i=0,j=0;i<len;i++,j+=2){
        //                 chRaw.push([i,raw.getInt16(j)]);
        //                 // console.log(j);
        //             }


        //             $.plot('.main-plot', [chRaw]);
        //             setTimeout(function(){
        //                 rawAB=null;
        //                 vArray=null;
        //                 raw=null;
        //                 chRaw=null;
        //              ipc.send('asynchronous-message', 'ping');

        //             }, 500);

        //         });
        // });

        // dsoCtrl.connect().then(function(){
        //     ipc.send('asynchronous-message', 'ping');
        // });



        var canvas=$('.screen-canvas')[0];
        var ctx = canvas.getContext('2d');
        var cnt=0;

        // ipc.on('picture-data', function(res) {
        //     dsoCtrl.getSnapshot().then(function(data){

        //         var j,i,k,len=data.length;
        //         var img=new Uint8Array(data);

        //         console.log('dsoClient.sys.dispData.length='+len);
        //         for(j=0,i=0;i<len;){
        //             var r,g,b,pix;
        //             cnt=(img[i+1]<<8)+img[i];
        //             //console.log('bcnt='+cnt);
        //             pix=(img[i+3]<<8)+img[i+2];
        //             r=(pix & 0x001f)<<3;
        //             g=(pix & 0x07e0)>>>3;
        //             b=(pix & 0xf800)>>>8;
        //             for(k=0;k<cnt;k++){
        //                 imgDataPong.data[j]=b;
        //                 imgDataPong.data[j+1]=g;
        //                 imgDataPong.data[j+2]=r;
        //                 imgDataPong.data[j+3]=255;
        //                 j+=4;
        //             }
        //             i+=4;
        //              // console.log('i='+i);
        //              // console.log('j='+j);
        //         }
        //         ctx.putImageData(imgDataPong,0,0);
        //         //delete img;
        //         setTimeout(function(){
        //          ipc.send('asynchronous-message', 'ping');
        //         }, 50);

        //     });
        // });
        // dsoCtrl.connect().then(function(){
        //     ipc.send('asynchronous-message', 'ping');
        // });
    },

    componentWillUnmount: function() {

    },
    componentDidUpdate: function(){
        var dsoCtrl=this.props.dsoctrl;
        var canvas=$('.screen-canvas')[0];
        var ctx = canvas.getContext('2d');
        var cnt=0;

        console.log("dsoctrl obj");
        console.log(dsoCtrl);
        if(dsoCtrl){
            // if(screenProc){
            //     clearTimeout(screenProc);
            // }
            // screenProc=setInterval(function(){

                $.ajax({
                      url: '/dso/screen',
                      dataType: 'json',
                      type: 'get',
                      data: {dsoctrl:dsoCtrl},
                      success: function(res) {
                        console.log(res.data);
                        var j,i,k,len=res.data.data.length;
                        var img=new Uint8Array(res.data.data);

                        console.log('dsoClient.sys.dispData.length='+len);
                        for(j=0,i=0;i<len;){
                            var r,g,b,pix;

                            cnt=(img[i+1]<<8)+img[i];
                            //console.log('bcnt='+cnt);
                            pix=(img[i+3]<<8)+img[i+2];
                            r=(pix & 0x001f)<<3;
                            g=(pix & 0x07e0)>>>3;
                            b=(pix & 0xf800)>>>8;
                            for(k=0;k<cnt;k++){
                                imgDataPong.data[j]=b;
                                imgDataPong.data[j+1]=g;
                                imgDataPong.data[j+2]=r;
                                imgDataPong.data[j+3]=255;
                                j+=4;
                            }
                            i+=4;
                             // console.log('i='+i);
                             // console.log('j='+j);
                        }
                        ctx.putImageData(imgDataPong,0,0);
                      }.bind(this),
                      error: function(xhr, status, err) {
                        console.log('error')
                      }.bind(this)
                });

            // },500);
        }
    },

    render: function() {

        return (
            <div>
                {this.state.windowElement}

            </div>
        );
    },
});

module.exports = AppWaveform;
