'use strict';

var msoActionCreators = require("../actions/mso-consoleActionCreators");
var msoStore          = require("../stores/mso-consoleStore");
var AppKnob           = require("./AppKnobCtrl.jsx");
var AppChannelMenu    = require("./AppChannelMenu.jsx");
var KnobStepPclass ={
        CH1:"mini ui inverted yellow icon button positionCH1Plus",
        CH2:"mini ui inverted blue icon button positionCH2Plus",
        CH3:"mini ui inverted red icon button positionCH3Plus",
        CH4:"mini ui inverted green icon button positionCH4Plus",
        HOR:"mini ui inverted icon button position HorPlus"
    },
    KnobStepMclass ={
        CH1:"mini ui inverted yellow icon button positionCH1Minus",
        CH2:"mini ui inverted blue icon button positionCH2Minus",
        CH3:"mini ui inverted red icon button positionCH3Minus",
        CH4:"mini ui inverted green icon button positionCH4Minus",
        HOR:"mini ui inverted icon button position HorMinus"
    },
    iKnobStepPclass ={
        CH1:"mini ui inverted yellow icon button scale CH1Plus",
        CH2:"mini ui inverted blue icon button scale CH2Plus",
        CH3:"mini ui inverted red icon button scale CH3Plus",
        CH4:"mini ui inverted green icon button scale CH4Plus",
        HOR:"mini ui inverted icon button scale HorPlus"
    },
    iKnobStepMclass ={
        CH1:"mini ui inverted yellow icon button scale CH1Minus",
        CH2:"mini ui inverted blue icon button scale CH2Minus",
        CH3:"mini ui inverted red icon button scale CH3Minus",
        CH4:"mini ui inverted green icon button scale CH4Minus",
        HOR:"mini ui inverted icon button scale HorMinus"
    };
var AppDoubleKnob = React.createClass({


    componentWillMount: function() {

    },

    componentDidMount: function() {
        // $('.modal.ch_set').modal({offset: 0});
        // $('.ch_button').click(function (){
        //   $('.modal.ch_set').modal('show');

        // });
        // $('.hor_button').click(function (){
        //   $('.modal.hor_set').modal('show');

        // });
    },

    componentWillUnmount: function() {

    },

    render: function() {
        // var UpStyle={
        //     position:"relative",
        //     left:"0px",
        //     top:"0px"
        // },
        // DownStyle={
        //     position:"relative",
        //     left:"0px",
        //     top:"0px"
        // },
        // VerticalKnobStyle={
        //     position:"relative",
        //     width:"150px",
        //     margin:"0px"
        // };
        // var LeftStyle={
        //     position:"relative",
        //     left:"10px",
        //     top:"10px"
        // },
        // RightStyle={
        //     position:"relative",
        //     left:"10px",
        //     top:"10px"
        // },
        // horKnobStyle={
        //     position:"relative",
        //     width:"300px",
        //     margin:"auto"
        // };
        var verInfiniteKnobClear={
            position:"absolute",
            left:"30px",
            top:"30px"
        },
        verKnobClearl={
            position:"absolute",
            left:"25px",
            top:"25px"
        },
        horInfiniteKnobClear={
            position:"absolute",
            left:"30px",
            top:"30px"
        },
        horKnobClear={
            position:"absolute",
            left:"25px",
            top:"25px"
        };


        if(this.props.chnum !="")
        {
            // var ScaleKnobStyle=DownStyle;
            // var PosKnobStyle=UpStyle;
            // var KnobGroupStyle=VerticalKnobStyle;
            var divDiretion="ui horizontal  divider";
            var infiniteKnob_clear=verInfiniteKnobClear;
            var Knob_clear=verKnobClearl;
            var positionP=iKnobStepPclass[this.props.chnum];
            var positionM=iKnobStepMclass[this.props.chnum];
            var scaleP=KnobStepPclass[this.props.chnum];
            var scaleM=KnobStepMclass[this.props.chnum];

        }
        else
        {
            // var ScaleKnobStyle=LeftStyle;
            // var PosKnobStyle=RightStyle;
            // var KnobGroupStyle=horKnobStyle;
            var divDiretion="ui none";
            var infiniteKnob_clear=horInfiniteKnobClear;
            var Knob_clear=horKnobClear;
            var positionP="mini ui icon button";
            var positionM="mini ui icon button";
            var scaleP="mini ui icon button";
            var scaleM="mini ui icon button";
        }
        var moadlMenu=<AppChannelMenu ch_class={this.props.ch_class} chnum={this.props.chnum} diviClass={divDiretion}/>;
        return (
                <div >
                            <div className="ui mini fitted basic segment">
                                <div className={positionP}>
                                    <i className="plus icon button"></i>
                                </div>
                                <div className={positionM}>
                                    <i className="minus icon button"></i>
                                </div>
                            </div>


                            <div className="ui mini fitted basic segment">
                                <AppKnob Knob="infinite" def_value="0" angleoffset="0" anglearc="360" fgcolor={this.props.fgcolor} bgcolor={this.props.bgcolor} thickness=".3" stopper="false" displayinput="false" cursor="true" skin="tron"/>
                            <div style={infiniteKnob_clear}>
                                <div className="large circular ui  icon button">
                                  <i className="icon settings"></i>
                                </div>
                            </div>

                            </div>

                            {moadlMenu}

                            <div className="ui mini fitted basic segment">
                                <AppKnob Knob="knob" def_value="0" angleoffset="-120" anglearc="250" fgcolor={this.props.fgcolor} bgcolor={this.props.bgcolor} thickness=".3" stopper="true" displayinput="false" cursor="true" skin="none" />
                            <div style={Knob_clear}>
                                <div className="large circular ui  icon button">
                                  <i className="icon settings"></i>
                                </div>
                            </div>

                            </div>
                        <div className="ui mini fitted basic segment">
                        <div className={scaleP}>
                            <i className="plus icon button"></i>
                        </div>
                        <div className={scaleM}>
                            <i className="minus icon button"></i>
                        </div>
                        </div>
                </div>
        );
    },
});

module.exports = AppDoubleKnob;
