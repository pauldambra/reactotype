/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');
var postal = window.postal = require('postal');
var bus = require('./messageBus');

var YearFilterInput = React.createClass({
	publishOnChange: function(event) {
		var eventData = {};
		eventData[this.props.name.toLowerCase()] = 
			parseInt(event.target.value, 10);

		postal.publish({
			channel: bus.channels.filters,
			topic : bus.topics.filters.yearBoundsChange,
			data: eventData
		});
	},
	render: function() {
		return (
				<div className="form-group">
					<label htmlFor={this.props.name}>{this.props.name}</label>
					<input type="number" 
						   name={this.props.name}
						   className="form-control"
						   defaultValue={this.props.default}
						   min={this.props.initialEarliest} 
						   max={this.props.initialLatest}
						   onChange={this.publishOnChange}/>
				</div>
		);
	}
});

var FilterBox = React.createClass({
	render: function() {
		return (
			<div className="col-xs-12">
				<YearFilterInput name="Earliest" 
								 default={this.props.initialEarliest}
								 initialEarliest={this.props.initialEarliest}
								 initialLatest={this.props.initialLatest} />
				<YearFilterInput name="Latest" 
								 default={this.props.initialLatest}
								 initialEarliest={this.props.initialEarliest}
								 initialLatest={this.props.initialLatest} />
			</div>
		);
	}
});

module.exports = FilterBox;