var fs      = require('fs');
var express = require('express');
var multer  = require('multer');
var app     = express();
var port    =   process.env.PORT || 8088;


function done(){
    console.log('done---------------------');
    console.log(dsoClinet1);
};
////////// Test TCP Socket

var dsoDriver = require('./index.js');
var dsoCtrl;

process.on('exit', function(code) {
  console.log('About to exit with code:', code);
});


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
// dsoCtrl.onSocketErr(function(e){

//     console.log('onSocketErr:'+e);
// });

// dsoCtrl.GetPort(function(e){
//     console.log(e)
// });


dsoCtrl=dsoDriver.DsoNet(3000,'172.16.5.68');
// dsoCtrl=dsoDriver.DsoUSB(0x2184,0x003f);
// dsoUsb=dsoDriver.DsoUSB(0x2204,0x098f);



dsoCtrl.connect(function(e){
    console.log('usbconnect error ='+e);
    if(e==undefined){
        console.log('reloadState');
        // dsoCtrl.getRawdata('ch1',function(err,data){
        //     console.log('get rawdata done')
        //     console.log('1=======================================');
        // });
        // dsoCtrl.getHorizontal(function(err,data){
        //     console.log('hor data');
        //     console.log(data);
        //     console.log('2=======================================');
        // });
        // dsoCtrl.getVertical('ch1',function(err,data){
        //     console.log('ver data');
        //     console.log(data);
        //     console.log('3=======================================');
        // });
        // dsoCtrl.getSnapshot(function(err,data){
        //     console.log('get snapshot done')
        //     console.log('4=======================================');
        // });
        // dsoCtrl.reloadState(function(e){
        //     console.log('reload done');
        //     // setInterval(function(){
        //     //     dsoCtrl.getSnapshot(function(err,data){
        //     //         console.log('get snapshot done')
        //     //     });
        //     // },500);
        // });
        dsoCtrl.supportedMeasType();
        dsoCtrl.setMeas({ch:'meas1',src1:'ch1',src2:'ch2',type:'MEAN'},function(e,data){
            dsoCtrl.getMeas('meas1',function(e,data){
                console.log(data);
            });
        });
    }
    else{
        console.log('no reload');
    }
});






// var dsoCtrl=function(dso){
//     this.dso=dso;
// };
// dsoCtrl.prototype.display=function(){
//     console.log('display');
// };
// var dso={name:'benny',age:'39'};
// var dsoCtrl= new dsoCtrl(dso);
// dsoCtrl.display();



// employee = function(name, age) {
//     this.name = name;
//     this.age = age;
// }

// employee.prototype.talkToYou = function talkToYou() {
//     console.log('hello I'm ' + this.name + ' I'm ' + this.age + ' years old');

// }

// var cloudio = new employee('cloudio', '27');
// cloudio.talkToYou();





// get an instance of router
var router = express.Router();

router.use(function(req,res,next){
    console.log(req.method,req.url);
    next();
});

// ROUTES
// ==============================================
app.use('/', router);
app.use(express.static(__dirname + '/'));
app.use(multer({
            dest: './uploads/',
    /*
            onFileUploadComplete: function (file) {
                                    console.log(file);
                                  }
    */
        })
);


// app.route('/')
//     .get(function(req,res){
//         console.log(__dirname);
//         fs.readFile(__dirname +'/index.html',function(err,data){
//             res.send(data);
//             //res.end();
//         })
//         console.log('route root');
//     });

// app.route('/uploads/:field/')

//     .post(function(req, res) {
//         console.log('processing');
//         console.log(req.files[req.params.field].originalname);
//         console.log(req.files[req.params.field].fieldname);
//         console.log(req.files[req.params.field].path);

//         build.setBuildFile(req.files[req.params.field].fieldname,
//                            req.files[req.params.field].path,
//                            req.files[req.params.field].originalname
//                           );
//         //res.writeHead(304);
//         res.end();
//         //res.send('processing the upload form!');
//     });
// app.route('/upg_download/:modelname')

//     .get(function(req, res) {
//         console.log('upg_download start...... modelname='+req.params.modelname);
//         fs.readFile(__dirname +'/uploads/production/'+req.params.modelname,function(err,data){
//             res.write(data);
//             res.end();
//         })

//     });
// app.route('/modelset/:modeltype')

//     .get(function(req, res) {
//         console.log('set modeltype ='+req.params.modeltype);
//         res.end();
//         build.setDsoType(req.params.modeltype);
//     });
// app.listen(port);
// console.log('Server start on port' + port);


