# instrument-com
Support many methods to communication with instrument through ethernet or usb

Now it only support GWINSTE's GDS2000E series

# Example

```js
var dsoDriver = require('./index.js');

// create new instance and bind to ethernet interface with ip:172.16.5.68 and port:3000
dsoCtrl=dsoDriver.DsoNet(3000,'172.16.5.68');

// connect to instrument , connect must be done before any operation.
dsoCtrl.connect().then(dsoCtrl.run);

```


# API
* [showNetDevice()](#Show avaiable device)
* [DsoNet(port , address)]
* [DsoUSB(vid,pid)]
# Methods
* [.connect()]
* [.closeDev()]
* 

## Show avaiable device 



