'use strict';

var jsdom = require('jsdom');
var React = require('react/addons');
var postal = require('postal');
var bus = require('../app/scripts/messageBus');
var FilterBox = require('../app/scripts/filterBox');
var TestUtils = React.addons.TestUtils;

var handlerReceived;

before(function() {
	postal.subscribe({
		channel: bus.channels.filters,
		topic : bus.topics.filters.yearBoundsChange,
		callback: function(data) {
			handlerReceived = data;
		}
	});
});

describe('the filter box', function() {
	var filterBoxInputs;

	beforeEach(function() {
		handlerReceived = null;
		
		//fake a dom for React to use
		global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
		global.window = document.parentWindow;

		var filterBox = TestUtils.renderIntoDocument(
			<FilterBox initialEarliest={1990} initialLatest={2010}/>
		);

		filterBoxInputs = TestUtils.scryRenderedDOMComponentsWithTag(filterBox, 'input');
	});

	describe('has a single earliest year input that', function() {
		var earliestInput;

		beforeEach(function() {
			var matchedInputs = filterBoxInputs.filter(function(element) {
				return element.props != undefined 
						&& element.props.name === 'Earliest';
			});
			
			matchedInputs.length.should.be.exactly(1);
			earliestInput = matchedInputs[0];
		});

		it('publishes an event when value changes', function() {
			TestUtils.Simulate.change(earliestInput, {target: {value: '1991'}});
			handlerReceived.should.match({earliest:1991});
		});

		it('sets initial earliest on render', function() {
			earliestInput.props.value.should.be.exactly(1990);
		});
	});

	describe('has a single latest year input that', function() {
		var latestInput;
		
		beforeEach(function() {
			var matchedInputs = filterBoxInputs.filter(function(element) {
				return element.props != undefined 
						&& element.props.name === 'Latest';
			});
			matchedInputs.length.should.be.exactly(1);
			latestInput = matchedInputs[0];
		});

		it('publishes an event when value changes', function() {
			TestUtils.Simulate.change(latestInput, {target: {value: '1991'}});
			handlerReceived.should.match({latest:1991});
		});

		it('sets initial latest on render', function() {
			latestInput.props.value.should.be.exactly(2010);
		});
	});
});