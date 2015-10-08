'use strict';

var msoActionCreators = require("../actions/mso-consoleActionCreators");
var msoStore          = require("../stores/mso-consoleStore");

var AppKnob = React.createClass({


    componentWillMount: function() {

    },

    componentDidMount: function() {
        //var knobCalss='.'+this.props.Knob;
        var self=this;

        $('.knob').knob({
            min:0,
            max:24,
            // bgColor:"#222",
            // fgColor:"#ffec03",
            width:"70",
            height:"70",
            change : function (v,cv) {
                if(v > cv){
                    if(up){
                        decr();
                        up=0;
                    }else{up=1;down=0;}
                } else {
                    if(v < cv){
                        if(down){
                            incr();
                            down=0;
                        }else{down=1;up=0;}
                    }
                }
                v = cv;

            },
            release : function (value) {
                //console.log(this.$.attr('value'));
                console.log("release : " + value);
            },
            cancel : function () {
                console.log("cancel : ", this);
            },
            /*format : function (value) {
                return value + '%';
            },*/
            draw : function () {

                // "tron" case
                if(this.$.data('skin') == 'tron') {

                    this.cursorExt = 0.3;

                    var a = this.arc(this.cv)  // Arc
                        , pa                   // Previous arc
                        , r = 1;

                    this.g.lineWidth = this.lineWidth;

                    if (this.o.displayPrevious) {
                        pa = this.arc(this.v);
                        this.g.beginPath();
                        this.g.strokeStyle = this.pColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                        this.g.stroke();
                    }

                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                    this.g.stroke();

                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();

                    return false;
                }
            }
        });
        // Example of infinite knob, iPod click wheel
                var v, up=0,down=0,i=0
                    ,$idir = $("div.idir")
                    ,$ival = $("div.ival")
                    ,incr = function() { i++; $idir.show().html("+").fadeOut(); $ival.html(i); }
                    ,decr = function() { i--; $idir.show().html("-").fadeOut(); $ival.html(i); };
                $(".infinite").knob(
                                    {
                                    min : 0
                                    ,max : 20
                                    ,step : 3
                                    ,width:"100"
                                    ,height:"100",
                                    change : function (v) {
                                                    // if(v > this.cv){
                                                    //     if(up){
                                                    //         decr();
                                                    //         up=0;
                                                    //     }else{up=1;down=0;}
                                                    // } else {
                                                    //     if(v < this.cv){
                                                    //         if(down){
                                                    //             incr();
                                                    //             down=0;
                                                    //         }else{down=1;up=0;}
                                                    //     }
                                                    // }
                                                    // v = this.cv;
                                                    console.log("current value="+this.cv);
                                                    console.log("nest value="+v);
                                                },
                                    draw : function () {

                                            // "tron" case
                                            if(this.$.data('skin') == 'tron') {

                                                this.cursorExt = 0.3;

                                                var a = this.arc(this.cv)  // Arc
                                                    , pa                   // Previous arc
                                                    , r = 1;

                                                this.g.lineWidth = this.lineWidth;

                                                if (this.o.displayPrevious) {
                                                    pa = this.arc(this.v);
                                                    this.g.beginPath();
                                                    this.g.strokeStyle = this.pColor;
                                                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                                                    this.g.stroke();
                                                }

                                                this.g.beginPath();
                                                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                                                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                                                this.g.stroke();

                                                this.g.lineWidth = 2;
                                                this.g.beginPath();
                                                this.g.strokeStyle = this.o.fgColor;
                                                this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                                                this.g.stroke();

                                                return false;
                                            }
                                        }

                                    });

    },

    componentWillUnmount: function() {

    },

    render: function() {
        return (

                <div>
                    <input className={this.props.Knob} value={this.props.def_value} data-angleoffset={this.props.angleoffset}
                        data-anglearc={this.props.anglearc}  data-fgcolor={this.props.fgcolor}
                        data-bgcolor={this.props.bgcolor} data-thickness={this.props.thickness} data-stopper={this.props.stopper}
                        data-displayinput={this.props.displayinput} data-cursor={this.props.cursor} data-skin={this.props.skin}/>

                </div>
        );
    },
});

module.exports = AppKnob;
