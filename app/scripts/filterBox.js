/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');
var postal = window.postal = require('postal');
var bus = require('./messageBus');

var FilterBox = React.createClass({
    getInitialState: function() {
        return {
            earliest: this.props.initialEarliest,
            latest: this.props.initialLatest
        };
    },
    handleEarliestChange: function(event) {
    	this.setState({earliest: parseInt(event.target.value, 10)}, function() {
    		postal.publish({
	          channel: bus.channels.filters,
	          topic : bus.topics.filters.yearBoundsChange,
    			data: this.state
    		});
    	});
    },
    handleLatestChange: function(event) {
    	this.setState({latest: parseInt(event.target.value, 10)}, function() {
    		postal.publish({
          channel: bus.channels.filters,
          topic : bus.topics.filters.yearBoundsChange,
    			data: this.state
    		});
    	});
    },
    render: function() {
        return (
        	<div className="col-xs-12">
        		<div className="form-group">
        			<label htmlFor="earliest">Earliest</label>
        			<input type="number" 
        				   name="earliest"
        				   className="form-control"
        				   defaultValue={this.state.earliest}
        				   min={this.props.initialEarliest} 
        				   max={this.props.initialLatest}
        				   onChange={this.handleEarliestChange}/>
        		</div>
        		<div className="form-group">
        			<label htmlFor="latest">Latest</label>
        			<input type="number" 
        				   name="latest" 
        				   className="form-control"
        				   defaultValue={this.state.latest}
        				   min={this.props.initialEarliest} 
        				   max={this.props.initialLatest}
        				   onChange={this.handleLatestChange}/>
        		</div>
        	</div>
        );
    }
});

module.exports = FilterBox;