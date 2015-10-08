'use strict';

var msoActionCreators = require("../actions/mso-consoleActionCreators");
var msoStore          = require("../stores/mso-consoleStore");
var AppDoubleKnob       = require('./AppDoubleKnob.jsx');
var chButtonClass = {
    CH1:'ui mini inverted yellow circular button ch_button CH1',
    CH2:'ui mini inverted blue circular button ch_button CH2',
    CH3:'ui mini inverted red circular button ch_button CH3',
    CH4:'ui mini inverted green circular button ch_button CH4'
}
var AppChCtrl = React.createClass({
    getInitialState: function() {
        return {
          chID:'CH1',
          buttonClass:chButtonClass['CH1'],
          chCtrlStyle:{display:'none'},
        };
    },

    componentWillMount: function() {

    },
    componentDidMount: function() {
        var self = this;
        $('.chCtrlDev')
            .on('click',function(event){
                var chid = event.target.innerHTML;
                console.log(event.target.innerHTML);

                if(self.state.chCtrlStyle.display === 'none'){
                    self.setState({
                        chID:chid,
                        buttonClass:chButtonClass[chid],
                        chCtrlStyle:{display:''},
                    });
                }
                else{
                    if(chid === self.state.chID){
                        self.setState({
                            chCtrlStyle:{display:'none'}
                        });
                    }
                    else{
                        self.setState({
                            chID:chid,
                            buttonClass:chButtonClass[chid],
                            chCtrlStyle:{display:''},
                        });
                    }
                }

            });

    },

    componentWillUnmount: function() {

    },
    render: function() {
        return (
          <div>
            <div className='circular ui icon yellow button chCtrlDev'>
              CH1
            </div>

            <div className='circular ui icon blue button chCtrlDev'>
              CH2
            </div>
            <div className='circular ui icon red button chCtrlDev'>
              CH3
            </div>

            <div className='circular ui icon green button chCtrlDev'>
              CH4
            </div>
            <p></p>
            <div className='circular ui icon green button horCtrlDev'>
              HOR
            </div>
            <div style={this.state.chCtrlStyle}>
              <div className='ui segment'>
                <div className='column' >
                    <AppDoubleKnob ch_class={this.state.buttonClass} chnum={this.state.chID} fgcolor='#f5f500' bgcolor='#222' KnobAligned='VERTICAL_ALIGNED' />
                </div>
              </div>
            </div>
          </div>
        );
    },
});
module.exports = AppChCtrl;
