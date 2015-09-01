var msoActionCreators = require('../actions/mso-consoleActionCreators');
var msoStore          = require('../stores/mso-consoleStore');
var AppNavBar         = require('./AppNavBar.jsx');
var AppSideBar        = require('./AppSideBar.jsx');
var AppScreenViewer   = require('./AppScreenView.jsx');
var AppFooter         = require('./AppFooter.jsx');

var remote = electronRequire('remote');
var dsoDriver=remote.require('./msoDriver/index.js');
var dsoCtrl;
var AppMainView = React.createClass({



    getInitialState: function() {
        return {
            disabled: true,
            greetingsExtentionLoaded: false,
            greetingsMsg: '',
            rudeMsg: ''
        };
    },

    componentWillMount: function() {
        msoStore.addChangeListener(this._onReceiveMessage);
        dsoCtrl=dsoDriver.DsoNet(3000,'172.16.5.68');
        // dsoCtrl=dsoDriver.DsoNet(3000,'192.168.1.49');

    },

    componentDidMount: function() {

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
                    <div className='four wide column'>
                        <AppSideBar iConGridClass='ui grid' iConColumeClass='one wide column' dsoctrl={dsoCtrl}/>
                    </div>
                    <div className='twelve wide left aligned column'>
                        <AppScreenViewer dsoctrl={dsoCtrl}/>
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
