var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var fs = require('fs');


var dsoClinet = require('./index.js');

var dispTestCmd=[
    {prop:"DispOut",arg:""}
];




// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.


app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1600, height: 1200});


  // and load the index.html of the app.

  //if(have real dso device)
        // dsoClient=dsoCtrl.createClient(3000,"172.16.5.68",function(){
        //   mainWindow.loadUrl('file://' + __dirname + '/index.html');
        //   //console.log(dsoClient);
        // });
        // ipc.on('asynchronous-message', function(event, arg) {
        //   start=new Date();
        //   console.log("send display:out at time "+start.getTime());
        //   // console.log(arg);  // prints "ping"

        //   dsoClient.sys.prop.get(dispTestCmd[0].prop,dispTestCmd[0].arg,function(){
        //     var tMeas=new Date();
        //     console.log("send ipc at time="+tMeas.getTime());
        //     //mainWindow.webContents.send('screen-data', dsoClient.sys.dispData);
        //     event.sender.send('screen-data', dsoClient.sys.dispData);

        //   });
        // });
  //else{
        // var pictData=fs.readFileSync('./img/DS0001.BMP');
        // console.log("data length="+pictData.length);
        // pictData=pictData.slice(54,pictData.length);
        mainWindow.loadUrl('file://' + __dirname + '/index.html');
        ipc.on('asynchronous-message', function(event, arg) {
            console.log(arg);  // prints "ping"
            var tMeas=new Date();
            console.log("send ipc at time="+tMeas.getTime());
            mainWindow.webContents.send('picture-data', "ping");

        });
  //}
  ////////////////////////


  // Open the devtools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
