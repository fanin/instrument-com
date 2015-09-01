'use strict';

var msoActionCreators = require("../actions/mso-consoleActionCreators");
var msoStore          = require("../stores/mso-consoleStore");
var AppDoubleKnob       = require("./AppDoubleKnob.jsx");
var AppMathTab      = require("./AppMathTab.jsx");

var domAction=false,registerAction=false;
var self;
var mathTab;
var AppMathMenu = React.createClass({


    getInitialState: function() {
        return {
            mathTabClass: "active item MATH_tab",
            fftTabClass:"item FFT_tab",
            advTabClass:"item AdvMath_tab",
        };
    },

    componentWillMount: function() {
    },

    componentDidMount: function() {
      //var self =this;
      $('.tabular.menu.math')
          .on('click', function(event) {
              if($(event.target).hasClass( "MATH_tab" )){
                  $('.math_tab').show();
                  self.setState({ mathTabClass: "active item MATH_tab",
                                  fftTabClass:"item FFT_tab",
                                  advTabClass:"item AdvMath_tab",
                                });
                  //console.log($(event.target));
              }else if($(event.target).hasClass( "FFT_tab" )){
                  $('.math_tab').hide();
                  self.setState({ mathTabClass: "item MATH_tab",
                                  fftTabClass:"active item FFT_tab",
                                  advTabClass:"item AdvMath_tab",
                                });
              }else{
                  $('.math_tab').hide();
                  self.setState({ mathTabClass: "item MATH_tab",
                                  fftTabClass:"item FFT_tab",
                                  advTabClass:"active item AdvMath_tab",
                                });
              }
          });
    },
    componentWillUpdate: function(){
    },
    componentDidUpdate: function(){

    },
    componentWillUnmount: function() {

    },

    render: function() {
      self=this;
      mathTab=<AppMathTab />;
      // console.log("this.props.menuState="+this.props.menuState);
          return (
            <div>
                    <div className="ui segment">

                        <h2 className="ui blue header">
                          <i className="options icon "></i>
                          <div className="content">
                            Math
                          </div>
                        </h2>
                        <div className="ui  top attached small tabular menu math">
                          <a className={this.state.mathTabClass}>
                            Math
                          </a>
                          <a className={this.state.fftTabClass}>
                            FFT
                          </a>
                          <a className={this.state.advTabClass}>
                            Advanced Math
                          </a>
                        </div>

                        <div className="ui  bottom attached segment math_tab">
                          {mathTab}
                        </div>
                    </div>

            </div>

        );

    },
});

module.exports = AppMathMenu;
