/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var postal = require('postal');
var bus = require('./messageBus');

var PayRow = React.createClass({
	render: function() {
		return (
			<tr>
				<td>{this.props.payYear.year}</td>
				<td>{this.props.payYear.all}</td>
				<td>{this.props.payYear.fulltime}</td>
				<td>{this.props.payYear.parttime}</td>
			</tr>
		);
	}
});

function sortAscending(a,b) {
	if (a.year < b.year)
	   return -1;
	if (a.year > b.year)
	   return 1;
	return 0;
};

function sortDescending(a,b) {
	if (a.year > b.year)
	   return -1;
	if (a.year < b.year)
	   return 1;
	return 0;
};

function filterPayData(data, options) {
	if (options.earliest) {
		data = data.filter(function(element) {
					return element.year >= options.earliest;
				});
	}
	if (options.latest) {
		data = data.filter(function(element) {
					return element.year <= options.latest;
				});
	}
	if (options.sortDirection) {
		data = data.sort(options.sortDirection==='descending' 
							? sortDescending
							: sortAscending);
	}
	return data;
}

var PayTable = React.createClass({
	getInitialState: function() {
		return {
			sortDirection: 'descending',
			data: this.props.payYears.sort(sortDescending)
		};
	},
	preparePayData: function(data, options) {
		data = filterPayData(data, options);
		this.setState({data: data});
	},
	sortData: function() {
		var newDirection = this.state.sortDirection === 'descending'
									 ? 'ascending'
									 : 'descending';
		this.setState({sortDirection: newDirection}, 
						function() {
						  this.preparePayData(
                                this.props.payYears, 
                                this.state);
						})
	},
	filterData: function(filterBounds) {
		var newState = React.addons.update(this.state, {$merge: filterBounds});

		this.setState(newState, function() {
			this.preparePayData(this.props.payYears, this.state);
		});
	},
	componentWillMount: function() {
		postal.subscribe({
			channel: bus.channels.filters,
			topic : bus.topics.filters.yearBoundsChange,
			callback: function(d, e) {
			this.filterData(d);
			}
		}).context(this);
	},
	render: function() {
		return (
			<table className="table table-striped">
				<thead>
					<tr>
						<th onClick={this.sortData}
							className={this.state.sortDirection}>
							Year
						</th>
						<th>All</th>
						<th>Full-time</th>
						<th>Part-time</th>
					</tr>
				</thead>
				<tbody>
					{this.state.data.map(function(payYear) {
						return <PayRow key={payYear.year} payYear={payYear} />;
					})}
				</tbody>
			</table>
		);
	}
});

module.exports = PayTable;