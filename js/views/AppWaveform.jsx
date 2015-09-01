'use strict';

var msoActionCreators = require('../actions/mso-consoleActionCreators');
var msoStore          = require('../stores/mso-consoleStore');
var ipc = electronRequire('ipc');
// var remote = electronRequire('remote');
// var dsoDriver=remote.require('./msoDriver/index.js');
var imgDataPong= new ImageData(800,480);

var dispTestCmd=[
    {prop:'DispOut',arg:''}
];

var AppWaveform = React.createClass({


    componentWillMount: function() {

    },


// dsoCtrl=dsoDriver.DsoNet(3000,'172.16.5.68');
// dsoCtrl.tcpConnect(function(e){
//     console.log(e);
//     if(e==undefined){
//         console.log('reloadState');
//         dsoCtrl.reloadState(function(e){
//             console.log('reload done');
//             console.log(dsoCtrl);

//         });
//     }
//     else{
//         console.log('no reload');
//     }
// });






    componentDidMount: function() {
        var dsoCtrl=this.props.dsoctrl;
        // dsoCtrl=dsoDriver.DsoNet(3000,'172.16.5.68');
        console.log(this.props);
        this.props.dsoctrl.connect(function(e){
            ipc.send('asynchronous-message', 'ping');
        });
        ipc.on('picture-data', function(res) {
            dsoCtrl.getRawdata('ch1',function(err,data){

                var j,i,k,len;
                var rawAB=new ArrayBuffer(data.length);
                var vArray=new Uint8Array(rawAB);
                for(i=0,len=data.length;i<len;i++){
                    vArray[i]=data[i];
                }

                var raw=new DataView(rawAB);
                var chRaw=[];
                console.log('len='+len);



                for(i=0,j=0,len=data.length/2;i<len;i++,j+=2){
                    chRaw.push([i,raw.getInt16(j)]);
                    // console.log(j);
                }


                $.plot('.main-plot', [chRaw]);
                setTimeout(function(){
                 ipc.send('asynchronous-message', 'ping');
                }, 50);

            });
        });


        // var d1 = [];
        // for (var i = 0; i < 14; i += 0.5) {
        //     d1.push([i, Math.sin(i)]);
        // }

        // var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

        // // A null signifies separate line segments

        // var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];

        // $.plot('.main-plot', [ d1, d2, d3 ]);







        // var canvas=$('.screen-canvas')[0];
        // var ctx = canvas.getContext('2d');
        // var cnt=0;


        // dsoCtrl.connect(function(e){
        //     ipc.send('asynchronous-message', 'ping');
        // });
        // ipc.on('picture-data', function(res) {
        //     dsoCtrl.getSnapshot(function(err,data){

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
    },

    componentWillUnmount: function() {

    },

    render: function() {
        var plotStyle={
            width:'800px',
            height:'480'
        };
        return (
            <div>
                <div className='main-plot' style={plotStyle} ></div>
                <canvas className='screen-canvas' id='tutorial' width='800' height='480'></canvas>
            </div>
        );
    },
});

module.exports = AppWaveform;
