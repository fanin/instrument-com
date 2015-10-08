'use strict';

var msoActionCreators = require('../actions/mso-consoleActionCreators');
var msoStore          = require('../stores/mso-consoleStore');
var AppDoubleKnob     = require('./AppDoubleKnob.jsx');
var AppMathMenu       = require('./AppMathMenu.jsx');
var AppSideBar = React.createClass({
    getInitialState: function() {
        return {
            activeItem:<div className='ui mini black button math_ctrl_mini'></div>,
            mathCtrlSta:false,
            trigCtrlSta:false,
            searchCtrlSta:false,
            busCtrlSta:false,
            sideBarMenuStyle:{display:'none'},
        };
    },
    componentWillMount: function() {

    },
    mathHandler: function(){
        console.log('mathHandler');
    },
    componentDidMount: function() {
        var self=this;
        var changeSta;
        var display;
        var dsoCtrl=this.props.dsoctrl;

        $('.math_ctrl , .math_ctrl_mini')
            .on('click', function(event) {
                // console.log('math_ctrl click');
                if(self.state.mathCtrlSta==true){
                    changeSta=false;
                    display='none';
                    self.setState({activeItem:<div className='ui mini black button math_ctrl_mini'></div>});
                    $('.math_ctrl').show();
                }else{
                    changeSta=true;
                    display='inline';
                    self.setState({activeItem:<div className='ui mini circular red button math_ctrl_mini' onClick={this.mathHandler}></div>});
                    $('.math_ctrl').hide();
                }

                self.setState({
                    mathCtrlSta:changeSta,
                    trigCtrlSta:false,
                    searchCtrlSta:false,
                    busCtrlSta:false,
                    sideBarMenuStyle:{display:display}
                });
            });
        $('.search_ctrl')
            .on('click', function(event) {
                self.setState({
                    mathCtrlSta:false,
                    trigCtrlSta:false,
                    searchCtrlSta:true,
                    busCtrlSta:false
                });
            });
        $('.bus_ctrl')
            .on('click', function(event) {
                self.setState({
                    mathCtrlSta:false,
                    trigCtrlSta:false,
                    searchCtrlSta:false,
                    busCtrlSta:true
                });
            });
        $('.trig_ctrl')
            .on('click', function(event) {
                self.setState({
                    mathCtrlSta:false,
                    trigCtrlSta:true,
                    searchCtrlSta:false,
                    busCtrlSta:false
                });
            });
    },

    componentWillUnmount: function() {

    },

    render: function() {
        //this.state.activeItem=<i className='ui mini circular red button math_ctrl_mini'></i>;
        //console.log('render side bar');
        //console.log(this.props.iConGridClass);
        return (
            <div>

                    {this.state.activeItem}
                    <div style={this.state.sideBarMenuStyle}>
                        <AppMathMenu menuState={this.state.mathCtrlSta}/>
                    </div>
                    <div className={this.props.iConGridClass}>
                    <div className={this.props.iConColumeClass}>

                            <div className='circular ui icon button green trig_ctrl'>
                              <i className='text width icon'></i>
                            </div>

                            <div className='circular ui icon button red math_ctrl'>
                              <i className='line chart icon'></i>
                            </div>

                            <div className='circular ui icon button purple bus_ctrl'>
                              <i className='bold icon'></i>
                            </div>

                            <div className='circular ui icon button yellow search_ctrl'>
                              <i className='search icon'></i>
                            </div>
                    </div>
                    </div>

            </div>

        );
    },
});

module.exports = AppSideBar;
