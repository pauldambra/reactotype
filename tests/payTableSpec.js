'use strict';

var jsdom = require('jsdom');
var postal = require('postal');
var bus = require('../app/scripts/messageBus');
var PayTable = require('../app/scripts/payTable');
var data;

describe('the pay table', function() {
	beforeEach(function() {
		//React tests when it loads if Dom is available
		//if you try to set state it gets unhappy so
		//force the result of that test to true
		require('react/lib/ExecutionEnvironment').canUseDOM = true;

		//fake a dom for React to use
		global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
		global.window = document.parentWindow;

		data = [
			{'year': '1066', 'all': 27.5, 'fulltime': 17.4, 'parttime': 0.6 },
			{'year': '1067', 'all': 27.5, 'fulltime': 17.4, 'parttime': 0.6 },
			{'year': '1068', 'all': 27.5, 'fulltime': 17.4, 'parttime': 0.6 }
		];
	});

	function getYearColumnValues(payTable, TestUtils) {
		var rows = TestUtils.scryRenderedDOMComponentsWithTag(payTable, 'tr');
		rows.length.should.be.exactly(4);

		return rows.map(function(row) {
			return row.props.children[0]._store.props.children;
		})
	}

	it('shows descending data', function() {
		var React = require('react/addons');
		var TestUtils = React.addons.TestUtils;

		var payTable = TestUtils.renderIntoDocument(
			<PayTable payYears={data} />
		);

		var rows = TestUtils.scryRenderedDOMComponentsWithTag(payTable, 'tr');
		rows.length.should.be.exactly(4);

		var columnValues = getYearColumnValues(payTable, TestUtils);

		columnValues.should.match([ 'Year', '1068', '1067', '1066' ]);
	});

	it('sorts the data when the year header is clicked', function() {
		var React = require('react/addons');
		var TestUtils = React.addons.TestUtils;

		var payTable = TestUtils.renderIntoDocument(
			<PayTable payYears={data} />
		);

		var headers = TestUtils.scryRenderedDOMComponentsWithTag(payTable, 'th');
		var yearHeader = headers[0];
		TestUtils.Simulate.click(yearHeader);

		
	    var columnValues = getYearColumnValues(payTable, TestUtils);
	    columnValues.should.match([ 'Year', '1066', '1067', '1068' ]);
	});

	it('filters the data when the messagebus publishes');
});