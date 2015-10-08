'use strict';

var msoActionCreators = require('../actions/mso-consoleActionCreators');
var msoStore          = require('../stores/mso-consoleStore');
var AppWaveform       = require('./AppWaveform.jsx');
var AppDoubleKnob       = require('./AppDoubleKnob.jsx');
var dsoCtrl=null;

var chStateClass ={
    CH1:{ON:'ui yellow circular label chState',
         OFF:'ui grey circular label chState'
        },
    CH2:{ON:'ui blue circular label chState',
         OFF:'ui grey circular label chState'
        },
    CH3:{ON:'ui red circular label chState',
         OFF:'ui grey circular label chState'
        },
    CH4:{ON:'ui green circular label chState',
         OFF:'ui grey circular label chState'
        }
}
var AppScreenViewer = React.createClass({
    getInitialState: function() {
        return {
            pause:false,
            RunStopState:'Run',
            RunStopButtonClass:'mini ui positive inverted fluid circular button RunStopButton',
            // RunStopIconClass:'mini ui inverted red compact circular icon button RunStopIcon',
            RunStopIcon:'pause icon',
            ch1State:'ON',
            ch1StateClass:'ui yellow circular label chState',
            ch2State:'OFF',
            ch2StateClass:'ui grey circular label chState',
            ch3State:'OFF',
            ch3StateClass:'ui grey circular label chState',
            ch4State:'OFF',
            ch4StateClass:'ui grey circular label chState'
        };
    },

    componentWillMount: function() {

    },
    putAjaxRequest: function(req){
        $.ajax({
            url: req.api,
            dataType: 'html',
            type: 'PUT',
            data: req.cmd,
            success: function(res){
                req.callback(null,res);
            },
            error: function(xhr, status, err) {
                console.log('error');
                req.callback(err);
            }
        });
    },
    // putRunStop:function(self){
    //     console.log('put runStop request');
    //     var cmd;
    //     if(self.state.RunStopState==='Run'){
    //         cmd= 'cmd=Stop';
    //     }
    //     else{
    //         cmd= 'cmd=Run';
    //     }
    //     $.ajax({
    //         url: '/dso/runStop',
    //         dataType: 'html',
    //         type: 'PUT',
    //         data: cmd,
    //         success: function(data) {
    //             if(self.state.RunStopState=='Run'){
    //                 // dsoCtrl.stop();
    //                 self.setState({
    //                     RunStopState:'Stop',
    //                     RunStopButtonClass:'mini ui negative fluid circular button RunStopButton',
    //                     // RunStopIconClass:'mini ui inverted green compact circular icon button RunStopIcon',
    //                     RunStopIcon:'play icon'
    //                 });
    //             }
    //             else{
    //                 // dsoCtrl.run();
    //                 self.setState({
    //                     RunStopState:'Run',
    //                     RunStopButtonClass:'mini ui positive fluid circular button RunStopButton',
    //                     // RunStopIconClass:'mini ui inverted red compact circular icon button RunStopIcon',
    //                     RunStopIcon:'pause icon'
    //                 });
    //             }
    //         },
    //         error: function(xhr, status, err) {
    //             console.log('error')
    //         }
    //     });
    // },
    componentDidMount: function() {
        var self = this;
        var dsoCtrl=this.props.dsoctrl;
        $('.RunStopButton,.RunStopIcon')
            .on('click', function(event) {
                console.log($(this).text());
                console.log(self.props.dsoctrl);

                self.putAjaxRequest({
                    api:'/dso/runStop',
                    cmd: (self.state.RunStopState==='Run')?'cmd=Stop':'cmd=Run',
                    callback:function(data){
                        if(self.state.RunStopState==='Run'){
                            self.setState({
                                pause:false,
                                RunStopState:'Stop',
                                RunStopButtonClass:'mini ui negative inverted fluid circular button RunStopButton',
                                // RunStopIconClass:'mini ui inverted green compact circular icon button RunStopIcon',
                                RunStopIcon:'play icon'
                            });
                        }
                        else{
                            self.setState({
                                pause:false,
                                RunStopState:'Run',
                                RunStopButtonClass:'mini ui positive inverted fluid circular button RunStopButton',
                                // RunStopIconClass:'mini ui inverted red compact circular icon button RunStopIcon',
                                RunStopIcon:'pause icon'
                            });
                        }
                    }
                });

            });
        $('.Autoset')
            .on('click', function(event) {
                self.setState({pause:true});
                setTimeout(function(){
                    self.putAjaxRequest({
                        api:'/dso/autoset',
                        cmd: 'autoset',
                        callback:function(data){
                             self.setState({
                                pause:false,
                                RunStopState:'Run',
                                RunStopButtonClass:'mini ui positive fluid circular button RunStopButton',
                                // RunStopIconClass:'mini ui inverted red compact circular icon button RunStopIcon',
                                RunStopIcon:'pause icon'
                            });
                        }
                    });
                },2000);
            });
        $('.Single')
            .on('click', function(event) {
                self.putAjaxRequest({
                    api:'/dso/single',
                    cmd:'single',
                    callback:function(data){
                        self.setState({
                            pause:false,
                            RunStopState:'Stop',
                            RunStopButtonClass:'mini ui negative fluid circular button RunStopButton',
                            // RunStopIconClass:'mini ui inverted green compact circular icon button RunStopIcon',
                            RunStopIcon:'play icon'
                        });
                    }
                });
            });
        $('.chState')
            .on('click',function(event){
                var chid = event.target.innerHTML;
                var state,stateClass;
                var cmd;
                console.log(chid);
                switch(chid){
                    case '1':
                            if(self.state.ch1State === 'ON'){
                                state = 'OFF';
                                stateClass = chStateClass['CH1'].OFF;
                                cmd = 'ch=CH1&state=OFF';
                            }
                            else{
                                state = 'ON';
                                stateClass = chStateClass['CH1'].ON;
                                cmd = 'ch=CH1&state=ON';
                            }
                            self.putAjaxRequest({
                                api:'/dso/chstate',
                                cmd:cmd,
                                callback:function(data){
                                    self.setState({
                                        ch1State:state,
                                        ch1StateClass:stateClass
                                    });
                                }
                            });
                            break;
                    case '2':
                            if(self.state.ch2State === 'ON'){
                                state = 'OFF';
                                stateClass = chStateClass['CH2'].OFF;
                                cmd = 'ch=CH2&state=OFF';
                            }
                            else{
                                state = 'ON';
                                stateClass = chStateClass['CH2'].ON;
                                cmd = 'ch=CH2&state=ON';
                            }
                            self.putAjaxRequest({
                                api:'/dso/chstate',
                                cmd:cmd,
                                callback:function(data){
                                    self.setState({
                                        ch2State:state,
                                        ch2StateClass:stateClass
                                    });
                                }
                            });
                            break;
                    case '3':
                            if(self.state.ch1State === 'ON'){
                                state = 'OFF';
                                stateClass = chStateClass['CH3'].OFF;
                                cmd = 'ch=CH3&state=OFF';
                            }
                            else{
                                state = 'ON';
                                stateClass = chStateClass['CH3'].ON;
                                cmd = 'ch=CH3&state=ON';
                            }
                            self.putAjaxRequest({
                                api:'/dso/chstate',
                                cmd:cmd,
                                callback:function(data){
                                    self.setState({
                                        ch3State:state,
                                        ch3StateClass:stateClass
                                    });
                                }
                            });
                            break;
                    case '4':
                            if(self.state.ch1State === 'ON'){
                                state = 'OFF';
                                stateClass = chStateClass['CH4'].OFF;
                                cmd = 'ch=CH4&state=OFF';
                            }
                            else{
                                state = 'ON';
                                stateClass = chStateClass['CH4'].ON;
                                cmd = 'ch=CH4&state=ON';
                            }
                            self.putAjaxRequest({
                                api:'/dso/chstate',
                                cmd:cmd,
                                callback:function(data){
                                    self.setState({
                                        ch4State:state,
                                        ch4StateClass:stateClass
                                    });
                                }
                            });
                            break;

                }

            });
    },

    componentWillUnmount: function() {

    },
    render: function() {

                    //         <div className='ui attached basic segment'>
                    //     <div className ='ui grid'>
                    //     <div className ='seven column row'>
                    //         <div className='column' >
                    //             <AppDoubleKnob ch_class='ui mini inverted yellow circular button ch_button CH1' chnum='CH1' fgcolor='#f5f500' bgcolor='#222' KnobAligned='VERTICAL_ALIGNED' />
                    //         </div>

                    //         <div className='column' >
                    //             <AppDoubleKnob ch_class='ui mini inverted blue circular button ch_button CH2' chnum='CH2' fgcolor='#2fd6f5' bgcolor='#222' KnobAligned='VERTICAL_ALIGNED'/>
                    //         </div>

                    //         <div className='right floated column' >
                    //             <AppDoubleKnob ch_class='ui mini inverted circular button hor_button HOR' chnum='HOR' fgcolor='#ffffff' bgcolor='#222' KnobAligned='VERTICAL_ALIGNED'/>
                    //         </div>
                    //     </div>
                    //     </div>
                    // </div>
        return (
            <div>

                    <div className='ui attached fitted basic segment'>
                        <div className='ui grid'>
                            <div className='left floated ten wide column'>
                                    <AppWaveform dsoctrl={this.props.dsoctrl} pause={this.state.pause}/>
                            </div>
                            <div className='right floated two wide column '>

                                    <div className={this.state.RunStopButtonClass}>
                                      {this.state.RunStopState}
                                    </div>
                                    <p></p>
                                    <div className='ui mini fluid circular brown inverted button Autoset'>Autoset</div>
                                    <p></p>
                                    <div className='ui mini fluid circular brown inverted button Single'>Single</div>


                            </div>

                        </div>
                    </div>

                        <a className={this.state.ch1StateClass}>1</a>
                        <a className={this.state.ch2StateClass}>2</a>
                        <a className={this.state.ch3StateClass}>3</a>
                        <a className={this.state.ch4StateClass}>4</a>

                    <div className='ui segment'>
                        <p>按 Ch1 </p>
                        <p>調整垂直刻度</p>
                        <p>調整水平刻度</p>
                    </div>

                    <div className='ui segment'>
                        <div className='ui button'>我有問題</div>
                    </div>



            </div>
        );
    },
});

module.exports = AppScreenViewer;
