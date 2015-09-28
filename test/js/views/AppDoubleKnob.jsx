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

    inputChange: function(e){
        console.log(e.nativeEvent.target.value);
        console.log(e.target);
        // $('#ch1_position').value = e.nativeEvent.target.value.toString();
        console.log($('#ch1_position'));

    },
    mouseWheel: function(e){
        console.log(e);
    },
    componentDidMount: function() {
        // $('.modal.ch_set').modal({offset: 0});
        // $('.ch_button').click(function (){
        //   $('.modal.ch_set').modal('show');

        // });
        // $('.hor_button').click(function (){
        //   $('.modal.hor_set').modal('show');

        // });

        // $('.ch1_position_class')
        //     .on('wheel', function(event) {
        //         console.log("on wheel !");
        //         console.log(event);
        //         console.log(event.currentTarget.value);

        //     })
        $('.vScale').on('click',function(e){
            console.log("click");
            console.log(e);
        })
        $('.vScale')
            .on('wheel', function(event) {
                console.log("on wheel !");
                console.log(event);
                console.log(event.currentTarget.value);

            })
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

                        <div className = "ui mini right labeled input">
                          <input className='ch1_position_class' id='ch1_position' type = "number"  name="v_position" onWheel={this.inputChange} onInput={this.inputChange} defaultValue="5" style={{width:"80"} } />
                          <div className = "ui basic label">
                            S
                          </div>
                        </div>

                        {moadlMenu}

                        <div className="ui small vertical menu" style={{width:"100"}} >
                          <div className="ui dropdown item">
                            100mV

                            <div className="menu">
                              <a className="item vScale">Electronics</a>
                              <a className="item vScale">Automotive</a>
                            </div>
                          </div>
                        </div>
                </div>
        );
    },
});

module.exports = AppDoubleKnob;
