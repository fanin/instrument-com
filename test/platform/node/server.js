var fs      = require('fs');
var express = require('express');
var multer  = require('multer');
var app     = express();
var port    =   process.env.PORT || 8088;
var bodyParser = require('body-parser');
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



// setInterval(function(){
//     console.log("show net device");
//     console.log(dsoDriver.showNetDevice());
// },1000);

// dsoCtrl= dsoDriver.DsoNet(3000,'172.16.5.68');

// dsoCtrl.connect()
//     .then(dsoCtrl.run)
//     .then(function(){
//         dsoCtrl.enableCh('ch2');
//     })
//     .then(function(){
//         dsoCtrl.getRawdata('ch1')
//             .then(function(data){
//             console.log(data);
//             });
//     })
//     .then(function(){
//         dsoCtrl.getHorizontal()
//             .then(function(data){
//             console.log(data);
//             });
//     })
//     .then(function(){
//         dsoCtrl.getVertical('ch1')
//             .then(function(data){
//             console.log(data);
//             });
//     })
//     .then(function(){
//         dsoCtrl.getSnapshot()
//             .then(function(data){
//             console.log(data);
//             });
//     })
//     .then(dsoCtrl.syncConfig)
//     .then(function(){
//         dsoCtrl.supportedMeasType()
//             .then(function(data){
//             console.log(data);
//             });
//     })
//     .then(function(){
//         dsoCtrl.setMeas({ch:'meas1',src1:'ch1',src2:'ch2',type:'MEAN'})
//     })
//     .then(function(){
//         dsoCtrl.getMeas('meas1')
//             .then(function(data){
//             console.log(data);
//             });
//     })
//     .then(dsoCtrl.stop)
//     .then(function(){
//         dsoCtrl.disableCh('ch2');
//     });

// dsoCtrl=dsoDriver.DsoUSB(0x2184,0x003f);
// dsoUsb=dsoDriver.DsoUSB(0x2204,0x098f);


// get an instance of router
var router = express.Router();

router.use(function(req,res,next){
    console.log(req.method,req.url);
    next();
});

// ROUTES
// ==============================================
app.use('/', router);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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


app.route('/dso')
    .get(function(req,res){
        res.send(dsoDriver.showNetDevice());

        console.log('get available net device');
    })
    .post(function(req,res){
        console.log("port");
        console.log(req.body.port);
        console.log("addr");
        console.log(req.body.addr);
        dsoCtrl=dsoDriver.DsoNet(req.body.port,req.body.addr);
        console.log(dsoCtrl);
        dsoCtrl.connect().then(function(){
            res.send({id: "gds2102e"});
        });


        console.log('post new instaence');
    });
app.route('/dso/screen')
    .get(function(req,res){
        console.log(req.query);
        var dso=req.query.dsoctrl;
        console.log(dso);
        dsoCtrl.getSnapshot().then(function(data){
            res.send({data:data});
        });
        console.log('get snapshot');
    });

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
app.listen(port);
console.log('Server start on port' + port);


