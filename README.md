# instrument-com
Support many methods to communication with instrument through ethernet or usb

Now it only support GWINSTE's GDS2000E series

# Example
You can direct use known port and ip to create a new instance 
```js
var dsoDriver = require('./index.js');

// create a new instance and bind to ethernet interface with ip:172.16.5.68 and port:3000
var dsoCtrl=dsoDriver.DsoNet(3000,'172.16.5.68');

// connect to instrument , connect must be done before any operation.
dsoCtrl.connect().then(dsoCtrl.run);

```
Or you can browse which one you want to
```js
var dsoDriver = require('./index.js');
var dsoCtrl, i, len ;


/*
 * .showNetDevice use mdsn to browse available device
 * @return (Array Object) [ { name, port, addr } , ...]
 */
var deviceList = dsoDriver.showNetDevice();
len = deviceList.length
for( i = 0; i < len; i += 1 ){
  if(deviceList[i].name === 'GDS2102E-01' ){
    dsoCtrl = deviceList.DsoNet( deviceList[i].port, deviceList[i].addr );
    break;
  }
}

if(dsoCtrl === undefined){
  console.log('GDS2000E not available');
  process.exit(1);
}

dsoCtrl.connect().then(dsoCtrl.run);

```


# API
* [showNetDevice( )](#show-avaiable-device)
* [DsoNet( port, address )](#create-new-instance-via-ethernet)
* [DsoUSB( vid, pid )](#create-new-instance-via-usb)

## Show avaiable device  
Find all instrument-dso service using [mdns](https://www.npmjs.com/package/mdns). When DSO socket server on, you can use showNetDevice() to count available DSO,
and showNetDevice() will return an array object that store dso's name, port and ip like this
```js
[ {name:'GDS2102E-01',port:'3000', addr:'172.16.5.111'}
 ,{name:'GDS2102E-02',port:'3000', addr:'172.16.5.112'} ]
```

## Create new instance via Ethernet
Use DsoNet( port, address ) to create a new instance that contains many methods to control remote DSO via ethernet.
Remote DSO has a port and ip address to identify it self, use unique port and ip address to pass to DsoNet() and DsoNet() will return an object to control that remote DSO 
```js
var dsoCtrl=dsoDriver.DsoNet(3000,'172.16.5.68');
console.log( dsoCtrl );
```
## Create new instance via USB
You can use one of DsoNet() or dsoUSB() to create a new instance but can't use both.

# Methods
When dsoCtrl object was created, you can use many methods to control device.
* [.connect( )](#.connect)
* [.disconnect( )](#.disconnect)
* [.syncConfig( )](#.syncConfig)
* [.enableCh( ch )](#.enableCh)
* [.disableCh( ch )](#.disableCh)
* [.getHorizontal( )](#.getHorizontal)
* [.setHorizontal( )](#.setHorizontal)
* [.getVertical( ch )](#.getVertical)
* [.setVertical( ch )](#.setVertical)
* [.getEdgeTrig( )](#.getEdgeTrig)
* [.setEdgeTrig( )](#.setEdgeTrig)
* [.getSnapshot( )](#.getSnaphot)
* [.getRawdata( ch )](#.getRawdata)
* [.getMeas( mch )](#.getMeas)
* [.supportedMeasType( )](#.supportedMeasType)
* [.setMeas( { mch, src1, src2, type } ) ](#.setMeas)
* [.statisticOn( )](#.statisticOn)
* [.statisticOff( )](#.statisticOff)
* [.statisticWeight( weight )](#.statisticWeight)
* [.run( )](#.run)
* [.stop( )](#.stop)
* [.single( )](#.single)
* [.autoset( )](#.autoset)
* [.force( )](#.force)
* [.closeDev( )](#.closeDev)

##.connet
Connect to device, create a connection to the device, if return with no error, the other methods can be useed
```js
// create a new instance and bind to ethernet interface with ip:172.16.5.68 and port:3000
var dsoCtrl=dsoDriver.DsoNet(3000,'172.16.5.68');

// connect to instrument , connect must be done before any operation.
dsoCtrl.connect()
  .then(dsoCtrl.run);
```
##.disconnect
Disconnect from device, if nothing else to do, disconnect from the device.
```js
  dsoCtrl.dsiconnect().then(dsoCtrl.closeDev);
```
##.syncConfig
##.enableCh
##.disableCh
##.getHorizontal
##.setHorizontal
##.getVertical
##.setVertical
##.getEdgeTrig
##.setEdgeTrig
##.getSnaphot
##.getRawdata
##.getMeas
##.supportedMeasType
##.setMeas
##.statisticOn
##.statisticOff
##.statisticWeight
##.run
##.stop
##.single
##.autoset
##.force
##.closeDev

