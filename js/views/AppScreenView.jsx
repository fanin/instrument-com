'use strict';

var msoActionCreators = require('../actions/mso-consoleActionCreators');
var msoStore          = require('../stores/mso-consoleStore');
var AppWaveform       = require('./AppWaveform.jsx');
var AppDoubleKnob       = require('./AppDoubleKnob.jsx');
var dsoCtrl=null;

var AppScreenViewer = React.createClass({
    getInitialState: function() {
        return {
            RunStopState:'Run',
            RunStopButtonClass:'mini ui compact positive circular button RunStopButton',
            RunStopIconClass:'mini ui inverted red compact circular icon button RunStopIcon',
            RunStopIcon:'pause icon'
        };
    },

    componentWillMount: function() {

    },

    componentDidMount: function() {
        var self = this;
        var dsoCtrl=this.props.dsoctrl;
        $('.RunStopButton,.RunStopIcon')
            .on('click', function(event) {
                console.log($(this).text());
                if(self.state.RunStopState=='Run'){
                    dsoCtrl.Stop();
                    self.setState({
                        RunStopState:'Stop',
                        RunStopButtonClass:'mini ui compact negative circular button RunStopButton',
                        RunStopIconClass:'mini ui inverted green compact circular icon button RunStopIcon',
                        RunStopIcon:'play icon'
                    });
                }
                else{
                    dsoCtrl.Run();
                    self.setState({
                        RunStopState:'Run',
                        RunStopButtonClass:'mini ui compact positive circular button RunStopButton',
                        RunStopIconClass:'mini ui inverted red compact circular icon button RunStopIcon',
                        RunStopIcon:'pause icon'
                    });
                }
            });
        $('.Autoset')
            .on('click', function(event) {
                dsoCtrl.Autoset();
                self.setState({
                    RunStopState:'Run',
                    RunStopButtonClass:'mini ui compact positive circular button RunStopButton',
                    RunStopIconClass:'mini ui inverted red compact circular icon button RunStopIcon',
                    RunStopIcon:'pause icon'
                });
            });
        $('.Single')
            .on('click', function(event) {
                dsoCtrl.Single();
                self.setState({
                    RunStopState:'Stop',
                    RunStopButtonClass:'mini ui compact negative circular button RunStopButton',
                    RunStopIconClass:'mini ui inverted green compact circular icon button RunStopIcon',
                    RunStopIcon:'play icon'
                });
            });

    },

    componentWillUnmount: function() {

    },
    render: function() {
        return (
            <div>
                    <div className='ui attached fitted basic segment'>
                        <div className='ui grid'>
                            <div className='twelve wide column'>
                                    <AppWaveform dsoctrl={this.props.dsoctrl}/>
                            </div>
                            <div className='two wide column'>

                                    <div className='ui fitted segment'></div>
                                    <div className={this.state.RunStopButtonClass}>
                                      {this.state.RunStopState}
                                    </div>
                                    <div className={this.state.RunStopIconClass}>
                                      <i className={this.state.RunStopIcon}></i>
                                    </div>

                                    <div className='ui fitted segment'></div>
                                    <div className='mini ui fluid circular button Autoset'>Autoset</div>
                                    <div className='ui fitted segment'></div>
                                    <div className='mini ui fluid circular button Single'>Single</div>
                            </div>
                        </div>
                    </div>

                    <div className='ui attached fitted basic segment'>
                        <div className ='ui grid'>

                            <div className=' left floated two wide column' >

                                        <AppDoubleKnob ch_class='ui mini inverted yellow circular button ch_button CH1' chnum='CH1' fgcolor='#f5f500' bgcolor='#222' KnobAligned='VERTICAL_ALIGNED' />

                            </div>



                            <div className='left floated two wide column' >

                                    <AppDoubleKnob ch_class='ui mini inverted blue circular button ch_button CH2' chnum='CH2' fgcolor='#2fd6f5' bgcolor='#222' KnobAligned='VERTICAL_ALIGNED'/>

                            </div>

                            <div className='right floated two wide column' >
                                    <AppDoubleKnob ch_class='ui mini inverted circular button hor_button HOR' chnum='HOR' fgcolor='#ffffff' bgcolor='#222' KnobAligned='VERTICAL_ALIGNED'/>
                            </div>

                        </div>
                    </div>


            </div>
        );
    },
});

module.exports = AppScreenViewer;
