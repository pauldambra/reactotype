/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');
var postal = window.postal = require('postal');
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

var PayTable = React.createClass({
    getInitialState: function() {
        return {
            sortDirection: 'descending',
            data: this.props.payYears.sort(sortDescending)
        };
    },
    preparePayData: function(data, options) {
        if (options.yearBounds) {
            data = data.filter(function(element) {
                        return element.year >= options.yearBounds.earliest 
                            && element.year <= options.yearBounds.latest;
                    })
        }
        if (options.sortDirection) {
            data = data.sort(options.sortDirection==='descending' 
                                ? sortDescending
                                : sortAscending);
        }
        this.setState({data: data});
    },
    sortData: function() {
        this.setState({sortDirection: this.state.sortDirection === 'descending'
                                     ? 'ascending'
                                     : 'descending'}, 
                      function() {
                        this.preparePayData(this.props.payYears, this.state);
                      })
    },
    filterData: function(filterBounds) {
        this.setState({yearBounds: filterBounds}, function() {
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