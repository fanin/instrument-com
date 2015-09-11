# instrument-com
Support many methods to communication with instrument through ethernet or usb

Now it only support GWINSTE's GDS2000E series

# Example

```js
var dsoDriver = require('./index.js');

// create new instance and bind to ethernet interface with ip:172.16.5.68 and port:3000
dsoCtrl=dsoDriver.DsoNet(3000,'172.16.5.68');

// connect to instrument , connect must be done before any operation.
dsoCtrl.connect(function(e){
    if(e==undefined){
      //get Vertical setting 
      dsoCtrl.getVertical('ch1',function(err,data){
        console.log(data);
      });
    }
    else{
        console.log('connet error: '+e);
    }
});
```
