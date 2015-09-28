'use strict';

var msoActionCreators = require("../actions/mso-consoleActionCreators");
var msoStore          = require("../stores/mso-consoleStore");
var AppDoubleKnob       = require("./AppDoubleKnob.jsx");
var domAction=false,registerAction=false;
var self;
var AppMathTab = React.createClass({

    getInitialState: function() {
        return {
            source1Ch:"CH1",
            source2Ch:"CH2",
            OperatorMenuStyle:{
              position : "absolute",
              left:"165px",
              top:"35px",
              display:"none",
            },
            MathOperatorStyle:{
              position : "absolute",
              left:"145px",
              top:"35px",
              display:"inline"
            },
        };
    },

    componentWillMount: function() {
    },

    componentDidMount: function() {
      //var self =this;
      $('.item.math_tab.source1')
        .on('click',function(event){
          self.setState({source1Ch:$(this).html()});
        });
      $('.item.math_tab.source2')
        .on('click',function(event){
          self.setState({source2Ch:$(this).html()});
        });
    },
    componentWillUpdate: function(){
    },
    componentDidUpdate: function(){

    },
    componentWillUnmount: function() {

    },
    mathOperatorHandler: function(){
      self.setState({OperatorMenuStyle:{
                      position : "absolute",
                      left:"165px",
                      top:"35px",
                      display:"inline",
                    }}
      );
      console.log("math operator change");
      $('#math_operator').toggle();
    },
    opClick: function(operator){
      console.log(operator);
      this.setState({OperatorMenuStyle:{
                                          position : "absolute",
                                          left:"165px",
                                          top:"35px",
                                          display:"none",
                                        }
                  })
    },
    opPlusClick: function(event){
      this.opClick("Plus");
    },
    opMinusClick: function(event){
      this.opClick("Minus");
    },
    opMultiClick: function(event){
      this.opClick("Multi");
    },
    opDiviClick: function(event){
      this.opClick("Divi");
    },
    render: function() {
      self=this;
      // console.log("this.props.menuState="+this.props.menuState);
          return (
            <div>
                <div className="ui basic segment">
                    <div className="ui two column relaxed grid">

                      <div className="column" >
                          <div className="ui  menu">
                              <div className="ui center aligned fluid dropdown item source1">
                                {this.state.source1Ch}
                                <div className="menu">
                                  <a className="item math_tab source1 ch1">CH1</a>
                                  <a className="item math_tab source1 ch2">CH2</a>
                                  <a className="item math_tab source1 ch3">CH3</a>
                                  <a className="item math_tab source1 ch4">CH4</a>
                                </div>
                              </div>
                          </div>
                      </div>


                        <div className="ui vertical divider">
                          +
                        </div>


                      <div className="column">
                          <div className="ui menu">
                              <div className="ui center aligned fluid dropdown item source2">
                                {this.state.source2Ch}
                                <div className="menu">
                                  <a className="item math_tab source2 ch1">CH1</a>
                                  <a className="item math_tab source2 ch2">CH2</a>
                                  <a className="item math_tab source2 ch3">CH3</a>
                                  <a className="item math_tab source2 ch4">CH4</a>
                                </div>
                              </div>
                          </div>
                      </div>

                    </div>
                </div>

                <AppDoubleKnob ch_class="ui mini inverted yellow circular button op_button OP" chnum="OP" fgcolor="#222" bgcolor="#ffffff" KnobAligned="HORIZONTAL_ALIGNED" />



                <div  style={this.state.OperatorMenuStyle} id="math_operator">
                  <div className="ui vertical buttons" >
                    <div className="ui button opPlus" onClick={this.opPlusClick}>+</div>
                    <div className="ui button opMinus" onClick={this.opMinusClick}>-</div>
                    <div className="ui button opMulti" onClick={this.opMultiClick}>*</div>
                    <div className="ui button opDivi" onClick={this.opDiviClick}>/</div>
                  </div>
                </div>
            </div>

        );

    },
});

module.exports = AppMathTab;
