'use strict';

var msoActionCreators = require("../actions/mso-consoleActionCreators");
var msoStore          = require("../stores/mso-consoleStore");

var AppNavBar = React.createClass({


    componentWillMount: function() {

    },

    componentDidMount: function() {

    },

    componentWillUnmount: function() {

    },

    render: function() {
        return (
            <nav>
                <div className="ui menu">
                    <div className='ui dropdown link item'>
                        Measure
                        <div className="menu">
                            <div className="item">Add Measurement</div>
                            <div className="item">Remove Measurement</div>
                            <div className="item">Gating</div>
                            <div className="item">Display All</div>
                            <div className="item">High-Low</div>
                            <div className="item">Statictics</div>
                            <div className="item">Reference Levels</div>
                        </div>
                    </div>

                    <div className='ui dropdown link item'>
                        Cursor
                        <div className="menu">
                            <div className="item">H Unit</div>
                            <div className="item">V Unit</div>
                        </div>
                    </div>

                    <div className='ui dropdown link item'>
                        Acquire
                        <div className="menu">
                            <div className="item">Mode</div>
                            <div className="item">XY</div>
                            <div className="item">Record Length</div>
                            <div className="item">Expand</div>
                        </div>
                    </div>

                    <div className='ui dropdown link item'>
                        Display
                        <div className="menu">
                            <div className="item">Mode</div>
                            <div className="item">Persistence</div>
                            <div className="item">Intensity</div>
                            <div className="item">Graticule</div>
                        </div>
                    </div>

                    <div className='ui dropdown link item'>
                        Segment
                        <div className="menu">
                            <div className="item">Mode</div>
                            <div className="item">Persistence</div>
                            <div className="item">Intensity</div>
                            <div className="item">Graticule</div>
                        </div>
                    </div>

                    <div className='ui dropdown link item'>
                        LA
                        <div className="menu">
                            <div className="item">Mode</div>
                            <div className="item">Persistence</div>
                            <div className="item">Intensity</div>
                            <div className="item">Graticule</div>
                        </div>
                    </div>

                    <div className='ui dropdown link item'>
                        FG
                        <div className="menu">
                            <div className="item">Mode</div>
                            <div className="item">Persistence</div>
                            <div className="item">Intensity</div>
                            <div className="item">Graticule</div>
                        </div>
                    </div>

                    <div className='ui dropdown link item'>
                        Power
                        <div className="menu">
                            <div className="item">Mode</div>
                            <div className="item">Persistence</div>
                            <div className="item">Intensity</div>
                            <div className="item">Graticule</div>
                        </div>
                    </div>

                    <div className='ui dropdown link item'>
                        Save
                        <div className="menu">
                            <div className="item">Mode</div>
                            <div className="item">Persistence</div>
                            <div className="item">Intensity</div>
                            <div className="item">Graticule</div>
                        </div>
                    </div>

                    <div className='ui dropdown link item'>
                        Utility
                        <div className="menu">
                            <div className="item">Mode</div>
                            <div className="item">Persistence</div>
                            <div className="item">Intensity</div>
                            <div className="item">Graticule</div>
                        </div>
                    </div>

                </div>
            </nav>
        );
    },
});

module.exports = AppNavBar;
