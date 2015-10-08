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
    },
    knobClassInfo ={
        CH1:"ch1Knob",
        CH2:"ch2Knob",
        CH3:"ch3Knob",
        CH4:"ch4Knob",
        HOR:"horKnob"
    };
var self;
var AppDoubleKnob = React.createClass({
    getInitialState: function() {
        return {
            keyValue: 0,
            ChOnOff:'',
            unitIcon:'users icon'
        };
    },

    componentWillMount: function() {

    },

    inputChangePos: function(e){
        console.log(e.nativeEvent.target.value);
        console.log(e.target.id);

        // $('#ch1_position').value = e.nativeEvent.target.value.toString();
        var inputId ='#'+ e.target.id;
        var val = parseFloat($(inputId).val());

        // $('#CH1').val(100);
        console.log($(inputId).val());
        console.log(inputId);
        $(inputId)[0].step = 10;
        $(inputId).val(val);
        console.log($(inputId));
    },
    inputChangeScal:function(e){
        var inputId ='#'+ e.target.id;
        var val = parseFloat($(inputId).val());

        console.log(e.nativeEvent.target.value);
        console.log(inputId);
        console.log();
        if(val > 12){
            $(inputId).val(12);
        }
        else if(val < 0){
            $(inputId).val(0);
        }
        $('.shape.scale').shape('flip down');
    },
    mouseWheel: function(e){
        console.log(e);
    },
    componentDidMount: function() {
        self = this;


        $('.dropdown.scale')
            .dropdown({
                on: 'hover'
            });

        // $('.ui.menu .dropdown')
        //       .dropdown({
        //         delay: {
        //           show  : 100,
        //           hide  : 300,
        //           touch : 50
        //         },
        //         transition: 'drop',
        //         // onChange:function(value, text, $choice){
        //         //   console.log(value);
        //         // },
        //         on: 'hover'
        //       });
        //   });


        // $('.ch1Knob').knob({
        //     'min': 0,
        //     'max': 50,
        //     'step':2,
        //     'width':50,
        //     'angleArc':180,
        //     'angleOffset':90,

        //     'thickness': '.5',
        //     'release': function (v) {
        //         console.log('release value = '+v);
        //      },
        //     'change' : function (v) {
        //         console.log('knob value = '+v);

        //     }
        // });
        // $('.toggle.checkbox')
        //     .checkbox({
        //         onChecked: function(){
        //           console.log("toggle.checkbox onChecked");

        //         },
        //         onUnchecked: function(){
        //           console.log("toggle.checkbox onUnChecked");

        //         },
        //         onChange: function(){
        //           console.log("toggle.checkbox onChange");
        //         }
        //     });
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
        //     left:"0px
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
        // var verInfiniteKnobClear={
        //     position:"absolute",
        //     left:"30px",
        //     top:"30px"
        // },
        // verKnobClearl={
        //     position:"absolute",
        //     left:"25px",
        //     top:"25px"
        // },
        // horInfiniteKnobClear={
        //     position:"absolute",
        //     left:"30px",
        //     top:"30px"
        // },
        // horKnobClear={
        //     position:"absolute",
        //     left:"25px",
        //     top:"25px"
        // };


        if(this.props.chnum !="")
        {
            // var ScaleKnobStyle=DownStyle;
            // var PosKnobStyle=UpStyle;
            // var KnobGroupStyle=VerticalKnobStyle;
            var divDiretion="ui horizontal  divider";


            // var infiniteKnob_clear=verInfiniteKnobClear;
            // var Knob_clear=verKnobClearl;
            // var positionP=iKnobStepPclass[this.props.chnum];
            // var positionM=iKnobStepMclass[this.props.chnum];
            // var scaleP=KnobStepPclass[this.props.chnum];
            var scaleM=KnobStepMclass[this.props.chnum];
            var knobClass = knobClassInfo[this.props.chnum];

        }
        else
        {
            // var ScaleKnobStyle=LeftStyle;
            // var PosKnobStyle=RightStyle;
            // var KnobGroupStyle=horKnobStyle;
            var divDiretion="ui none";

            // var infiniteKnob_clear=horInfiniteKnobClear;
            // var Knob_clear=horKnobClear;
            // var positionP="mini ui icon button";
            // var positionM="mini ui icon button";
            // var scaleP="mini ui icon button";
            // var scaleM="mini ui icon button";
        }
        var moadlMenu=<AppChannelMenu ch_class={this.props.ch_class} chnum={this.props.chnum} diviClass={divDiretion}/>;
        console.log('render bouble knob');
                        // <div className="ui fluid search selection dropdown scale">
                        //   <input type="hidden" name="country" />
                        //   <i className="dropdown icon"></i>
                        //   <div className="default text">Select Country</div>
                        //   <div className="menu">
                        //       <div className="item" data-value="af"><i className="af flag"></i>Afghanistan</div>
                        //       <div className="item" data-value="ax"><i className="ax flag"></i>Aland Islands</div>
                        //       <div className="item" data-value="al"><i className="al flag"></i>Albania</div>
                        //       <div className="item" data-value="dz"><i className="dz flag"></i>Algeria</div>
                        //   </div>
                        // </div>
        return (
                <div >

                        <div className = "ui mini input">
                            <input id={this.props.chnum+'pos'} type = "number"  name="h_position" onWheel={this.inputChangePos} onInput={this.inputChangePos} defaultValue='0' style={{width:"80"} }/>
                        </div>

                        <div className="ui left pointing label">
                            Position
                        </div>
                        {moadlMenu}
                        <div className = "ui mini input">
                            <input id={this.props.chnum+'scale'} type = "number"  name="v_scale" onWheel={this.inputChangeScal} onInput={this.inputChangeScal} defaultValue='0' style={{width:"80"} } />
                        </div>

                        <div className="ui left pointing label">
                            Scale
                        </div>


                </div>
        );
    },
});

module.exports = AppDoubleKnob;
