var msoActionCreators = require('../actions/mso-consoleActionCreators');
var msoStore          = require('../stores/mso-consoleStore');
var AppNavBar         = require('./AppNavBar.jsx');
var AppSideBar        = require('./AppSideBar.jsx');
var AppScreenViewer   = require('./AppScreenView.jsx');
var AppFooter         = require('./AppFooter.jsx');

// var remote = electronRequire('remote');
// var dsoDriver = remote.require('./index.js');

var AppMainView = React.createClass({



    getInitialState: function() {
        return {
            listComponent:{},
            devList:[],
            dsoCtrl:null,
            disabled: true,
            greetingsExtentionLoaded: false,
            greetingsMsg: '',
            rudeMsg: ''
        };
    },

    componentWillMount: function() {
        var self = this;
        var listRoot;

        msoStore.addChangeListener(this._onReceiveMessage);
        // $.get("/dso",null,function(data){
        //     console.log(data);
        // });

        listRoot=React.createElement('div', {className: "ui middle aligned selection list"},"");
        this.setState({listComponent:listRoot});
        // dsoCtrl =  dsoDriver.DsoNet(3000,'172.16.5.68');
        // dsoCtrl=dsoDriver.DsoNet(3000,'192.168.1.49');

    },

    componentDidMount: function() {
        var _this = this;
        $('.button.findDev')
            .on('click', function(event) {
                $.get("/dso",null,function(data){
                    var i,j,k,len=data.length;
                    var child_i=[];
                    var listRoot={};


                    for(i=0; i<len; i++){
                        var child_j = {}, child_k = {}, child_m = {}, component = {};
                        var devInfo = data[i].name;

                        child_m = React.createElement('div', {className: "header"}
                                    ,devInfo);
                        child_k = React.createElement('div', {className: "content"}
                                    ,child_m);
                        child_j = React.createElement('div', {className: "item"}
                                    ,child_k);
                        // component = React.addons.createFragment({div:child_j});
                        child_i.push(child_j);
                        _this.state.devList.push(data[i]);

                    }
                    console.log(data);
                    listRoot = React.createElement('div', {className: "ui middle aligned selection list"},child_i);
                    _this.setState({listComponent:listRoot});

                    $('.ui.modal.findDev')
                        .modal('show');
                });
            });

        $('.selection.list')
            .on('click', function(event) {
                var i,len, dsoInst;

                console.log(event);
                console.log(event.target.innerHTML);
                for(i = 0, len = _this.state.devList.length; i < len; i++){
                    if(event.target.innerHTML === _this.state.devList[i].name){
                        // dsoInst=dsoDriver.DsoNet(_this.state.devList[i].port,_this.state.devList[i].addr);
                        $.ajax({
                              url: '/dso',
                              dataType: 'json',
                              type: 'POST',
                              data: {port:_this.state.devList[i].port, addr: _this.state.devList[i].addr},
                              success: function(data) {
                                console.log('success');
                                console.log(data);
                                _this.setState({dsoCtrl:data});
                              }.bind(this),
                              error: function(xhr, status, err) {
                                console.log('error')
                              }.bind(this)
                            });

                        break;
                    }
                }
                $('.ui.modal.findDev')
                    .modal('hide');
            });


    },

    componentWillUnmount: function() {

        msoStore.removeChangeListener(this._onReceiveMessage);
    },

    render: function() {
        var buttonClass = this.state.disabled ? 'ui disabled button' : 'ui button';

        return (
            <div>


                <AppNavBar />


                <div className='ui grid'>

                    <div className='three wide column'>

                        <div className='circular ui icon button red findDev'>
                          <i className='icon settings'></i>
                        </div>
                        <div className='circular ui icon button green closeDev'>
                          <i className='icon settings'></i>
                        </div>
                        <div className='ui modal findDev'>
                            {this.state.listComponent}
                        </div>


                        <AppSideBar iConGridClass='ui grid' iConColumeClass='one wide column' dsoctrl={this.state.dsoCtrl}/>
                    </div>

                    <div className='ten wide left aligned column'>
                        <AppScreenViewer dsoctrl={this.state.dsoCtrl}/>
                    </div>

                </div>

                <AppFooter />

            </div>
        );
    },

    toggleExtension: function(event) {
        if (this.state.disabled)
            return;
        console.log('toggleExtension');

    },

    testExtension: function(event) {
        if (this.state.disabled)
            return;

        this.setState({ greetingsMsg: '', rudeMsg: '' });
        msoActionCreators.sayHello('Mu', 'Kenny');
    },

    _onReceiveMessage: function() {
        this.setState({
            greetingsMsg: msoStore.getGreetingsMsg(),
            rudeMsg: msoStore.getRudeMsg()
        });
    }
});

module.exports = AppMainView;
