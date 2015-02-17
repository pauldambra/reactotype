/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');
var postal = window.postal = require('postal');

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
    sortData: function() {
        if(this.state.sortDirection==='descending') {
            this.setState({ 
                sortDirection: 'ascending',
                data: this.props.payYears.sort(sortAscending)
            });
        } else {
            this.setState({ 
                sortDirection: 'descending',
                data: this.props.payYears.sort(sortDescending)
            });
        }
    },
    componentWillMount: function() {
    postal.subscribe({
      channel: "filters",
      topic : "years.bounds.change",
      callback: function(d, e) {
        console.log(d);
        this.filterData(d);
      }
    }).context(this);
  },
  filterData: function(item) {
    // var items = this.state.items.concat([item]);
    // this.setState({ items: items });
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