/** @jsx React.DOM */
'use strict';

var React = window.React = require('react');

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

var PayTable = React.createClass({
    render: function() {
        return (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>All</th>
                        <th>Full-time</th>
                        <th>Part-time</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.payYears.map(function(payYear) {
                      return <PayRow key={payYear.year} payYear={payYear} />;
                    })}
                </tbody>
            </table>
        );
    }
});

module.exports = PayTable;