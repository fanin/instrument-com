'use strict';

var msoActionCreators = require("../actions/mso-consoleActionCreators");
var msoStore          = require("../stores/mso-consoleStore");

var CouplingTemp={DC:"",AC:"",GND:"checked"};
var InvertTemp={ON:"",OFF:""};
var ExpandTemp={CENTER:"",GND:""};
var BWLimitTemp={FULL:"",M20:"",M100:"",M200:"checked"};
var ProbeTemp={VOLT:"",CURR:""};
var V_AttnTemp=["checked","","","","","","","","","","","","","","","","","",""];
var I_AttnTemp=["checked","","","","","","","","","","","","","","","","","",""];
var AppChannelMenu = React.createClass({
    getInitialState: function() {
        return {
            ProbeClass:"",
            ModalClass:"",
            ChCheckboxClass:"",
            CouplingCboxName:"",
            Coupling:{DC:"",AC:"",GND:"checked"},
            Invert:{ON:"",OFF:"checked"},
            Expand:{CENTER:"",GND:"checked"},
            BWLimit:{FULL:"",M20:"",M100:"",M200:"checked"},
            probeTypeCboxName:"",
            Probe:{VOLT:"checked",CURR:""},
            probeTypeV:"",
            probeTypeI:"",
            V_Attn:["","","","","","","","","","","","","","","","","","",""],
            I_Attn:["","","","","","","","","","","","","","","","","","",""],
            AccordionClass:"",
            ChOnOff: ""
        };
    },
    componentWillMount: function() {
      this.state.ProbeClass="ui left aligned circular button probe_menu "+this.props.chnum;
      this.state.ModalClass="ui modal ch_set "+this.props.chnum;
      this.state.ChCheckboxClass="ui toggle checkbox ch_onoff"+this.props.chnum;
      //this.state.CouplingCboxName="Coupling_"+this.props.chnum;
      this.state.CouplingCboxName="ui radio checkbox coupling"+this.props.chnum;
      this.state.InvertCboxName="ui radio checkbox invert"+this.props.chnum;
      this.state.ExpandCboxName="ui radio checkbox expand"+this.props.chnum;
      this.state.BwCboxName="ui radio checkbox bandwidth"+this.props.chnum;
      this.state.probeTypeCboxName="ui radio checkbox probe"+this.props.chnum;
      this.state.probeTypeSel="active step "+this.props.chnum;
      this.state.probeTypeV="active step volt"+this.props.chnum;
      this.state.probeTypeI="disabled step curr"+this.props.chnum;
      this.state.probeV_AttnCboxName="ui radio checkbox V_Attn"+this.props.chnum;
      this.state.V_Attn[0]="checked";
      this.state.probeI_AttnCboxName="ui radio checkbox I_Attn"+this.props.chnum;
      this.state.I_Attn[0]="checked";
      this.state.AccordionClass="ui accordion "+this.props.chnum;


    },
    componentDidMount: function() {
        var self=this;
        // $('.modal.ch_set').modal({
        //     offset: 0,
        //     closable: false,
        //     detachable: false
        // });
        //$('.modal.ch_set').modal('show');
        if(this.props.chnum==="")
          return;
        var modalSelector=".modal.ch_set."+this.props.chnum;
        var ChSetSelector=".ch_button."+this.props.chnum;
        var probeSelector=".probe_menu."+this.props.chnum;
        var ChOnOffSelector=".checkbox.ch_onoff"+this.props.chnum;
        var CoupCboxSelector=".checkbox.coupling"+this.props.chnum;
        var InvertCboxSelector=".checkbox.invert"+this.props.chnum;
        var ExpandCboxSelector=".checkbox.expand"+this.props.chnum;
        var BWLimitCboxSelector=".checkbox.bandwidth"+this.props.chnum;
        var ProbeTypeCboxSelector=".checkbox.probe"+this.props.chnum;
        var V_AttnCboxSelector=".checkbox.V_Attn"+this.props.chnum;
        var I_AttnCboxSelector=".checkbox.I_Attn"+this.props.chnum;
        var AccordionSelector=".accordion."+this.props.chnum;

        $(ChSetSelector).click(function (){
          $(modalSelector).modal('setting', 'closable', false);

          //$('.probe_att_select').hide();
          $(modalSelector).modal('show');

        });

        $('.submit.button').click(function(){
          $(modalSelector).modal('hide');
        });

        $(CoupCboxSelector)
          .checkbox({
            onChange: function(){
              for(var i in CouplingTemp)
                CouplingTemp[i]="";
              CouplingTemp[$(this).val()]="checked";
              //console.log(CouplingTemp);
              //console.log(event);
            },
          });
        $(InvertCboxSelector)
          .checkbox({
            onChange: function(){
              for(var i in InvertTemp)
                InvertTemp[i]="";
              InvertTemp[$(this).val()]="checked";
              //console.log(InvertTemp);
              //console.log(InvertCboxSelector);
            },

          });
        $(ExpandCboxSelector)
          .checkbox({
            onChange: function(){
              for(var i in ExpandTemp)
                ExpandTemp[i]="";
              ExpandTemp[$(this).val()]="checked";
              //console.log(ExpandTemp);
              //console.log(ExpandCboxSelector);
            },

          });
        $(BWLimitCboxSelector)
          .checkbox({
            onChange: function(){
              for(var i in BWLimitTemp)
                BWLimitTemp[i]="";
              BWLimitTemp[$(this).val()]="checked";
              //console.log(BWLimitTemp);
              //console.log(BWLimitCboxSelector);
            },

          });
        $(ProbeTypeCboxSelector)
          .checkbox({
            onChange: function(){
              var volt_class,curr_class;

              for(var i in ProbeTemp)
                ProbeTemp[i]="";
              ProbeTemp[$(this).val()]="checked";
              //console.log(ProbeTemp);
              volt_class=".step.volt"+self.props.chnum;
              curr_class=".step.curr"+self.props.chnum;
              if(ProbeTemp.VOLT=="checked"){
                //self.state.probeTypeV="active step volt "+self.props.chnum;
                //self.state.probeTypeI="disabled step curr "+self.props.chnum;
                $(volt_class).removeClass("disabled");
                $(volt_class).addClass("active");
                $(curr_class).addClass("disabled");
                $(curr_class).removeClass("active");

              }
              else{
                //self.state.probeTypeV="disabled step volt "+self.props.chnum;
                //self.state.probeTypeI="active step curr "+self.props.chnum;
                $(volt_class).removeClass("active");
                $(volt_class).addClass("disabled");
                $(curr_class).addClass("active");
                $(curr_class).removeClass("disabled");

              }
            },

          });
        $(V_AttnCboxSelector)
          .checkbox({
            onChange: function(){
              for(var i in V_AttnTemp)
                V_AttnTemp[i]="";
              V_AttnTemp[$(this).val()]="checked";
              console.log(V_AttnTemp);
              //console.log(V_AttnCboxSelector);
            },

          });
        $(I_AttnCboxSelector)
          .checkbox({
            onChange: function(){
              for(var i in I_AttnTemp)
                I_AttnTemp[i]="";
              I_AttnTemp[$(this).val()]="checked";
              console.log(I_AttnTemp);
              //console.log(V_AttnCboxSelector);
            },

          });
        // $(ChOnOffSelector)
        //   .checkbox({
        //     onChecked: function(){
        //       //console.log("ChOnOffSelector onChecked");
        //       $(modalSelector).modal('hide');
        //       $('.ch_set_content').show();
        //       $(modalSelector).modal('show');
        //     },
        //     onUnchecked: function(){
        //       //console.log("ChOnOffSelector onUnChecked");
        //         $('.ch_set_content').hide();
        //     },
        //     onChange: function(){
        //       console.log("ChOnOffSelector onChange");
        //     }
        //   });
          $(AccordionSelector)
            .accordion()
          ;

          // if(this.state.ChOnOff===''){
          //   $('.ch_set_content').hide();
          // }
        // console.log("probeselector:"+probeSelector);
        // console.log("onChange:"+CoupCboxSelector);


        // $(probeSelector).click( function(event){
        //   //console.log("toggle");
        //   $('.probe_att_select').toggle();
        // });
    },

    componentWillUnmount: function() {

    },
    // ChOnOffHandler: function(event){
    //   console.log("ChOnOffHandler");
    //   console.log(event);
    // },
    // probeHandler : function(event){
    //   console.log("toggle");
    //   $('.probe_att_select').toggle();
    // },
    render: function() {

        return (
                <div >
                  <div className={this.props.diviClass}>
                    <div className={this.props.ch_class}>
                      {this.props.chnum}
                    </div>
                  </div>
                  <div className={this.state.ModalClass}>


                              <div className="ui header">
                                <i className="options icon "></i>
                                <div className="content">
                                    <div className='ui four wide column'>
                                      <div className='ui left floated column'>
                                        Channel 1 setting
                                      </div>
                                    </div>
                                </div>
                              </div>


                            <div className="content">
                              <div className="ui tertiary attached segment ch_set_content" >
                                <div className="ui grid">
                                  <div className="ui four column row">
                                    <div className="column">
                                      <h3 className="ui aligned  header">
                                        Coupling
                                      </h3>
                                      <div className="grouped inline fields ">
                                        <div className="field">
                                          <div className={this.state.CouplingCboxName}>
                                            <input type="radio" name={this.state.CouplingCboxName} checked={this.state.Coupling.DC} value="DC"/>
                                            <label>DC</label>
                                          </div>
                                        </div>
                                        <div className="field">
                                          <div className={this.state.CouplingCboxName}>
                                            <input type="radio" name={this.state.CouplingCboxName} checked={this.state.Coupling.AC} value="AC"/>
                                            <label>AC</label>
                                          </div>
                                        </div>
                                        <div className="field">
                                          <div className={this.state.CouplingCboxName}>
                                            <input type="radio" name={this.state.CouplingCboxName} checked={this.state.Coupling.GND} value="GND"/>
                                            <label>GND</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="column">
                                      <h3 className="ui aligned  header">
                                        Inverted
                                      </h3>
                                      <div className="grouped inline fields ">
                                        <div className="field">
                                          <div className={this.state.InvertCboxName}>
                                            <input type="radio" name={this.state.InvertCboxName} checked={this.state.Invert.ON} value="ON"/>
                                            <label>On</label>
                                          </div>
                                        </div>
                                        <div className="field">
                                          <div className={this.state.InvertCboxName}>
                                            <input type="radio" name={this.state.InvertCboxName} checked={this.state.Invert.OFF} value="OFF"/>
                                            <label>Off</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="column">
                                      <h3 className="ui aligned  header">
                                        Expand
                                      </h3>
                                      <div className="grouped inline fields">
                                        <div className="field">
                                          <div className={this.state.ExpandCboxName}>
                                            <input type="radio" name={this.state.ExpandCboxName} checked={this.state.Expand.GND} value="GND"/>
                                            <label>By Ground</label>
                                          </div>
                                        </div>
                                        <div className="field">
                                          <div className={this.state.ExpandCboxName}>
                                            <input type="radio" name={this.state.ExpandCboxName} checked={this.state.Expand.CENTER} value="CENTER"/>
                                            <label>By Center</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="column">
                                      <h3 className="ui aligned  header">
                                        Bandwidth
                                      </h3>
                                      <div className="grouped inline fields">
                                        <div className="field">
                                          <div className={this.state.BwCboxName}>
                                            <input type="radio" name={this.state.BwCboxName} checked={this.state.BWLimit.FULL} value="FULL"/>
                                            <label>Full</label>
                                          </div>
                                        </div>
                                        <div className="field">
                                          <div className={this.state.BwCboxName}>
                                            <input type="radio" name={this.state.BwCboxName} checked={this.state.BWLimit.M20} value="M20"/>
                                            <label>20MHz</label>
                                          </div>
                                        </div>
                                        <div className="field">
                                          <div className={this.state.BwCboxName}>
                                            <input type="radio" name={this.state.BwCboxName} checked={this.state.BWLimit.M100} value="M100"/>
                                            <label>100MHz</label>
                                          </div>
                                        </div>
                                        <div className="field">
                                          <div className={this.state.BwCboxName}>
                                            <input type="radio" name={this.state.BwCboxName} checked={this.state.BWLimit.M200} value="M200"/>
                                            <label>200MHz</label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="ui attached segment ch_set_content">
                                <h3 className="ui center aligned header">
                                    <div className="content">
                                        Probe
                                        <div className="sub header">Manage your preferences</div>
                                    </div>

                                </h3>
                                <div className={this.state.AccordionClass}>
                                  <div className="title">
                                    <lable>Select Probe Attenuation</lable>
                                    <i className="dropdown icon"></i>
                                  </div>
                                  <div className="center content">
                                    <div className="ui steps">
                                      <div className={this.state.probeTypeSel}>

                                        <div className="grouped inline fields">
                                          <div className="field">
                                            <div className={this.state.probeTypeCboxName}>
                                              <input type="radio" name={this.state.probeTypeCboxName} checked={this.state.Probe.VOLT} value="VOLT" />
                                              <label>Voltage</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className={this.state.probeTypeV}>
                                          <h3 className="ui center aligned header">
                                            Attenuation
                                          </h3>
                                          <div className="ui grid">
                                            <div className="ui six column row">
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[0]} value="0" />
                                                      <label>0.001</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[1]} value="1"/>
                                                      <label>0.002</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[2]} value="2"/>
                                                      <label>0.005</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[3]} value="3" />
                                                      <label>0.01</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[4]} value="4"/>
                                                      <label>0.02</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[5]} value="5"/>
                                                      <label>0.05</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[6]} value="6" />
                                                      <label>0.1</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[7]} value="7"/>
                                                      <label>0.2</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[8]} value="8"/>
                                                      <label>0.5</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[9]} value="9"/>
                                                      <label>1</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[10]} value="10"/>
                                                      <label>2</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[11]} value="11"/>
                                                      <label>5</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[12]} value="12"/>
                                                      <label>10</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[13]} value="13"/>
                                                      <label>20</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[14]} value="14"/>
                                                      <label>50</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[15]} value="15"/>
                                                      <label>100</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[16]} value="16"/>
                                                      <label>200</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[17]} value="17"/>
                                                      <label>500</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeV_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeV_AttnCboxName} checked={this.state.V_Attn[18]} value="18"/>
                                                      <label>1000</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                      </div>
                                    </div>
                                    <div className="ui steps">
                                      <div className={this.state.probeTypeSel}>

                                        <div className="grouped inline fields">
                                          <div className="field">
                                            <div className={this.state.probeTypeCboxName}>
                                              <input type="radio" name={this.state.probeTypeCboxName} checked={this.state.Probe.CURR} value="CURR" />
                                              <label>Current</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className={this.state.probeTypeI}>
                                          <h3 className="ui center aligned header">
                                            Attenuation
                                          </h3>
                                          <div className="ui grid">
                                            <div className="ui six column row">
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[0]} value="0" />
                                                      <label>0.001</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[1]} value="1"/>
                                                      <label>0.002</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[2]} value="2"/>
                                                      <label>0.005</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[3]} value="3" />
                                                      <label>0.01</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[4]} value="4"/>
                                                      <label>0.02</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[5]} value="5"/>
                                                      <label>0.05</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[6]} value="6"/>
                                                      <label>0.1</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[7]} value="7"/>
                                                      <label>0.2</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[8]} value="8"/>
                                                      <label>0.5</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[9]} value="9"/>
                                                      <label>1</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[10]} value="10"/>
                                                      <label>2</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[11]} value="11"/>
                                                      <label>5</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[12]} value="12"/>
                                                      <label>10</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[13]} value="13"/>
                                                      <label>20</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[14]} value="14"/>
                                                      <label>50</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="column">
                                                <div className="grouped inline fields">
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[15]} value="15"/>
                                                      <label>100</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[16]} value="16"/>
                                                      <label>200</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[17]} value="17"/>
                                                      <label>500</label>
                                                    </div>
                                                  </div>
                                                  <div className="field">
                                                    <div className={this.state.probeI_AttnCboxName}>
                                                      <input type="radio" name={this.state.probeI_AttnCboxName} checked={this.state.I_Attn[18]} value="18"/>
                                                      <label>1000</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                      </div>

                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="actions">
                              <div className="ui approve button">Approve</div>
                              <div className="ui cancel button">Cancel</div>
                            </div>



                  </div>

                </div>
        );
    },
});

module.exports = AppChannelMenu;
